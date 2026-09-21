<script lang="ts" setup>
const props = defineProps<{
    pieceColor: string
}>();
onMounted(() => {
    // マスチェック・デバッグ用
    // console.log(props.pieceColor);
})
</script>
<template>
    <img v-if="pieceColor == 'B'" src="@/assets/images/black.png" class="piece" alt="black" />
    <img v-else-if="pieceColor == 'W'" src="@/assets/images/white.png" class="piece" alt="white" />
</template>
<style scoped>
.piece {
    width: 100%;
    height: auto;
}
</style>