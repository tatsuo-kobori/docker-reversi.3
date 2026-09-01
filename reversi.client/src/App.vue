<script lang="ts" setup>
import GameBoard from '@/components/GameBoard.vue'
import GameInformation from '@/components/GameInformation.vue'
import MatchTitle from '@/components/GameMatchTitle.vue'
import GameController from '@/components/GameController.vue'
import GameEntryDialog from '@/components/GameEntryDialog.vue'
import GameSplash from '@/components/GameSplash.vue'
import { useGameBoardStore } from '@/stores/GameBoardStore.ts';
// import { EntryUsersList } from "@/types/EntryUsersList";
import { EntryUserInfo } from "@/types/EntryUserInfo";
import { BoardInfo } from "@/types/BoardInfo";
// import { Position } from "@/types/Position";

import io from 'socket.io-client';
import { SOCKET_URL } from './config/default';
const isNowEntry = ref(false);
const gameBoardStore = useGameBoardStore();
const {boardInfo, entryUsersList} = storeToRefs(gameBoardStore);
//const { decycle, encycle } = require('json-cyclic');
// const boardInfo = gameBoardStore.boardInfo;
// const entryUsersList = gameBoardStore.entryUsersList;
// const turn = gameBoardStore.turnInfo;
// const pieceColor = gameBoardStore.pieceColor;
const drawer = ref(false);
const group = ref(null);
const entryName = ref<string>('');
const inGame = ref<boolean>(false);
const isSplash = ref<boolean>(false);
const splashMessage = ref<String>('');
const splash = ref<InstanceType<typeof GameSplash> | null>(null);

onMounted(() => {
  console.log("MOUNTED!!");
});
const socket = io(SOCKET_URL);
//サーバーからのデータ受け取り処理
socket.on( "connect", () => {
	console.log("接続:"+socket.id);
}); //接続
socket.on( "disconnect", () => {
	console.log("切断");
}); //切断

socket.on("entryInfo", (entryUsersListStr: string) => {
  let entryUsers = JSON.parse(entryUsersListStr);
  // console.log(JSON.stringify(entryUsers));
  gameBoardStore.setEntryUsersList(entryUsers);
  // console.log("AFTER:"+JSON.stringify(entryUsersList));
});
  
socket.on("moveInfo", (boardInfoStr: string) => {
    const info: BoardInfo = JSON.parse(boardInfoStr);
    gameBoardStore.setBoardInfo(info);
    gameBoardStore.setTurn(info.nextTurn);
});
  
socket.on("gameStart", (players: string) => {
  inGame.value = true;
  // splash.value?.showSplash("Game Start!", 5000);
  splash.value?.showSplash("ゲーム開始！", 5000);
});
  
socket.on("gameOver", (winner: string) => {
  inGame.value = false;
  if (mode() === winner) {
    //勝利画面をスプラッシュ表示
    // splash.value?.showSplash("You Win!", 5000);
    splash.value?.showSplash("貴方の勝ちです！", 5000);
  }
  else if (mode() === (winner === 'W' ? 'B' : 'W')) {
    //敗北画面をスプラッシュ表示
    // plash.value?.showSplash("You Lose...", 5000);
    splash.value?.showSplash("負けました...", 5000);
  }
});
const viewSplash = (message: string, showTime: number) => {
    splashMessage.value = message;
    isSplash.value = true;
    setTimeout(() => {
      isSplash.value = false;
    }, showTime);
};
const isEntry = () => {
  return (entryUsersList.value.users.filter((entry) => entry.socketId === socket.id).length > 0);
}
const mode = () => {
  const myEntry: EntryUserInfo[] | null = entryUsersList.value.users.filter(entry => entry.socketId === socket.id);
  if (myEntry !== null && myEntry.length > 0) return myEntry[0].mode;
  return "";
}
const currentTurn = () => {
  return boardInfo.value.nextTurn;
}
const onMove = (x:number, y:number) => {
  const myMode: string = mode();
  if (myMode !== 'W' && myMode !== 'B') return;

  const data = {
    color: myMode,
    position: {
      x: x,
      y: y,
    }
  }
  console.log(data);
  console.log(boardInfo.value.nextTurn);
  socket.emit('move', JSON.stringify(data));
}
const handleEntry = () => {
    let entryUserInfo: EntryUserInfo = {
      name: entryName.value,
      detail: "",
      mode: "",
      socketId: "",
    }
    socket.emit("entry", JSON.stringify(entryUserInfo));
}
const onEntry = (value?: string) => {
  let entryUserInfo: EntryUserInfo = {
      name: value as string,
      detail: "",
      mode: "",
      socketId: "",
    }
    console.log(JSON.stringify(entryUserInfo));
    socket.emit("entry", JSON.stringify(entryUserInfo));
    isNowEntry.value = false;
}
const onEntryCancel = () => {
  isNowEntry.value = false;
}
const onExit = () => {
  socket.emit("exit");
  drawer.value = false;
}
const onPass = () => {
  socket.emit("pass", "");
}
const onGiveUp = () => {
  socket.emit("surrender", "");
}
const onShowEntryDialog = () => {
  isNowEntry.value = true;
  drawer.value = false;
}
</script>

