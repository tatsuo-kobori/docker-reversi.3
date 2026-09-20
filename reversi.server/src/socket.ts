import { Server, Socket } from "socket.io";
import { EntryUserInfo } from "./types/EntryUserInfo";
import { EntryUsersList } from "./types/EntryUsersList";
import { MoveInfo } from "./types/MoveInfo";
import { BoardInfo } from "./types/BoardInfo";
import { RoomList } from "./types/RoomList";
import { searchBoard, searchPlaceToPut } from "./logic/ReversiLogic";
import config = require("config");

// タイムアウト値
const timeout = config.get<number>("timeout");

// ルームの内部状態（サーバー内でのみ保持）
interface RoomState {
	roomId: string;
	name: string;
	disabled: boolean;
	boardInfo: BoardInfo;
	entryList: EntryUserInfo[];
	inGame: boolean;
}

function boardInit(board: string[][]): void {
	for (var i=0; i < 8; i++ ) {
		board[i] = new Array();
		for (var j=0; j < 8; j++ ) {
			if ((i == 3 && j == 3) || (i == 4 && j == 4)) board[i][j] = "W";
			else if ((i == 3 && j == 4) || (i == 4 && j == 3)) board[i][j] = "B";
			else board[i][j] = "";
		}
	}
}

function gameStart(boardInfo: BoardInfo) {
	boardInit(boardInfo.board);
	boardInfo.nextTurn = "B";
	boardInfo.invertedPositions = [];
	boardInfo.placesToPut = [];
}

function judgement(boardInfo: BoardInfo) {
	const boardInfoWork: BoardInfo = JSON.parse(JSON.stringify(boardInfo));
	let blackCount = 0;
	let whiteCount = 0;
	boardInfoWork.board.forEach((line: string[]) => {
		whiteCount += line.filter(cellData => cellData === 'W').length;
		blackCount += line.filter(cellData => cellData === 'B').length;
	});
	boardInfoWork.nextTurn = "W";
	searchPlaceToPut(boardInfoWork);
	const placesToPutForWhite: number = boardInfoWork.placesToPut.length;
	boardInfoWork.nextTurn = "B";
	searchPlaceToPut(boardInfoWork);
	const placesToPutForBlack: number = boardInfoWork.placesToPut.length;
	if (((blackCount + whiteCount) == 64) ||
		(whiteCount === 0 || blackCount === 0) ||
		(placesToPutForWhite === 0 && placesToPutForBlack === 0)) {
		
		if (whiteCount > blackCount) {
			return "W";	//白の勝利
		}
		else if (blackCount > whiteCount) {
			return "B";	//黒の勝利
		}
		else {
			return "-";	//引分け
		}
	}
	return "";			//終了ではない
}

// エントリーリストの順序に基づき色を割り当てる（先頭=白、2番目=黒、以降=待機）
// 1人だけの場合は対戦にならないため待機（E）とする
function assignModes(entryList: EntryUserInfo[]): void {
	entryList.forEach((entry, index) => {
		if (index === 0 && entryList.length >= 2) entry.mode = "W";
		else if (index === 1) entry.mode = "B";
		else entry.mode = "E";
	});
}

// 対戦決着後、勝者を先頭・敗者を最後尾へ並べ替える
function rotateAfterGame(entryList: EntryUserInfo[], winner: string): void {
	if (entryList.length < 2) return;
	const white = entryList[0];
	const black = entryList[1];
	entryList.splice(0, 2);
	if (winner === "W") {
		// 白が勝ち：白は先頭維持、黒を最後尾へ
		entryList.unshift(white);
		entryList.push(black);
	} else {
		// 黒が勝ち：黒が先頭（白）に昇格、元の白を最後尾へ
		entryList.unshift(black);
		entryList.push(white);
	}
	assignModes(entryList);
}

