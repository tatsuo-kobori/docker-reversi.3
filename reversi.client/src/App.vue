<script lang="ts" setup>
import GameBoard from '@/components/GameBoard.vue'
import GameInformation from '@/components/GameInformation.vue'
import MatchTitle from '@/components/GameMatchTitle.vue'
import GameController from '@/components/GameController.vue'
import GameEntryDialog from '@/components/GameEntryDialog.vue'
import GameRoomListDialog from '@/components/GameRoomListDialog.vue'
import GameSplash from '@/components/GameSplash.vue'
import winImage from '@/assets/images/win.png'
import loseImage from '@/assets/images/lose.png'
import startImage from '@/assets/images/start.png'
import startSound from '@/assets/sounds/start.wav'
import winSound from '@/assets/sounds/win.wav'
import loseSound from '@/assets/sounds/lose.wav'
import turnSound from '@/assets/sounds/turn.wav'
import { useGameBoardStore } from '@/stores/GameBoardStore.ts';
// import { EntryUsersList } from "@/types/EntryUsersList";
import { EntryUserInfo } from "@/types/EntryUserInfo";
import { BoardInfo } from "@/types/BoardInfo";
import { RoomList } from "@/types/RoomList";
// import { Position } from "@/types/Position";

import io from 'socket.io-client';
import { SOCKET_URL } from './config/default';
const isNowEntry = ref(false);
const entryRejectMessage = ref<string>('');
const isEntryUsersDialog = ref(false);
const isHowToDialog = ref(false);
const isRoomListDialog = ref(false);
const gameBoardStore = useGameBoardStore();
const {boardInfo, entryUsersList, roomList, currentRoomId} = storeToRefs(gameBoardStore);
//const { decycle, encycle } = require('json-cyclic');
// const boardInfo = gameBoardStore.boardInfo;
// const entryUsersList = gameBoardStore.entryUsersList;
// const turn = gameBoardStore.turnInfo;
// const pieceColor = gameBoardStore.pieceColor;
const drawer = ref(false);
const drawerWidth = ref(256);
const group = ref(null);
const entryName = ref<string>('');
const inGame = ref<boolean>(false);
const isSplash = ref<boolean>(false);
const splashMessage = ref<String>('');
const splash = ref<InstanceType<typeof GameSplash> | null>(null);
const isMuted = ref<boolean>(localStorage.getItem('reversi.isMuted') !== 'false');
const previousTurn = ref<string>('');

const soundUrls = {
  start: startSound,
  win: winSound,
  lose: loseSound,
  turn: turnSound,
} as const;

const playSound = (key: keyof typeof soundUrls) => {
  if (isMuted.value) return;
  const audio = new Audio(soundUrls[key]);
  audio.play().catch(() => {});
};

const toggleMute = () => {
  isMuted.value = !isMuted.value;
  localStorage.setItem('reversi.isMuted', String(isMuted.value));
};

const updateDrawerWidth = () => {
  drawerWidth.value = Math.min(Math.max(window.innerWidth * 0.25, 200), 300);
};
onMounted(() => {
  console.log("MOUNTED!!");
  updateDrawerWidth();
  window.addEventListener('resize', updateDrawerWidth);
});
onBeforeUnmount(() => {
  window.removeEventListener('resize', updateDrawerWidth);
});
const socket = io(SOCKET_URL);
//サーバーからのデータ受け取り処理
socket.on( "connect", () => {
	console.log("接続:"+socket.id);
}); //接続
socket.on( "disconnect", () => {
	console.log("切断");
}); //切断

// ルーム一覧の受信
socket.on("roomList", (roomListStr: string) => {
  const rooms: RoomList = JSON.parse(roomListStr);
  gameBoardStore.setRoomList(rooms);
  // ルーム未入室の場合のみルーム一覧を表示
  if (currentRoomId.value === "") {
    isRoomListDialog.value = true;
  }
});

// ルーム入室（作成・参加）後に自分のルームIDを受信
socket.on("roomJoined", (roomIdStr: string) => {
  const { roomId } = JSON.parse(roomIdStr);
  gameBoardStore.setCurrentRoomId(roomId);
  isRoomListDialog.value = false;
  // ルーム選択後はエントリー画面を開く
  isNowEntry.value = true;
  entryRejectMessage.value = '';
});

