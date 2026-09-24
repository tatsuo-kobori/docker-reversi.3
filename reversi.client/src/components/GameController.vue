<script lang="ts" setup>
const emits = defineEmits<{
    (e: 'pass'): void,
    (e: 'give-up'): void,
}>();
const onPass = () => {
  emits('pass');
}
// ダブルクリックで降参が2回発火し、2回目が「待機中の退出」扱いになるのを防ぐ
let giveUpLocked = false;
const onGiveUp = () => {
  if (giveUpLocked) return;
  giveUpLocked = true;
  emits('give-up');
  setTimeout(() => { giveUpLocked = false; }, 1000);
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
    height: 60px;
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
