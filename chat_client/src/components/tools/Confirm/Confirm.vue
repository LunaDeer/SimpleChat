<template>
    <div class="confirm-box" :style="style[type]">
        <span class="text">{{ text }}</span>
        <div class = "btn-box">
            <button @click = "sendMsg('cancel')">取消</button>
            <button @click = "sendMsg('confirm')">确定</button>
        </div>
    </div>
</template>
<script setup>
import { ref} from "vue";
import {pubsub} from "./pubsub";


const props = defineProps({
    text: {
        type: String,
        default: "",
    },
    type: {
        type: String,
        // warn 警告  error 错误  success 成功 none 默认
        default: "warn",
    },
})
const style = {
    none: {
        color: '#333',
        backgroundColor: '#ffffff',
        borderLeft: "var(--theme-title-color) 0.1rem solid",
    },
    warn: {
        color: '#333',
        backgroundColor: '#ffffff',
        borderLeft: "#D3AD0F 0.1rem solid",

    },
    error: {
        color: '#333',
        backgroundColor: '#ffffff',
        borderLeft: "#AE3D43 0.1rem solid",

    },
    success: {
        color: '#333',
        backgroundColor: '#ffffff',
        borderLeft: "#879435 0.1rem solid",
    },
};

function sendMsg(msg){
    pubsub.publish(msg);
}


</script>

<style scoped lang="scss">
.confirm-box {
    border-left: var(--theme-title-color) 0.1rem solid;
    box-shadow:2px 2px 5px #333333;
    width: 95%;
    top: 0.1rem;
    left: 50%;
    transform: translateX(-50%);
    position: fixed;
    margin: 0 auto;
    padding: 0.1rem;
    color: #fff;
    transition: 0.2s;
    .btn-box{
        text-align: right;
        *{
            margin-left: 0.1rem;
        }
    }
}



</style>

