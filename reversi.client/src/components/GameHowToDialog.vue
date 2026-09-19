<script lang="ts" setup>
import MarkdownIt from 'markdown-it';
import howToMarkdown from '@/content/howTo.md?raw';

const props = defineProps<{
    isActive: boolean,
}>();
const { isActive } = toRefs(props);
const emits = defineEmits<{
    (e: 'close'): void,
}>();
const onClickClose = () => {
    emits('close');
};
const onUpdateModelValue = (value: boolean) => {
    if (!value) emits('close');
};

// Markdown → HTML 変換（生HTMLは無効化して安全性を確保）
const md = new MarkdownIt({
    html: false,
    linkify: true,
});
const howToHtml = md.render(howToMarkdown);
</script>
<template>
    <v-dialog :model-value="isActive" @update:model-value="onUpdateModelValue" max-width="480" class="reversi-dialog">
        <v-card rounded="lg">
            <v-card-title class="d-flex justify-space-between align-center reversi-dialog-header">
                <div class="ps-2">
                    あそび方
                </div>
                <v-btn
                    icon="mdi-close"
                    variant="text"
                    @click="onClickClose"
                ></v-btn>
            </v-card-title>

            <v-card-text style="background:white;">
                <div class="how-to-body markdown-body" v-html="howToHtml"></div>
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
.how-to-body {
    padding: 8px 0;
    line-height: 1.6;
    max-height: 60vh;
    overflow-y: auto;
}
/* Markdown 本文の基本フォントサイズ（ここを変えると本文・見出しが一括で追従） */
.markdown-body {
    font-size: 0.8rem;
}
/* Markdown 本文のスタイル（v-html で注入される要素にも適用するため :deep() を使用） */
.markdown-body :deep(h1) {
    font-size: 1.4em;
    font-weight: 700;
    margin: 0 0 75px;
}
.markdown-body :deep(h2) {
    font-size: 1.15em;
    font-weight: 700;
    margin: 16px 0 8px;
    border-bottom: 1px solid #e0e0e0;
    padding-bottom: 4px;
}
.markdown-body :deep(h3) {
    font-size: 1.05em;
    font-weight: 700;
    margin: 12px 0 6px;
}
.markdown-body :deep(p) {
    margin: 0 0 8px;
}
.markdown-body :deep(ul),
.markdown-body :deep(ol) {
    margin: 0 0 8px;
    padding-left: 1.5em;
}
.markdown-body :deep(li) {
    margin: 2px 0;
}
.markdown-body :deep(strong) {
    font-weight: 700;
}
.markdown-body :deep(code) {
    background: #f5f5f5;
    border-radius: 4px;
    padding: 1px 4px;
    font-family: monospace;
}
.markdown-body :deep(pre) {
    background: #f5f5f5;
    border-radius: 6px;
    padding: 8px 12px;
    overflow-x: auto;
}
.markdown-body :deep(pre code) {
    background: transparent;
    padding: 0;
}
</style>