function socket({io}: {io:Server}){
	io.disconnectSockets();
	
	const rooms: Map<string, RoomState> = new Map<string, RoomState>();
	
	// ルームを初期化して返す
	const createRoomState = (roomId: string, name: string, disabled: boolean): RoomState => {
		const room: RoomState = {
			roomId: roomId,
			name: name,
			disabled: disabled,
			boardInfo: {
				board: [],
				nextTurn: "",
				invertedPositions: [],
				placesToPut: [],
			},
			entryList: [],
			inGame: false,
		};
		gameStart(room.boardInfo);
		return room;
	};
	
	// ルーム定義を config の JSON 配列から読み込んで初期化する（roomId は配列の順番から採番）
	const roomDefs = config.get<{ name: string; disabled: boolean }[]>("rooms");
	roomDefs.forEach((def, index) => {
		const roomId = "room-" + (index + 1);
		rooms.set(roomId, createRoomState(roomId, def.name, def.disabled));
	});
	
	const emitRoomList = (): void => {
		const roomList: RoomList = { rooms: [] };
		rooms.forEach((room) => {
			roomList.rooms.push({
				roomId: room.roomId,
				name: room.name,
				disabled: room.disabled,
				entryUsers: room.entryList,
			});
		});
		io.emit("roomList", JSON.stringify(roomList));
	};
	
	// ルーム内の観戦者数（ルームに接続している人数 − エントリー人数）を求める
	const getSpectatorCount = (room: RoomState): number => {
		const roomSockets = io.sockets.adapter.rooms.get(room.roomId);
		const total = roomSockets ? roomSockets.size : 0;
		return Math.max(0, total - room.entryList.length);
	};

	const emitEntryInfo = (room: RoomState): void => {
		const entryList: EntryUsersList = {
			users: room.entryList,
			spectatorCount: getSpectatorCount(room),
		};
		io.to(room.roomId).emit("entryInfo", JSON.stringify(entryList));
		// エントリーリストの変更をルーム一覧にも反映する
		emitRoomList();
	};
	
	const emitBoardInfo = (room: RoomState): void => {
		io.to(room.roomId).emit("moveInfo", JSON.stringify(room.boardInfo));
	};
	
	// エントリーリストが2人以上なら対戦を開始する
	const startGame = (room: RoomState): void => {
		if (room.entryList.length < 2) return;
		if (room.inGame) return;
		room.inGame = true;
		gameStart(room.boardInfo);
		const searchBoardInfo: BoardInfo = JSON.parse(JSON.stringify(room.boardInfo));
		searchPlaceToPut(searchBoardInfo);
		room.boardInfo.placesToPut = searchBoardInfo.placesToPut;
		emitBoardInfo(room);
		io.to(room.entryList[0].socketId).emit('gameStart', "W");
		io.to(room.entryList[1].socketId).emit('gameStart', "B");
	};
	
	// ゲーム終了後、勝敗メッセージを表示する時間を確保するため、少し待ってから次の対戦を開始する
	const startGameAfterGameOver = (room: RoomState): void => {
		setTimeout(() => {
			startGame(room);
		}, 5000);
	};
	
	// ソケットをルームから離脱させる
	const leaveRoom = (socket: Socket): void => {
		const roomId = socket.data.roomId;
		if (!roomId) return;
		const room = rooms.get(roomId);
		if (!room) return;
		
		socket.leave(roomId);
		socket.data.roomId = undefined;
		
		const index = room.entryList.findIndex(entry => entry.socketId === socket.id);
		if (index < 0) {
			// 観戦者（エントリーしていない）の退室 → 盤面・対戦には影響しない（観戦者数の更新のみ）
			emitEntryInfo(room);
			return;
		}
		
		// エントリーしていたユーザーの退室
		room.entryList.splice(index, 1);
		
		if (room.entryList.length === 0) {
			// ルームは削除せず、盤面を初期化して待機状態に戻す
			room.inGame = false;
			gameStart(room.boardInfo);
			emitEntryInfo(room);
			emitBoardInfo(room);
		} else {
			room.inGame = false;
			assignModes(room.entryList);
			emitEntryInfo(room);
			if (room.entryList.length >= 2) {
				startGame(room);
			}
		}
	};
	
	io.on("connection", (socket: Socket) => {
		console.log(`User connected ${socket.id}`);
		
		// 接続時にルーム一覧を配信
		emitRoomList();
		
		// ルーム参加（観戦）
		socket.on("joinRoom", (roomIdStr: string) => {
			const { roomId } = JSON.parse(roomIdStr);
			const room = rooms.get(roomId);
			if (!room) return;
			// 無効なルームには入室できない
			if (room.disabled) return;
			// 既に別ルームにいる場合は離脱
			if (socket.data.roomId && socket.data.roomId !== roomId) {
				leaveRoom(socket);
			}
			socket.join(roomId);
			socket.data.roomId = roomId;
			socket.emit("roomJoined", JSON.stringify({ roomId }));
			emitBoardInfo(room);
			emitEntryInfo(room);
		});
		
		// エントリー
		socket.on("entry", (userInfoStr: string) => {
			const roomId = socket.data.roomId;
			if (!roomId) return;
			const room = rooms.get(roomId);
			if (!room) return;
			
			// 無効なルームにはエントリーできない
			if (room.disabled) return;
			// 既にエントリー済みなら無視
			if (room.entryList.some(entry => entry.socketId === socket.id)) return;
			
			const userInfo: EntryUserInfo = JSON.parse(userInfoStr);
			userInfo.socketId = socket.id;
			room.entryList.push(userInfo);
			assignModes(room.entryList);
			
			socket.emit("entryAccept", JSON.stringify({ status: "OK" }));
			emitEntryInfo(room);
			
			if (!room.inGame && room.entryList.length >= 2) {
				startGame(room);
			}
		});
		
		// 駒を置く
		socket.on("move", (moveInfoStr: string) => {
			const roomId = socket.data.roomId;
			if (!roomId) return;
			const room = rooms.get(roomId);
			if (!room) return;
			
			const moveInfo: MoveInfo = JSON.parse(moveInfoStr);
			if (room.boardInfo.placesToPut.filter(
				position => position.x === moveInfo.position.x && position.y === moveInfo.position.y).length === 0 ||
				room.boardInfo.nextTurn !== moveInfo.color) {
					//置けません
					return;
			}
			room.boardInfo.board[moveInfo.position.y][moveInfo.position.x] = moveInfo.color;
			// 判定ロジックの呼び出し
			const searchBoardInfo: BoardInfo = JSON.parse(JSON.stringify(room.boardInfo));
			searchBoard(searchBoardInfo, JSON.parse(JSON.stringify(moveInfo.position)), 'N', moveInfo.color, [], false);
			searchBoard(searchBoardInfo, JSON.parse(JSON.stringify(moveInfo.position)), 'NE', moveInfo.color, [], false);
			searchBoard(searchBoardInfo, JSON.parse(JSON.stringify(moveInfo.position)), 'E', moveInfo.color, [], false);
			searchBoard(searchBoardInfo, JSON.parse(JSON.stringify(moveInfo.position)), 'SE', moveInfo.color, [], false);
			searchBoard(searchBoardInfo, JSON.parse(JSON.stringify(moveInfo.position)), 'S', moveInfo.color, [], false);
			searchBoard(searchBoardInfo, JSON.parse(JSON.stringify(moveInfo.position)), 'SW', moveInfo.color, [], false);
			searchBoard(searchBoardInfo, JSON.parse(JSON.stringify(moveInfo.position)), 'W', moveInfo.color, [], false);
			searchBoard(searchBoardInfo, JSON.parse(JSON.stringify(moveInfo.position)), 'NW', moveInfo.color, [], false);
			room.boardInfo.board = searchBoardInfo.board;
			//勝敗判定
			const judgementResult = judgement(room.boardInfo);
			if (judgementResult === "") {
				//置ける場所の割り出しロジック呼び出し
				room.boardInfo.nextTurn = room.boardInfo.nextTurn === "W" ? "B" : "W";
				searchPlaceToPut(room.boardInfo);
				room.boardInfo.invertedPositions = searchBoardInfo.invertedPositions;
				
				emitBoardInfo(room);
			} else {
				emitBoardInfo(room);
				io.to(room.roomId).emit("gameOver", judgementResult);
				// 勝ち抜きの並べ替え
				room.inGame = false;
				rotateAfterGame(room.entryList, judgementResult);
				emitEntryInfo(room);
				startGameAfterGameOver(room);
			}
		});
		
		// パス
		socket.on("pass", () => {
			const roomId = socket.data.roomId;
			if (!roomId) return;
			const room = rooms.get(roomId);
			if (!room) return;
			
			const entry = room.entryList.find(e => e.socketId === socket.id);
			if (entry && entry.mode === room.boardInfo.nextTurn) {
				room.boardInfo.nextTurn = room.boardInfo.nextTurn === 'W' ? 'B' : 'W';
				searchPlaceToPut(room.boardInfo);
				room.boardInfo.invertedPositions = [];
				
				emitBoardInfo(room);
			}
		});
		
		// 降参
		socket.on("surrender", () => {
			const roomId = socket.data.roomId;
			if (!roomId) return;
			const room = rooms.get(roomId);
			if (!room) return;
			
			const entry = room.entryList.find(e => e.socketId === socket.id);
			if (!entry) return;
			
			if (room.inGame && (entry.mode === 'W' || entry.mode === 'B')) {
				// 対戦中に降参 → 相手の勝ち
				const winner = entry.mode === 'W' ? 'B' : 'W';
				io.to(room.roomId).emit("gameOver", winner);
				room.inGame = false;
				rotateAfterGame(room.entryList, winner);
				emitEntryInfo(room);
				startGameAfterGameOver(room);
			} else {
				// 待機中に降参 → エントリーリストから削除
				const index = room.entryList.indexOf(entry);
				room.entryList.splice(index, 1);
				assignModes(room.entryList);
				emitEntryInfo(room);
			}
		});
		
		// 退室
		socket.on("exit", () => {
			leaveRoom(socket);
		});
		
		// 切断
		socket.on("disconnect", () => {
			console.log("disconnect:"+socket.id);
			leaveRoom(socket);
		});
		
	});
}

export default socket;