// エントリー成功（サーバーが受け付けた）
socket.on("entryAccept", (msg: string) => {
  isNowEntry.value = false;
});
// エントリー拒否（同名ユーザーなど）
socket.on("entryReject", (msg: string) => {
  const { reason } = JSON.parse(msg);
  if (reason === "duplicateName") {
    entryRejectMessage.value = "このハンドル名は既に使用されています";
  }
});

socket.on("entryInfo", (entryUsersListStr: string) => {
  let entryUsers = JSON.parse(entryUsersListStr);
  // console.log(JSON.stringify(entryUsers));
  gameBoardStore.setEntryUsersList(entryUsers);
  // console.log("AFTER:"+JSON.stringify(entryUsersList));
});
  
socket.on("moveInfo", (boardInfoStr: string) => {
    const info: BoardInfo = JSON.parse(boardInfoStr);
    const newTurn = info.nextTurn;
    // ターンが変化したら音を鳴らす（ゲーム開始直後の初回 moveInfo は inGame=false なので鳴らさない）
    if (inGame.value && previousTurn.value !== '' && newTurn !== previousTurn.value) {
        playSound('turn');
    }
    previousTurn.value = newTurn;
    gameBoardStore.setBoardInfo(info);
    gameBoardStore.setTurn(info.nextTurn);
});
  
socket.on("gameStart", (players: string) => {
  inGame.value = true;
  previousTurn.value = '';
  playSound('start');
  splash.value?.showImageSplash(startImage, 5000);
});
  
