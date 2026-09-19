import { ref } from 'vue';
import { defineStore } from 'pinia';
import { BoardInfo } from "@/types/BoardInfo";
import { EntryUsersList } from "@/types/EntryUsersList";
import { RoomList } from "@/types/RoomList";

export const useGameBoardStore = defineStore('gameBoardStore', () => {
    const boardInfo = ref<BoardInfo>({
        board: [],
        invertedPositions: [],
        nextTurn: '',
        placesToPut: [],
    } as BoardInfo);
    const entryUsersList = ref<EntryUsersList>({
        users: [],
        spectatorCount: 0,
    } as EntryUsersList);
    const roomList = ref<RoomList>({
        rooms: [],
    } as RoomList);
    const currentRoomId = ref<string>('');
    const turnInfo = ref<String>('' as String);

    const pieceColor = (x:number, y:number) => {
        return boardInfo.value.board.length > 0 ? boardInfo.value.board[y][x] : "";
    }

    const setBoardInfo = (info: BoardInfo):void => {
        boardInfo.value = info;
    }
    const setEntryUsersList = (usersList: EntryUsersList):void => {
        entryUsersList.value = usersList;
    }
    const setRoomList = (rooms: RoomList):void => {
        roomList.value = rooms;
    }
    const setCurrentRoomId = (roomId: string):void => {
        currentRoomId.value = roomId;
    }
    const setTurn = (turn: String) => {
        turnInfo.value = turn;
    }

    return { boardInfo, pieceColor, entryUsersList, roomList, currentRoomId, turnInfo, setBoardInfo, setEntryUsersList, setRoomList, setCurrentRoomId, setTurn }
});
