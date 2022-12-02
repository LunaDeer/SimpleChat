<template>
    <div>
        <router-view></router-view>
    </div>
</template>

<script setup>
import {getUserInfo, removeSendTarget} from "./common/tools";
import {onBeforeUnmount, onMounted} from "vue";
import store from "./store";
import MyWebSocket from "./api/ws/ws";
import {selectMyRelative} from "./api";

onMounted(async () => {
    try {
        getUserInfo();
    } catch (err) {
        console.log('err', err)
    }
})
onBeforeUnmount(()=>{
    ws.close();
})

</script>

<style scoped lang="scss">
</style>
