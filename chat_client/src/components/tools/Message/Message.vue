<template>
    <div class="message-box" :style="style[type]">
        <p class="text">{{ text }}</p>
    </div>
</template>
<script setup>
import { onMounted, ref } from "vue";
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
const visible = ref(false);
onMounted(() => {
    visible.value = true;
    setTimeout(() => {
        visible.value = false
    }, 2000);
})

</script>

<style scoped lang="scss">
.message-box {
    border-left: var(--theme-title-color) 0.1rem solid;
    box-shadow:2px 2px 5px #333333;
    width: 95%;
    top: 0.1rem;
    left: 50%;
    transform: translateX(-50%);
    position: fixed;
    margin: 0 auto;
    padding: 0.1rem;
    transition: 0.2s;
}



</style>

