<script lang="ts" setup>
import GameSquare from "@/components/GameSquare.vue";
import { BoardInfo } from "@/types/BoardInfo";

const props = defineProps<{
    boardInfo: BoardInfo
}>();
const emits = defineEmits<{
    (e: 'move', x: number, y: number): void,
}>();

const pieceColor = (x:number, y:number) => {
    return (props.boardInfo.board && props.boardInfo.board.length > 0) ? props.boardInfo.board[y][x] : "";
}
const move = (x:number, y:number) => {
    console.log(x + ":" + y);
    emits('move', x, y);
}
// const Piece = function(color: string) {
//   return (<>
//     {color === "W" && (
//       <img src={white} width="50px" alt="white"/>
//     )}
//     {color === "B" && (
//       <img src={black} width="50px" alt="black"/>
//     )}
//     </>
//   );
// }
onMounted(() => {
    console.log(JSON.stringify(props.boardInfo));
})
const bb = 'B';
</script>
<template>
    <table class="App-board">
        <tbody>
            <tr>
                <td @click=move(0,0)><game-square :piece-color=pieceColor(0,0) /></td>
                <td @click=move(1,0)><game-square :piece-color=pieceColor(1,0) /></td>
                <td @click=move(2,0)><game-square :piece-color=pieceColor(2,0) /></td>
                <td @click=move(3,0)><game-square :piece-color=pieceColor(3,0) /></td>
                <td @click=move(4,0)><game-square :piece-color=pieceColor(4,0) /></td>
                <td @click=move(5,0)><game-square :piece-color=pieceColor(5,0) /></td>
                <td @click=move(6,0)><game-square :piece-color=pieceColor(6,0) /></td>
                <td @click=move(7,0)><game-square :piece-color=pieceColor(7,0) /></td>
            </tr>
            <tr>
                <td @click=move(0,1)><game-square :piece-color=pieceColor(0,1) /></td>
                <td @click=move(1,1)><game-square :piece-color=pieceColor(1,1) /></td>
                <td @click=move(2,1)><game-square :piece-color=pieceColor(2,1) /></td>
                <td @click=move(3,1)><game-square :piece-color=pieceColor(3,1) /></td>
                <td @click=move(4,1)><game-square :piece-color=pieceColor(4,1) /></td>
                <td @click=move(5,1)><game-square :piece-color=pieceColor(5,1) /></td>
                <td @click=move(6,1)><game-square :piece-color=pieceColor(6,1) /></td>
                <td @click=move(7,1)><game-square :piece-color=pieceColor(7,1) /></td>
            </tr>
            <tr>
                <td @click=move(0,2)><game-square :piece-color=pieceColor(0,2) /></td>
                <td @click=move(1,2)><game-square :piece-color=pieceColor(1,2) /></td>
                <td @click=move(2,2)><game-square :piece-color=pieceColor(2,2) /></td>
                <td @click=move(3,2)><game-square :piece-color=pieceColor(3,2) /></td>
                <td @click=move(4,2)><game-square :piece-color=pieceColor(4,2) /></td>
                <td @click=move(5,2)><game-square :piece-color=pieceColor(5,2) /></td>
                <td @click=move(6,2)><game-square :piece-color=pieceColor(6,2) /></td>
                <td @click=move(7,2)><game-square :piece-color=pieceColor(7,2) /></td>
            </tr>
            <tr>
                <td @click=move(0,3)><game-square :piece-color=pieceColor(0,3) /></td>
                <td @click=move(1,3)><game-square :piece-color=pieceColor(1,3) /></td>
                <td @click=move(2,3)><game-square :piece-color=pieceColor(2,3) /></td>
                <td @click=move(3,3)><game-square :piece-color=pieceColor(3,3) /></td>
                <td @click=move(4,3)><game-square :piece-color=pieceColor(4,3) /></td>
                <td @click=move(5,3)><game-square :piece-color=pieceColor(5,3) /></td>
                <td @click=move(6,3)><game-square :piece-color=pieceColor(6,3) /></td>
                <td @click=move(7,3)><game-square :piece-color=pieceColor(7,3) /></td>
            </tr>
            <tr>
                <td @click=move(0,4)><game-square :piece-color=pieceColor(0,4) /></td>
                <td @click=move(1,4)><game-square :piece-color=pieceColor(1,4) /></td>
                <td @click=move(2,4)><game-square :piece-color=pieceColor(2,4) /></td>
                <td @click=move(3,4)><game-square :piece-color=pieceColor(3,4) /></td>
                <td @click=move(4,4)><game-square :piece-color=pieceColor(4,4) /></td>
                <td @click=move(5,4)><game-square :piece-color=pieceColor(5,4) /></td>
                <td @click=move(6,4)><game-square :piece-color=pieceColor(6,4) /></td>
                <td @click=move(7,4)><game-square :piece-color=pieceColor(7,4) /></td>
            </tr>
            <tr>
                <td @click=move(0,5)><game-square :piece-color=pieceColor(0,5) /></td>
                <td @click=move(1,5)><game-square :piece-color=pieceColor(1,5) /></td>
                <td @click=move(2,5)><game-square :piece-color=pieceColor(2,5) /></td>
                <td @click=move(3,5)><game-square :piece-color=pieceColor(3,5) /></td>
                <td @click=move(4,5)><game-square :piece-color=pieceColor(4,5) /></td>
                <td @click=move(5,5)><game-square :piece-color=pieceColor(5,5) /></td>
                <td @click=move(6,5)><game-square :piece-color=pieceColor(6,5) /></td>
                <td @click=move(7,5)><game-square :piece-color=pieceColor(7,5) /></td>
            </tr>
            <tr>
                <td @click=move(0,6)><game-square :piece-color=pieceColor(0,6) /></td>
                <td @click=move(1,6)><game-square :piece-color=pieceColor(1,6) /></td>
                <td @click=move(2,6)><game-square :piece-color=pieceColor(2,6) /></td>
                <td @click=move(3,6)><game-square :piece-color=pieceColor(3,6) /></td>
                <td @click=move(4,6)><game-square :piece-color=pieceColor(4,6) /></td>
                <td @click=move(5,6)><game-square :piece-color=pieceColor(5,6) /></td>
                <td @click=move(6,6)><game-square :piece-color=pieceColor(6,6) /></td>
                <td @click=move(7,6)><game-square :piece-color=pieceColor(7,6) /></td>
            </tr>
            <tr>
                <td @click=move(0,7)><game-square :piece-color=pieceColor(0,7) /></td>
                <td @click=move(1,7)><game-square :piece-color=pieceColor(1,7) /></td>
                <td @click=move(2,7)><game-square :piece-color=pieceColor(2,7) /></td>
                <td @click=move(3,7)><game-square :piece-color=pieceColor(3,7) /></td>
                <td @click=move(4,7)><game-square :piece-color=pieceColor(4,7) /></td>
                <td @click=move(5,7)><game-square :piece-color=pieceColor(5,7) /></td>
                <td @click=move(6,7)><game-square :piece-color=pieceColor(6,7) /></td>
                <td @click=move(7,7)><game-square :piece-color=pieceColor(7,7) /></td>
            </tr>
        </tbody>
    </table>
</template>

<style scoped>
table.App-board {
    width: 390px;
    height: 390px;
    /* float: left; */
    border-collapse: collapse;
    box-shadow: 6px 6px 10px 0px rgba(0, 0, 0, 0.4);
    /*box-shadow: 
        0px 2px 4px -1px var(--v-shadow-key-umbra-opacity, rgba(0, 0, 0, 0.2)), 
        0px 4px 5px 0px var(--v-shadow-key-penumbra-opacity, rgba(0, 0, 0, 0.14)), 
        0px 1px 10px 0px var(--v-shadow-key-ambient-opacity, rgba(0, 0, 0, 0.12));*/
}
table.App-board td {
    border: solid 1px white;
    width: 48px;
    height: 48px;
    min-width: 48px;
    min-height: 48px;
    background-color: green;
    overflow: hidden;
    text-align: center;
    vertical-align: middle;
}
table.App-board td:hover {
  background-color: darkgreen;
}
</style>
