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
    emits('move', x, y);
}
</script>
<template>
    <div class="board">
        <div v-for="y in 8" :key="y" class="board-row">
            <div
                v-for="x in 8"
                :key="x"
                class="board-cell"
                @click="move(x - 1, y - 1)"
            >
                <game-square :piece-color="pieceColor(x - 1, y - 1)" />
            </div>
        </div>
    </div>
</template>

<style scoped>
.board {
    width: 100%;
    max-width: 480px;
    aspect-ratio: 1 / 1;
    display: grid;
    grid-template-rows: repeat(8, 1fr);
    box-shadow: 6px 6px 10px 0px rgba(0, 0, 0, 0.4);
}
.board-row {
    display: grid;
    grid-template-columns: repeat(8, 1fr);
}
.board-cell {
    display: flex;
    align-items: center;
    justify-content: center;
    border: 1px solid white;
    background-color: green;
    overflow: hidden;
    cursor: pointer;
}
.board-cell:hover {
    background-color: darkgreen;
}
</style>
