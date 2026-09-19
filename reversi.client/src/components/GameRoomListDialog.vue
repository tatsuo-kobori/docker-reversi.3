<script lang="ts" setup>
import { RoomList } from "@/types/RoomList";
import { RoomInfo } from "@/types/RoomInfo";

const props = defineProps<{
    isActive: boolean,
    roomList: RoomList,
    currentRoomId: string,
}>();
const { isActive, roomList, currentRoomId } = toRefs(props);
const emits = defineEmits<{
    (e: 'close'): void,
    (e: 'joinRoom', roomId: string): void,
}>();
const onClickClose = () => {
    emits('close');
};
const onUpdateModelValue = (value: boolean) => {
    if (!value) emits('close');
};
const onClickRoomItem = (room: RoomInfo) => {
    if (room.disabled || room.roomId === currentRoomId.value) return;
    emits('joinRoom', room.roomId);
};
// 未入室（currentRoomId が空）の間は、ルームを選択するまで閉じられない
const mustSelect = computed(() => currentRoomId.value === "");
</script>
<template>
    <v-dialog :model-value="isActive" :persistent="mustSelect" @update:model-value="onUpdateModelValue" max-width="480" class="reversi-dialog">
        <v-card rounded="lg">
            <v-card-title class="d-flex justify-space-between align-center reversi-dialog-header">
                <div class="ps-2">ルーム一覧</div>
                <v-btn
                    v-if="!mustSelect"
                    icon="mdi-close"
                    variant="text"
                    @click="onClickClose"
                ></v-btn>
            </v-card-title>

            <v-card-text style="background:white;">
                <template v-if="roomList.rooms.length === 0">
                    <div class="text-center py-4">
                        ルームがありません。
                    </div>
                </template>
                <template v-else>
                    <div class="room-list">
                        <div
                            v-for="room in roomList.rooms"
                            :key="room.roomId"
                            class="room-item"
                            :class="{ 'room-item-disabled': room.disabled || room.roomId === currentRoomId }"
                            @click="onClickRoomItem(room)"
                        >
                            <div class="room-header">
                                <span class="room-id">{{ room.name }}</span>
                                <span v-if="room.disabled" class="room-disabled">利用不可</span>
                                <span v-else-if="room.roomId === currentRoomId" class="room-current">入室中</span>
                            </div>
                            <div class="room-users">
                                <template v-if="room.entryUsers.length === 0">
                                    <span class="room-empty">エントリー者なし</span>
                                </template>
                                <template v-else>
                                    <div
                                        v-for="user in room.entryUsers"
                                        :key="user.socketId"
                                        class="room-user"
                                    >
                                        <img
                                            v-if="user.mode === 'B'"
                                            src="@/assets/images/black.png"
                                            class="mode-mark"
                                            alt="黒"
                                        />
                                        <img
                                            v-else-if="user.mode === 'W'"
                                            src="@/assets/images/white.png"
                                            class="mode-mark"
                                            alt="白"
                                        />
                                        <span v-else class="mode-mark mode-mark-empty"></span>
                                        <span class="room-user-name">{{ user.name }}</span>
                                        <span v-if="user.mode === 'B'" class="room-user-mode">対戦中（黒）</span>
                                        <span v-else-if="user.mode === 'W'" class="room-user-mode">対戦中（白）</span>
                                        <span v-else class="room-user-mode">待機中</span>
                                    </div>
                                </template>
                            </div>
                        </div>
                    </div>
                </template>
            </v-card-text>
        </v-card>
    </v-dialog>
</template>
<style scoped>
.reversi-dialog {
    box-shadow: 6px 6px 10px 0px rgba(0, 0, 0, 0.4);
}
.reversi-dialog-header {
    font-size: 1.125rem !important;
    line-height: 1.0;
    height: 42px;
    padding: 10px !important;
}
.reversi-dialog-header .mdi-close {
    font-size: 18px !important;
    width: 12px;
}
.reversi-dialog-header .v-card-title {
    line-height: 1.0 !important;
    padding: 0px !important;
}
.room-list {
    max-height: 360px;
    overflow-y: auto;
}
.room-item {
    border: solid 1px #e0e0e0;
    border-radius: 8px;
    padding: 10px 12px;
    margin-bottom: 10px;
    cursor: pointer;
    transition: background-color 0.15s, border-color 0.15s;
}
.room-item:hover {
    background-color: #f5f5f5;
    border-color: #4caf50;
}
.room-item-disabled {
    cursor: default;
    opacity: 0.6;
}
.room-item-disabled:hover {
    background-color: transparent;
    border-color: #e0e0e0;
}
.room-header {
    display: flex;
    align-items: center;
    gap: 8px;
    margin-bottom: 6px;
}
.room-id {
    font-weight: 700;
    font-size: 1rem;
}
.room-current {
    font-size: 0.75rem;
    color: #fff;
    background: #1976d2;
    border-radius: 10px;
    padding: 1px 8px;
}
.room-disabled {
    font-size: 0.75rem;
    color: #fff;
    background: #9e9e9e;
    border-radius: 10px;
    padding: 1px 8px;
}
.room-users {
    margin-bottom: 6px;
}
.room-empty {
    color: #888;
    font-size: 0.85rem;
}
.room-user {
    display: flex;
    align-items: center;
    gap: 4px;
    padding: 2px 0;
}
.room-user-name {
    font-weight: 600;
}
.room-user-mode {
    color: #666;
    font-size: 0.8rem;
}
.mode-mark {
    width: 20px;
    height: 20px;
    object-fit: cover;
    margin-right: 4px;
}
.mode-mark-empty {
    display: inline-block;
    width: 20px;
    height: 20px;
    background: transparent;
}
</style>