socket.on("gameOver", (winner: string) => {
  inGame.value = false;
  previousTurn.value = '';
  if (mode() === winner) {
    //勝利画面をオーバーレイ表示
    playSound('win');
    splash.value?.showImageSplash(winImage, 5000);
  }
  else if (mode() === (winner === 'W' ? 'B' : 'W')) {
    //敗北画面をオーバーレイ表示
    playSound('lose');
    splash.value?.showImageSplash(loseImage, 5000);
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
const isInRoom = () => {
  return currentRoomId.value !== "";
}
// 現在居るルームの名称（ルーム一覧から roomId で検索）
const currentRoomName = computed(() => {
  const room = roomList.value.rooms.find(r => r.roomId === currentRoomId.value);
  return room ? room.name : '';
});
const mode = () => {
  const myEntry: EntryUserInfo[] | null = entryUsersList.value.users.filter(entry => entry.socketId === socket.id);
  if (myEntry !== null && myEntry.length > 0) return myEntry[0].mode;
  return "";
}
// 自分の待機順位（エントリー配列の index - 1。配列[0]=白、[1]=黒、[2]以降=待機）
const myWaitingRank = computed(() => {
  const idx = entryUsersList.value.users.findIndex(entry => entry.socketId === socket.id);
  return idx >= 2 ? idx - 1 : null;
});
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
    // ダイアログは entryAccept 受信時に閉じる（entryReject 時は開いたままエラー表示）
}
const onEntryCancel = () => {
  isNowEntry.value = false;
}
const onExit = () => {
  socket.emit("exit");
  gameBoardStore.setCurrentRoomId("");
  drawer.value = false;
  isRoomListDialog.value = true;
}
const onPass = () => {
  socket.emit("pass", "");
}
const onGiveUp = () => {
  socket.emit("surrender", "");
}
const onShowEntryDialog = () => {
  isNowEntry.value = true;
  entryRejectMessage.value = '';
  drawer.value = false;
}
const onShowEntryUsersDialog = () => {
  isEntryUsersDialog.value = true;
  drawer.value = false;
}
const onCloseEntryUsersDialog = () => {
  isEntryUsersDialog.value = false;
}
const onShowRoomList = () => {
  isRoomListDialog.value = true;
  drawer.value = false;
}
const onCloseRoomListDialog = () => {
  isRoomListDialog.value = false;
}
const onJoinRoom = (roomId: string) => {
  socket.emit("joinRoom", JSON.stringify({ roomId }));
}
const onShowHowToDialog = () => {
  isHowToDialog.value = true;
}
const onCloseHowToDialog = () => {
  isHowToDialog.value = false;
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
        temporary
        :width="drawerWidth"
    >
      <v-list color="transparent">
        <v-list-item prepend-icon="mdi-view-list" title="ルーム一覧" @click="onShowRoomList"></v-list-item>
        <v-list-item prepend-icon="mdi-login-variant" title="エントリー" @click="onShowEntryDialog" id="menu-entry" :disabled="isEntry() || !isInRoom()"></v-list-item>
        <v-list-item prepend-icon="mdi-account-multiple" title="エントリー一覧" @click="onShowEntryUsersDialog" :disabled="!isInRoom()"></v-list-item>
        <v-list-item prepend-icon="mdi-logout-variant" title="退室" @click="onExit" :disabled="!isInRoom()"></v-list-item>
      </v-list>
    </v-navigation-drawer>
    <!-- メインコンテンツ -->
    <v-main class="d-flex align-items-center justify-content-center" style="min-height: 300px">
      <div class="container">
        <div class="row justify-content-center">
          <div class="col-12 col-sm-10 col-md-8 col-lg-6 col-xl-5">
            <div class="text-center mb-2">
              <div v-if="currentRoomName" class="room-name-label mx-auto">
                <v-icon icon="mdi-door" size="small" class="me-1"></v-icon>
                <span>現在のルーム: {{ currentRoomName }}</span>
              </div>
            </div>
            <div class="text-center mb-3">
              <match-title :entry-users="entryUsersList" />
            </div>
            <div class="d-flex justify-content-center">
              <game-board :board-info="boardInfo" @move="onMove"></game-board>
            </div>
            <div class="text-center mt-3">
              <game-information :in-game="inGame" :mode="mode()" :currentTurn="currentTurn()" :waiting-rank="myWaitingRank" />
            </div>
          </div>
        </div>
      </div>
    </v-main>

    <!-- 下段ナビゲーション -->
    <v-footer class="d-flex align-center justify-center reversi-footer" dark app height="64" absolute>
      <div class="footer-inner">
        <template v-if="currentTurn() === mode()">
          <game-controller @pass="onPass" @give-up="onGiveUp"/>
        </template>
        <v-btn
          class="how-to-button"
          color="primary"
          variant="elevated"
          prepend-icon="mdi-help-circle-outline"
          @click="onShowHowToDialog"
        >
          あそび方
        </v-btn>
      </div>
    </v-footer>
    <v-btn
      class="sound-toggle"
      :icon="isMuted ? 'mdi-volume-off' : 'mdi-volume-high'"
      variant="text"
      size="large"
      :title="isMuted ? 'サウンドをON' : 'サウンドをOFF'"
      @click="toggleMute"
    ></v-btn>
    <game-room-list-dialog :is-active="isRoomListDialog" :room-list="roomList" :current-room-id="currentRoomId" @close="onCloseRoomListDialog" @join-room="onJoinRoom" />
    <game-entry-dialog :is-active="isNowEntry" :reject-message="entryRejectMessage" @entry="onEntry" @close="onEntryCancel" @clear-reject="entryRejectMessage = ''" />
    <game-entry-users-dialog :is-active="isEntryUsersDialog" :entry-users="entryUsersList" @close="onCloseEntryUsersDialog" />
    <game-how-to-dialog :is-active="isHowToDialog" @close="onCloseHowToDialog" />
    <game-splash ref="splash" />
    <!-- <v-dialog v-model="isSplash" id="splash" max-width="380"><v-card class="bg-white"><v-card-text  class="d-flex align-center justify-center fill-height">{{ splashMessage }}</v-card-text></v-card></v-dialog> -->
  </v-app>
</template>
<style>
html {
  overflow: hidden !important;
  scrollbar-width: none;
  -ms-overflow-style: none;
  /* 画面幅に応じてルートフォントサイズを流動的に変化させる */
  font-size: clamp(14px, 0.5vw + 12px, 18px);
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
.room-name-label {
  width: 100%;
  max-width: 480px;
  height: 48px;
  font-weight: 700;
  display: flex;
  align-items: center;
  justify-content: center;
  background: #1976d2;
  color: #fff;
  border-radius: 8px;
  box-shadow: 6px 6px 10px 0px rgba(0, 0, 0, 0.4);
}
.footer-inner {
  position: relative;
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
}
.how-to-button {
  font-weight: 700;
}
.sound-toggle {
  position: fixed;
  right: 12px;
  bottom: 76px;
  background: rgba(0, 0, 0, 0.35);
  color: #fff;
  z-index: 2000;
}
</style>
