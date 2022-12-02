<template>
    <div class="relative-box">
        <div ref = "tipboxRef" :style="refreshStyleObj">
            <div ref="tipmsgRef" >松开刷新好友列表</div>
        </div>
<!--        <div>-->
<!--            <a @click = "refreshList">刷新好友列表</a>-->
<!--        </div>-->
        <div class = "relative-list-box" ref = "wrapRef">
            <div v-for = "(relative,i) in relatives" @click = "showRelativeInfo(relative)">
                <h2><span v-if = "relative.isOnline" style="color: #569746">◆</span><span v-else style="color: #DDDDDD">◆</span>{{myid === relative.id?"我":relative.nickname}} </h2>
                <h2>帐号:{{relative.id}} </h2>
            </div>
        </div>



        <Dialog v-model= "isShow">
            昵称:{{relativeInfo.nickname}}
            <br>
            帐号:{{relativeInfo.id}}
            <br>
            签名:{{relativeInfo.signature}}

            <div style="text-align: right">
                <button @click="msgFun">&nbsp;&nbsp;&nbsp;发消息&nbsp;&nbsp;&nbsp;</button>
            </div>
        </Dialog>
    </div>
</template>
<script setup>
import {computed, onMounted, ref} from 'vue';
import {selectMyRelative, selectUserInfo} from "../api";
import router from "../router";
import {debounce, getSendTarget, searchRelativeFun, setSendTarget, initWsAndTelatives} from "../common/tools";
import store from "../store";
import Dialog from "./tools/Dialog/Dialog.vue";
import {pullRefresh} from "../common/hooks/pullRefresh";
import Message from "./tools/Message/Message";


let refreshCallBack = debounce(()=>{
    initWsAndTelatives(true);
},500);

let {tipboxRef,
    tipmsgRef,
    wrapRef,
    refreshStyleObj} = pullRefresh(refreshCallBack);




function msgFun (){
    router.replace({name:'Msg'});
    setSendTarget(relativeInfo.value);
    // localStorage.setItem("recentChatRelatives",JSON.stringify([relativeInfo.value]));
}

//弹出好友信息
let isShow = ref(false);
let relativeInfo =ref();
function showRelativeInfo(relative){
    selectUserInfo({id:relative.id}).then((res) => {
        if(res.code === 200){
            relativeInfo.value = res.relative;
        }else{
            console.log(res);
        }
    },(error)=>{
        console.log(error);
    });

    relativeInfo.value = relative;
    console.log(relative);
    isShow.value = true;
}
let myid = computed(()=>{
    return store.state.userInfo.id;
})

let relatives = computed(()=>{
    // console.log(store.state.relatives);
    return store.state.relatives;
})


// ws.onMessage = (msg)=>{
//     console.log(msg,"dsfafasfdasfdsafd");
//     if(msg.indexOf("GM") !== -1){
//         console.log(msg,"fffff");
//         console.log(JSON.parse(msg));
//         let {OnlineClient} = JSON.parse(msg);
//         OnlineClient.forEach((item)=>{
//             relatives.value[item].isOnline = true;
//         })
//     }
// }


</script>



<style scoped lang="scss">
.relative-box{
    background: var(--theme-body-color);
    overflow: auto;
    height: 100%;
    .relative-list-box{
        &>div>h2:nth-child(1){
            font-size: 0.24rem;
        }
        &>div>h2:nth-child(2){
            font-size: 0.16rem;
        }
        &>div{
            padding: 0.04rem;
            margin: 0.03rem 0;
            background: var(--theme-background-color);
        }
        &>div:hover{
            padding: 0.04rem;
            margin: 0.03rem 0;
            background: #eee;
        }
    }
}
</style>