<template>
  <v-app class="rounded rounded-md">
    <!-- 上段ナビゲーション -->
    <v-app-bar>
      <div class="mx-auto"><v-img :width="150" src="@/assets/images/REVERSI-logo.png" alt="REVERSI"></v-img></div>
      <!-- <div class="ml-n14"> -->
        <v-app-bar-nav-icon class="mr-3" valiant="text" @click.stop="drawer = !drawer"></v-app-bar-nav-icon>
        <!-- <v-app-bar-nav-icon class="ms-2" valiant="text" @click.stop="drawer = !drawer"></v-app-bar-nav-icon> -->
      <!-- </div> -->
    </v-app-bar>
    <v-navigation-drawer
        v-model="drawer"
        class="reversi-menu"
        location='right'
        width="200"
        temporary
    >
      <v-list color="transparent">
        <v-list-item prepend-icon="mdi-login-variant" title="Entry" @click="onShowEntryDialog" id="menu-entry" :disabled="isEntry()"></v-list-item>
        <v-list-item prepend-icon="mdi-account-multiple" title="Entry People"></v-list-item>
        <v-list-item prepend-icon="mdi-logout-variant" title="Exit" @click="onExit" :disabled="!isEntry()"></v-list-item>
      </v-list>
    </v-navigation-drawer>
    <!-- メインコンテンツ -->
    <v-main class="d-flex align-center" style="min-height: 300px">
      <table>
        <tbody>
        <tr>
          <td style="text-align:center; padding-bottom:15px;"><match-title :entry-users=entryUsersList /></td>
        </tr>
        <tr>
          <td><game-board :board-info=boardInfo @move="onMove"></game-board></td>
        </tr>
        <tr>
          <td style="text-align:center; padding-top:15px;">
            <game-information :in-game=inGame :mode=mode() :currentTurn=currentTurn() />
          </td>
        </tr>
      </tbody>
      </table>
      <!-- v-row justify="center" align-content="center"><v-col>HOGE</v-col></v-row -->
    </v-main>

    <!-- 下段ナビゲーション -->
    <v-footer class="d-flex align-center justify-center reversi-footer" dark app height="64" absolute>
      <template v-if="currentTurn() === mode()">
        <game-controller @pass="onPass" @give-up="onGiveUp"/>
      </template>
    </v-footer>
    <game-entry-dialog :is-active=isNowEntry @entry="onEntry" @close="onEntryCancel" />
    <game-splash ref="splash" />
    <!-- <v-dialog v-model="isSplash" id="splash" max-width="380"><v-card class="bg-white"><v-card-text  class="d-flex align-center justify-center fill-height">{{ splashMessage }}</v-card-text></v-card></v-dialog> -->
  </v-app>
</template>
<style>
html {
  overflow: hidden !important;
  scrollbar-width: none;
  -ms-overflow-style: none;
}
html::-webkit-scrollbar {
  width: 0;
  height: 0;
}
body {
  font-family: "Arial","メイリオ";
}
</style>
<style scoped>
.d-flex {
    display: flex !important;
    flex-wrap: nowrap;
    align-content: center;
    justify-content: center;
}
header.v-bottom-navigation {
  height: 64px !important;
}
div.v-bottom-navigation__content {
  height: 64px;
}
.reversi-footer {
  width: 100% !important;
  z-index: 2000 !important;
  box-shadow: 0px -1px 10px 0px rgba(0, 0, 0, 0.4);
}
.reversi-footer button {
  font-weight: bold;
}
.reversi-menu {
  background: whitesmoke;
}
.reversi-menu .v-list-item:hover {
  background-color: gainsboro;
}
</style>
