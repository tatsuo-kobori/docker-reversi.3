<script lang="ts" setup>
  const isSplash:Ref<boolean> = ref<boolean>(false);
  const message:Ref<String> = ref<String>('');
  const showSplash = (msg:String, showTime: number) => {
    message.value = msg;
    isSplash.value = true;
    setTimeout(() => {
      isSplash.value = false;
    }, showTime);
  }
  defineExpose({
    showSplash,
  });
</script>
<template>
    <v-dialog v-model="isSplash" id="splash" max-width="380">
        <v-card class="bg-white">
            <v-card-text  class="d-flex align-center justify-center fill-height">{{ message }}</v-card-text>
        </v-card>
    </v-dialog>
</template>