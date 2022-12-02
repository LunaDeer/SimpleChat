<template>
    <div class="msg-box">
        <div class="header-box"></div>
        <div class="back-box">
            <button @click = "go(-1)">{{ '<' }}</button>
            <p>
                <span>{{myid === relativeInfo.id?"我":relativeInfo.nickname}}</span>
                <span v-if = "relatives[relativeInfo.id].isOnline" style="color: #569746">◆</span>
                <span v-else style="color: #DDDDDD">◆</span>
            </p>
        </div>
        <div @click = "copyFun($event)" class="center-box" ref = "msgListBox" :style = "footerStyle">
            <div v-for="msg in msgList" :class = "msg.to_who === relativeInfo.id?'right':'left'">
                <span v-if = "msg.to_who !== relativeInfo.id">{{ relativeInfo.nickname }}:</span>
                <p>
                    {{ msg.msg }}
                </p>
                <span v-if = "msg.to_who === relativeInfo.id">:我</span>
            </div>

        </div>
        <div class="footer-box" ref = "footerDom" >
            <div class = "ipt-box">
                <textarea maxlength="128" @focus="onFocusFun" @blur="onBlurFun" type="text" v-model="msgOPbj.msg" ref = "inputRef"></textarea>
                <button @click ="sendMsgFun">发送</button>
            </div>
        </div>
    </div>
</template>
<script setup>
import {computed, nextTick, onBeforeUnmount, onMounted, ref} from 'vue';
import {copyContentH5,debounce,getSendTarget, getToken, go, removeSendTarget} from "../common/tools";
import store from "../store";
import router from "../router";
import {selectMsg} from "../api";

const count = ref(0);

let inputRef = ref(null);
let msgListBox = ref(null);

function copyFun(e){
    if(e.target.nodeName === "P"){
        copy(e.target.innerHTML);
    }
}
function copy(str){
    const inputo = document.createElement("input");
    document.body.appendChild(inputo);
    inputo.value = str;
    inputo.setAttribute('readOnly', 'readOnly')
    inputo.select();
    document.execCommand("Copy");
    document.body.removeChild(inputo);
}


let relatives = computed(()=>{
    // console.log(store.state.relatives);
    return store.state.relatives;
})
let myid = computed(()=>{
    return store.state.userInfo.id;
})

let relativeInfo = ref(getSendTarget());

if(!relativeInfo.value){
    router.replace({name:'Home'});
}

let msgOPbj = ref({
    msg:"",
    to_who:relativeInfo.value.id,
    from_who:store.state.userInfo.id
});

let msgList = ref([]);

// let sendMsgFun = debounce(()=>{
//     _sendMsgFun();
// },100);

function sendMsgFun(){
    // footerStyle.value="height: calc(60vh - 1.3rem);";
    if(t)clearInterval(t);
    if(msgOPbj.value.msg === "")return;
    ws.send(JSON.stringify(msgOPbj.value));
    if(myid.value !== relativeInfo.value.id)
        msgList.value.push(JSON.parse(JSON.stringify(msgOPbj.value)));
    inputRef.value.focus();
    msgOPbj.value.msg = "";

    nextTick(() => {
        msgListBox.value.scrollTop = msgListBox.value.scrollHeight;
        // console.log(msgListBox.value.scrollTop);
    })
}


let pid = pubSub.subscribe('onmessage', (msg) => {
    if(msg.indexOf("GM") === -1){
        msgList.value.push(JSON.parse(msg));
    }
});

let footerDom = ref(null);



let footerStyle = ref("height: calc(100vh - 1.3rem);");
let t = null;
let t2 = null;

function onFocusFun(){
    // if(t)clearTimeout(t);
    // if(t2)clearTimeout(t2);
    // footerStyle.value="height: calc(60vh - 1.3rem);"
    // t2 = setTimeout(() => {
    //     msgListBox.value.scrollTop = msgListBox.value.scrollHeight;
    // },110);
}

function onBlurFun(){
    // t = setTimeout(() => {
    //     footerStyle.value="height: calc(100vh - 1.3rem);"
    // },110);
}

onBeforeUnmount(()=>{
    removeSendTarget();
    pubSub.unsubscribe(pid);
    //告诉服务器聊天对象清空
    let data = {GM:"removeSendTarget"};
    if(!window.hasOwnProperty('ws')){
        return;
    }
    ws.send(JSON.stringify(data));

})

onMounted(()=>{
    if(!window.hasOwnProperty('ws')){
        router.replace({name:'Home'});
        return;
    }
    //设置当前聊天对象
    let sendTarget = relativeInfo.value;
    sendTarget.GM = "setSendTarget";
    ws.send(JSON.stringify(sendTarget));

    selectMsg({
        to_who:relativeInfo.value.id,
        from_who:store.state.userInfo.id,
    }).then((res) => {
        if(res.code === 200){
            msgList.value = res.msgList;
            nextTick(() => {
                msgListBox.value.scrollTop = msgListBox.value.scrollHeight;
            })
        }else{
            console.log(res);
        }
    },(error)=>{
        console.log(error);
    });
})


</script>


<style scoped lang="scss">

.msg-box {
    height: 100vh;
    width: 100vw;

    .header-box {
        height: 0.3rem;
        background: var(--theme-title-color);
    }
    .back-box {
        height: 0.3rem;
        background: #F1F3F4;
        line-height: 0.3rem;
        button{
            width: 0.4rem;
            text-align: center;
            height: 100%;
            background-color: transparent;
            color: #333;
        }
        p{
            display: inline-block;
            width: 80%;
            text-align: center;
        }
    }
    .center-box {
        transition: 0.1s;
        display:block;
        padding: 0.2rem;
        height: calc(100vh - 1.3rem);
        overflow: auto;
        width: 100vw;
        .left{
            display: flex;
            //justify-content: flex-start;
            margin: 0.2rem 0;
            p{
                padding: 0.07rem;
                width: 70%;
                background: #81A8BA;
                position:relative;
                word-break:break-all;
                //justify-content: flex-start;
            }
            p:before{
                content: "";
                position:absolute;
                bottom:-8px;
                left:0px;
                width:0;
                height:0;
                font-size:0;
                border:solid 8px;
                border-color:transparent  transparent transparent #81A8BA;
            }
        }
        .right{
            display: flex;
            justify-content: flex-end;
            margin: 0.2rem 0;
            p{
                padding: 0.07rem;
                width: 70%;
                background: #81A8BA;
                position:relative;
                word-break:break-all;
            }
            p:after{
                content: "";
                position:absolute;
                bottom:-8px;
                right:0px;
                width:0;
                height:0px;
                font-size:0;
                border:solid 8px;
                border-color:transparent #81A8BA transparent transparent;
            }
        }


    }
    .footer-box {
        height: 0.7rem;
        // background: #BBBEC0;
        .ipt-box{
            display: flex;
            bottom: 0;
            width: 100%;
            padding: 0.07rem;
            textarea{
                width: 80%;
                font-size: 0.16rem;
                height: 0.56rem;
            }
            button
            {
                width: 20%;
            }
        }
    }
}
</style>
