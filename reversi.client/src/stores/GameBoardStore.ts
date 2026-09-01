import { ref } from 'vue';
import { defineStore } from 'pinia';
import { BoardInfo } from "@/types/BoardInfo";
import { EntryUsersList } from "@/types/EntryUsersList";

const test = '[' +
            '["B","","","","","","","W"],' +
            '["","","","","","","",""],' +
            '["","","","","","","",""],' +
            '["","","","","","","",""],' +
            '["","","","","","","",""],' +
            '["","","","","","","",""],' +
            '["","","","","","","",""],' +
            '["W","","","","","","","B"]' +
            ']';

export const useGameBoardStore = defineStore('gameBoardStore', () => {
    // const boardInfo = ref<BoardInfo>({
    //     board: JSON.parse(JSON.stringify((new Array(8)).fill((new Array(8)).fill('B')))),
    //     invertedPositions: [],
    //     nextTurn: '',
    //     placesToPut: [],
    // } as BoardInfo);
    const boardInfo = ref<BoardInfo>({
        board: [],
        invertedPositions: [],
        nextTurn: '',
        placesToPut: [],
    } as BoardInfo);
    const entryUsersList = ref<EntryUsersList>({
        users: [],
    } as EntryUsersList);
    const turnInfo = ref<String>('' as String);

    const pieceColor = (x:number, y:number) => {
        return boardInfo.value.board.length > 0 ? boardInfo.value.board[y][x] : "";
    }

    const setBoardInfo = (info: BoardInfo):void => {
        boardInfo.value = info;
    }
    const setEntryUsersList = (usersList: EntryUsersList):void => {
        console.log("SET.START:"+JSON.stringify(entryUsersList.value));
        entryUsersList.value = usersList;
        console.log("SET.END:"+JSON.stringify(entryUsersList.value));
    }
    const setTurn = (turn: String) => {
        turnInfo.value = turn;
    }

    return { boardInfo, pieceColor, entryUsersList, turnInfo, setBoardInfo, setEntryUsersList, setTurn }
});