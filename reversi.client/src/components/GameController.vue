<script lang="ts" setup>
const emits = defineEmits<{
    (e: 'pass'): void,
    (e: 'give-up'): void,
}>();
// 一度クリックしたら、状態変化（ターン交代／降参）でボタンが再表示されるまで非アクティブにする
const actionsDisabled = ref(false);
const onPass = () => {
  if (actionsDisabled.value) return;
  actionsDisabled.value = true;
  emits('pass');
}
const onGiveUp = () => {
  if (actionsDisabled.value) return;
  actionsDisabled.value = true;
  emits('give-up');
}
</script>
<template>
  <div class="fill-height reversi-game-controller">
    <!-- <v-btn color="#008080" @click="onPass">PASS!</v-btn> -->
    <v-btn color="#008080" :disabled="actionsDisabled" @click="onPass">パス！</v-btn>
    <!-- <v-btn color="#008080" @click="onGiveUp">GIVE UP!</v-btn> -->
    <v-btn color="#008080" :disabled="actionsDisabled" @click="onGiveUp">まいった！</v-btn>
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
