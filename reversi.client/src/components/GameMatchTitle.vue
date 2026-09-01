<template>
    <div style="color:black; height: 48px; text-align:center;" class="fill-height">
        <template v-if="entryUsers.users.length == 2">
            <div class="mx-auto align-center rounded-lg match-title">
                <!--span class="user-b">tat</span><span class="user-vs">VS</span><span class="user-w">hoge</span-->
                <table>
                    <tbody>
                    <tr>
                        <td class="user-w"><span>{{entryUsers.users[0].name}}</span></td>
                        <td class="user-vs">VS</td>
                        <td class="user-b"><span>{{entryUsers.users[1].name}}</span></td>
                    </tr>
                </tbody>
                </table>
            </div>
        </template>
        <template v-else-if="entryUsers.users.length == 1">
            <div class="mx-auto align-center rounded-lg match-title">
                <!-- {{entryUsers.users[0].name}} is waiting for challengers. -->
                {{entryUsers.users[0].name}} が、挑戦者を待機中...
            </div>
        </template>
        <template v-else>
            <div class="mx-auto align-center rounded-lg match-title">
                <!-- Now accepting participants. -->
                エントリーをお待ちしています！
            </div>
        </template>
    </div>
</template>
<script lang="ts" setup>
  import {defineProps} from 'vue'
  import { EntryUsersList } from "@/types/EntryUsersList";
  //  type Props = {
//    message: string;
//  };
//   export default defineComponent({
//     props: {
//       message: {
//         type: String,
//         default: ""
//       }
//     },
//     setup() {
//       return {
//       };
//     }
//   });EntryUsersList
  const props = defineProps<{
    entryUsers: EntryUsersList,
  }>();
  const { entryUsers } = toRefs(props);
</script>
<style scoped>
.match-title {
    border:solid 1px dimgray;
    /* background: var(--v-theme-panel);*/
    /* background: #f5fffa;*/
    background: whitesmoke;
    width:400px;
    height:48px;
    font-weight: 600;
    display:flex;
    align-items:center;
    justify-content:center;
    box-shadow: 6px 6px 10px 0px rgba(0, 0, 0, 0.4);
    /*box-shadow: 
    0px 2px 4px -1px var(--v-shadow-key-umbra-opacity, rgba(0, 0, 0, 0.2)), 
    0px 4px 5px 0px var(--v-shadow-key-penumbra-opacity, rgba(0, 0, 0, 0.14)), 
    0px 1px 10px 0px var(--v-shadow-key-ambient-opacity, rgba(0, 0, 0, 0.12));*/
}
.match-title table {
    width: 400px;
    table-layout: fixed;
}
.match-title .user-vs {
    width: 65px;
    color: rgb(183, 1, 1);
    font-weight:900;
    margin: 0px;
    padding-top:2px;
}
.match-title .user-w,
.match-title .user-b {
    width: 150px;
    font-weight:700;
    padding: 0px;
    overflow: hidden;
}
.match-title .user-b {
    text-align: left;
}
.match-title .user-w {
    text-align: right;
}
.match-title .user-b span,
.match-title .user-w span {
    width: 95px;
    vertical-align:middle;
    font-size:11pt;
    overflow: hidden;
    color: #2b2b2b;
}
.match-title .user-vs::before {
    content: "";
    display: inline-block;
    width: 24px;
    height: 24px;
    /*background-color: red;*/
    background-image: url("@/assets/images/white.png");
    background-position: center;
    background-size: contain;
    margin-top: -2px;
}
.match-title .user-vs::after {
     content: "";
    display: inline-block;
    width: 24px;
    height: 24px;
    /*background-color: red;*/
    background-image: url("@/assets/images/black.png");
    background-position: center;
    background-size: contain;
    margin-top: -2px;
}
</style>
