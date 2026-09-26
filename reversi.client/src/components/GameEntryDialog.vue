<script lang="ts" setup>
const props = defineProps<{
    isActive: boolean,
    rejectMessage: string,
}>()
const { isActive } = toRefs(props);
const emits = defineEmits<{
    (e: 'entry', value?: string): void,
    (e: 'close'): void,
    (e: 'clearReject'): void
}>();
const STORAGE_KEY = 'reversi.handleName';

const handleName = ref<string>('');
// ハンドル名の validation：文字数 > 0 かつ <= 10
const nameRules = [
    (v: string) => (!!v && v.trim().length > 0) || 'ハンドル名を入力してください',
    (v: string) => (!!v && v.length <= 10) || '10文字以内で入力してください',
];
const isValidName = computed(() => handleName.value.trim().length > 0 && handleName.value.length <= 10);
// エントリー画面を開いたとき、sessionStorage から前回のハンドル名を復元
watch(isActive, (active) => {
    if (active) {
        handleName.value = sessionStorage.getItem(STORAGE_KEY) ?? '';
    }
});
// 入力が変わったら reject エラーをクリア
watch(handleName, () => {
    emits('clearReject');
});
const onClickEntry = () => {
    if (!isValidName.value) return;
    const name = handleName.value.trim();
    sessionStorage.setItem(STORAGE_KEY, name);
    emits('entry', name);
}
const onClickClose = () => {
    emits('close');
}
const onUpdateModelValue = (value: boolean) => {
    if (!value) emits('close');
}
</script>
<template><!--activator="parent"-->
    <v-dialog :model-value="isActive" @update:model-value="onUpdateModelValue" max-width="400" class="reversi-dialog">
        <!--template v-slot:default="isActive"--><!-- -->
            <v-card rounded="lg">
                <!--v-card-title class="d-flex justify-space-between align-center text-gray-darken-4 reversi-dialog-header"-->
                    <v-card-title class="d-flex justify-space-between align-center text-gray-darken-4 reversi-dialog-header">
                <!--div class="text-h5 text-medium-emphasis ps-2"-->
                <div class="ps-2">
                <!-- Now Entry! -->
                エントリー！
                </div>

                <v-btn
                icon="mdi-close"
                variant="text"
                @click="onClickClose"
                ></v-btn>
            </v-card-title>

            <!--v-divider class="mb-4"></v-divider-->

            <v-card-text style="background:white;">
                <div class="mb-4">
                <!-- Enter your handle name and press the entry button. -->
                 ハンドルを入力してエントリーボタンを押してください。
                </div>

                <!-- <div class="mb-0">Handle Name :</div> -->
                <div class="mb-0">ハンドル :</div>

                <v-text-field
                    hide-details="auto"
                    label="ハンドル名"
                    maxlength="10"
                    v-model="handleName"
                    :rules="nameRules"
                    @keyup.enter="onClickEntry"
               ></v-text-field>

                <div v-if="rejectMessage" class="mb-2 text-red">{{ rejectMessage }}</div>
            </v-card-text>
            <div class="reversi-dialog-actions">
                <!-- <v-btn
                class="text-none"
                rounded="xl"
                text="Cancel"
                @click="onClickClose"
                ></v-btn> -->
                <v-btn
                class="text-none"
                rounded="xl"
                text="キャンセル"
                @click="onClickClose"
                ></v-btn>

                <!-- <v-btn
                class="text-none"
                color="primary"
                rounded="xl"
                text="Entry"
                variant="flat"
                @click="onClickEntry"
                ></v-btn> -->
                <v-btn
                class="text-none"
                color="primary"
                rounded="xl"
                text="エントリー"
                variant="flat"
                :disabled="!isValidName"
                @click="onClickEntry"
                ></v-btn>

            </div>

            <!--v-divider class="mt-2"></v-divider-->

            <!--v-card-actions class="my-2 d-flex justify-end">
                <v-btn
                class="text-none"
                rounded="xl"
                text="Cancel"
                @click="isActive.value = false"
                ></v-btn>

                <v-btn
                class="text-none"
                color="primary"
                rounded="xl"
                text="Entry"
                variant="flat"
                @click="isActive.value = false"
                ></v-btn>
            </v-card-actions-->
            </v-card>
        <!--/template-->
    </v-dialog>
</template>
<style scope>
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
.reversi-dialog-actions {
    text-align:right;
    background:white;
    padding-bottom:10px;
    /* padding-right:10px; */
}
.reversi-dialog-actions .v-btn {
    margin-right: 10px;
}
.v-btn--icon.v-btn--density-default {
    width: 18px !important;
    height: 18px !important;
}



</style>