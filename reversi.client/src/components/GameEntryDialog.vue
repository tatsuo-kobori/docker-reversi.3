<script lang="ts" setup>
const props = defineProps<{
    isActive: boolean,
}>()
const { isActive } = toRefs(props);
const emits = defineEmits<{
    (e: 'entry', value?: string): void,
    (e: 'close'): void
}>();
const handleName = ref<string>('');
const onClickEntry = () => {
    emits('entry', handleName.value);
}
const onClickClose = () => {
    emits('close');
}
</script>
<template><!--activator="parent"-->
    <v-dialog v-model=isActive max-width="400" class="reversi-dialog">
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
                    label="Handle Name"
                    maxlength="10"
                    v-model="handleName"
               ></v-text-field>

                <div class="mb-2 text-red">maximum 10 characters</div>
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
    font-size: 18px !important;
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