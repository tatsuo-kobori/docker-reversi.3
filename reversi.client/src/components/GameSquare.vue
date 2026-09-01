<script lang="ts" setup>
import white from "@/assets/images/white.png";
import black from "@/assets/images/black.png";
const props = defineProps<{
    pieceColor: string
}>();
onMounted(() => {
    console.log(props.pieceColor);
})
</script>
<template>
    <v-img v-if="pieceColor == 'B'" src="@/assets/images/black.png" width="50px" alt="black" />
    <v-img v-else-if="pieceColor == 'W'" src="@/assets/images/white.png" width="50px" alt="white" />
</template>