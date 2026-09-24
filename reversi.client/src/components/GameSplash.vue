<script lang="ts" setup>
  const isSplash:Ref<boolean> = ref<boolean>(false);
  const message:Ref<String> = ref<String>('');
  const imageSrc:Ref<String> = ref<String>('');
  let hideTimer: ReturnType<typeof setTimeout> | null = null;

  const showSplash = (msg:String, showTime: number) => {
    // 前回の非表示タイマーをクリアして、メッセージが即座に消えないようにする
    if (hideTimer !== null) {
      clearTimeout(hideTimer);
    }
    message.value = msg;
    imageSrc.value = '';
    isSplash.value = true;
    hideTimer = setTimeout(() => {
      isSplash.value = false;
      hideTimer = null;
    }, showTime);
  }

  const showImageSplash = (src: String, showTime: number) => {
    if (hideTimer !== null) {
      clearTimeout(hideTimer);
    }
    imageSrc.value = src;
    message.value = '';
    isSplash.value = true;
    hideTimer = setTimeout(() => {
      isSplash.value = false;
      hideTimer = null;
    }, showTime);
  }

  defineExpose({
    showSplash,
    showImageSplash,
  });
</script>
<template>
    <div v-if="isSplash" class="splash-overlay">
        <img v-if="imageSrc" :src="imageSrc" class="splash-image" alt="" />
        <div v-else class="splash-text">{{ message }}</div>
    </div>
</template>
<style scoped>
.splash-overlay {
    position: fixed;
    inset: 0;
    z-index: 9999;
    display: flex;
    align-items: center;
    justify-content: center;
    pointer-events: none;
}
.splash-image {
    max-width: 432px; /* 盤面(最大480px)の約90% */
    width: auto;
    height: auto;
    filter: drop-shadow(0 4px 12px rgba(0, 0, 0, 0.5));
}
/* モバイルでは盤面(78%)の約90%に合わせる */
@media (max-width: 576px) {
    .splash-image {
        max-width: 70vw;
    }
}
.splash-text {
    font-size: 2.5rem;
    font-weight: bold;
    color: #fff;
    text-shadow: 0 2px 10px rgba(0, 0, 0, 0.8), 0 0 20px rgba(0, 0, 0, 0.5);
}
</style>
