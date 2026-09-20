<script lang="ts" setup>
const emits = defineEmits<{
    (e: 'pass'): void,
    (e: 'give-up'): void,
}>();
const onPass = () => {
  emits('pass');
}
const onGiveUp = () => {
  emits('give-up');
}
</script>
<template>
  <div class="fill-height reversi-game-controller">
    <!-- <v-btn color="#008080" @click="onPass">PASS!</v-btn> -->
    <v-btn color="#008080" @click="onPass">パス！</v-btn>
    <!-- <v-btn color="#008080" @click="onGiveUp">GIVE UP!</v-btn> -->
    <v-btn color="#008080" @click="onGiveUp">まいった！</v-btn>
  </div>
</template>
<style scoped>
.reversi-game-controller {
    height: 64px;
    display: flex;
    align-items: center;
    justify-content: center;
}
.reversi-game-controller button {
    width: 8em;
    font-weight: bold;
    margin: 0px 5px;
}
</style>
