<script lang="ts" setup>
  import { EntryUsersList } from "@/types/EntryUsersList";

  const props = defineProps<{
    currentTurn: String,
    mode: String,
    inGame: boolean,
  }>();
  const { currentTurn, mode, inGame } = toRefs(props);
</script>
<template>
    <div style="color:black; height: 48px; text-align:center;" class="fill-height">
      <div class="mx-auto align-center rounded-lg reversi-infomation">
        <template v-if="inGame && (mode === 'B' || mode === 'W') && mode === currentTurn">
          <!-- <span :class="{'black-icon':currentTurn == 'B'
                        ,'white-icon':currentTurn == 'W'}">Now it's your turn.</span> -->
          <span :class="{'black-icon':currentTurn == 'B'
                        ,'white-icon':currentTurn == 'W'}">あなたのターンです</span>
        </template>
        <template v-else-if="inGame && (mode === 'B' || mode === 'W') && mode !== currentTurn">
          <!-- <span :class="{'black-icon':(currentTurn == 'B')
                        ,'white-icon':(currentTurn == 'W')}">Now it's your opponent's turn.</span> -->
          <span :class="{'black-icon':(currentTurn == 'B')
                        ,'white-icon':(currentTurn == 'W')}">相手のターンです</span>
        </template>
        <template v-else>
          <!-- <span>Watching the game.</span> -->
          <span>観戦モード！</span>
        </template>
      </div>
    </div>
</template>
<style scoped>
.reversi-infomation {
  background: whitesmoke;
  color: #303030;
  width: 400px;
  height: 48px;
  font-weight: 600;
  display: flex;
  justify-content:center;
  align-items:center;
  box-shadow: 6px 6px 10px 0px rgba(0, 0, 0, 0.4);
  /*box-shadow: 
    0px 2px 4px -1px var(--v-shadow-key-umbra-opacity, rgba(0, 0, 0, 0.2)), 
    0px 4px 5px 0px var(--v-shadow-key-penumbra-opacity, rgba(0, 0, 0, 0.14)), 
    0px 1px 10px 0px var(--v-shadow-key-ambient-opacity, rgba(0, 0, 0, 0.12));*/
}
.img-icon {
  width: 24px;
  height: 24px;
}
.white-icon::before {
    content: "";
    display: inline-block;
    width: 24px;
    height: 24px;
    /*background-color: red;*/
    background-image: url("@/assets/images/white.png");
    background-position: center;
    background-size: contain;
    vertical-align: bottom;
}
.black-icon::before {
    content: "";
    display: inline-block;
    width: 24px;
    height: 24px;
    /*background-color: red;*/
    background-image: url("@/assets/images/black.png");
    background-position: center;
    background-size: contain;
    vertical-align: bottom;
}
</style>
