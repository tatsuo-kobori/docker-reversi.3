<script lang="ts" setup>
import { EntryUsersList } from "@/types/EntryUsersList";

const props = defineProps<{
    isActive: boolean,
    entryUsers: EntryUsersList,
}>();
const { isActive, entryUsers } = toRefs(props);
const emits = defineEmits<{
    (e: 'close'): void,
}>();
const onClickClose = () => {
    emits('close');
};
const onUpdateModelValue = (value: boolean) => {
    if (!value) emits('close');
};
// 待機中のユーザーに待機順位を付けて表示する（配列[0]=白、[1]=黒、[2]以降=待機）
const waitingRankText = (index: number): string => {
    return index >= 2 ? `待機中（${index - 1}番目）` : '待機中';
};
</script>
<template>
    <v-dialog :model-value="isActive" @update:model-value="onUpdateModelValue" max-width="400" class="reversi-dialog">
        <v-card rounded="lg">
            <v-card-title class="d-flex justify-space-between align-center reversi-dialog-header">
                <div class="ps-2">
                    <!-- Entry People -->
                    エントリー中のユーザー
                </div>
                <v-btn
                    icon="mdi-close"
                    variant="text"
                    @click="onClickClose"
                ></v-btn>
            </v-card-title>

            <v-card-text style="background:white;">
                <template v-if="entryUsers.users.length === 0">
                    <div class="text-center py-4">
                        <!-- No users are currently entered. -->
                        エントリー中のユーザーはいません。
                    </div>
                </template>
                <template v-else>
                    <v-list class="entry-users-list" color="transparent">
                        <v-list-item
                            v-for="(user, index) in entryUsers.users"
                            :key="user.socketId"
                            :title="user.name"
                        >
                            <template v-slot:prepend>
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
                            </template>
                            <template v-slot:subtitle>
                                <span v-if="user.mode === 'B'">対戦中（黒）</span>
                                <span v-else-if="user.mode === 'W'">対戦中（白）</span>
                                <span v-else>{{ waitingRankText(index) }}</span>
                            </template>
                        </v-list-item>
                    </v-list>
                </template>
                <div class="spectator-count">
                    観戦者数：{{ entryUsers.spectatorCount }}人
                </div>
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
.entry-users-list {
    max-height: 320px;
    overflow-y: auto;
}
.mode-mark {
    width: 24px;
    height: 24px;
    object-fit: cover;
    margin-right: 8px;
}
.mode-mark-empty {
    display: inline-block;
    width: 24px;
    height: 24px;
    background: transparent;
}
.spectator-count {
    text-align: right;
    font-size: 0.8rem;
    color: #d32f2f;
    margin-top: 8px;
}
</style>
