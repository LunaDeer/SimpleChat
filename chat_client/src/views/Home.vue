<template>
    <div class="home-box">
        <div class="header-box">
<!--            <button @click = "go(-1)">{{ '<' }}</button>-->
        </div>
        <div class="center-box">
            <router-view></router-view>
        </div>
        <div class="footer-box">
            <ul>
                <li :style = "{background:page === 'Chat'?'var(--theme-title-color)':''}" @click = "chatFun">
                    <span>未读消息<i v-if = "unreadMsg.size !== 0"></i></span>
                </li>
                <li :style = "{background:page === 'Relative'?'var(--theme-title-color)':''}" @click = "relativeFun">
                    <span>联系人</span>
                </li>
                <li :style = "{background:page === 'My'?'var(--theme-title-color)':''}" @click = "myFun">
                    <span>我的</span>
                </li>
            </ul>
        </div>
    </div>
</template>

<script setup>
import router from '@/router';
import {computed, ref} from "vue";
import store from "../store";
import {go} from "../common/tools";


let userInfo = {
    account: '',
    password: '',
};

let page =  ref((()=>{
    let a = location.hash.split('/');
    return a[a.length-1];
})())

function chatFun(){
    page.value = "Chat";
    router.replace({ name: 'Chat' });
}
function relativeFun(){
    page.value = "Relative";
    router.replace({ name: 'Relative' });
}
function myFun(){
    page.value = "My";
    router.replace({ name: 'My' });
}



let unreadMsg = computed(()=>{
    return store.state.unreadMsg;
})


</script>

<style lang="scss">
.home-box {
    height: 100vh;
    width: 100vw;
    overflow: hidden;
    .header-box {
        height: 0.24rem;
        background: var(--theme-title-color);
        button{
            width: 0.4rem;
            text-align: center;
            height: 100%;
            background-color: transparent;
            color: #333;
        }
    }
    .center-box {
        position: relative;
        height: calc(100vh - 0.74rem);
    }
    .footer-box {
        height: 0.5rem;
        background:var(--theme-background-color);
        ul{
            height: 100%;
            display: flex;
            justify-content: space-around;
            li{

                text-align: center;
                line-height: 0.4rem;
                width: calc(100vw / 3);
                height: 100%;
                background-color: transparent;
                span{
                    position: relative;
                    i{
                        display: block;
                        position: absolute;
                        top: -0.05em;
                        right: -0.05rem;
                        width: 0.1rem;
                        height: 0.1rem;
                        border-radius: 50%;
                        background: #cc1b1b;
                    }
                }
            }
        }
    }
}
</style>
