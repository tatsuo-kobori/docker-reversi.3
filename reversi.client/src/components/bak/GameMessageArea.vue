<template>
    <div style="color:black; height: 48px; text-align:center;" class="fill-height">
    <div class="mx-auto align-center rounded-lg reversi-message-area">
        {{message}}
    </div>
    </div>
</template>
<script lang="ts" setup>
//  import {computed, createComponent} from 'vue'
//  type Props = {
//    message: string;
//  };
  const props = defineProps<{
    message: string
  }>()
  // export default createComponent({
  //   props: {
  //     message: {
  //       type: String,
  //       default: ""
  //     }
  //   },
  //   setup() {
  //     const myMessage = computed(() => props.value);
  //     return {
  //       myMessage,
  //     };
  //   }
  // });
//   export default createCom{
//     props: {
// //      message: String
//     },
//     setup() {
//       const message = ref('')
//       return {
//         message
//       }
//     }
//   }
</script>
<style scoped>
.reversi-message-area {
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
</style>
