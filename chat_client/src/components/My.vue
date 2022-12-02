<template>
    <div class="my-box">
<!--        <img-->
<!--              title="头像"-->
<!--              :src="imgSrc"-->
<!--              @click="fileRef.click()"-->
<!--        />-->
<!--        <input-->
<!--            type="file"-->
<!--            hidden-->
<!--            accept="image/*"-->
<!--            ref="fileRef"-->
<!--            @change="checkPic($event)"-->
<!--        >-->


        <main>

            <h2 @click = "openDialogFun(mode.setNickname)">{{userInfo.nickname}}</h2>
            <h2>帐号:{{userInfo.id}}</h2>
            <h2 @click = "openDialogFun(mode.setSignature)">个性签名:{{userInfo.signature}}</h2>
        </main>


        <div @click = "logoutFun">
            <span>退出登录</span>
        </div>


        <div @click = "test">
            <span>v1.0</span>
        </div>
        <button @click = "test">11111</button>
        <button @click = "test2">22222</button>
    </div>


    <Dialog v-model= "isShow">
        <span>{{currentMode}}:</span>
        <textarea maxlength="32" style="width: 100%" type="text" v-model="iptVal"></textarea>
        <div style="text-align: right;margin-top: 0.1rem">
            <button @click = "setNicknameFun">&nbsp;&nbsp;&nbsp;确认修改&nbsp;&nbsp;&nbsp;</button>
        </div>
    </Dialog>

</template>
<script setup>
import {computed, ref} from 'vue';
import {getToken, setUserInfo} from "../common/tools";
import store from "../store";
import router from "../router";
import Dialog from "./tools/Dialog/Dialog.vue";
import {setNickname,setSignature} from "../api";
import Message from "./tools/Message/Message.js";
import Confirm from "./tools/Confirm/Confirm";

let userInfo = computed(()=>{
    return store.state.userInfo;
})
function logoutFun(){
    localStorage.clear();
    router.replace("/");
    ws.close();
}

function test() {
    Confirm({ type: "none", text: "???" },
    ()=>{
        console.log('确认');
    },
    ()=>{
        console.log('取消');
    })
}
function test2() {
    Message({ type: "warn", text: "???" });
}


// let imgSrc = ref("");
// let fileRef = ref(null);
// function checkPic (event){
//     fileRef.value = '';
//     const blob =window.URL.createObjectURL(event.target.files[0])
//     console.log(blob)
//     imgSrc.value = blob;
// }


let mode = {
    none:-1,
    setNickname:'修改昵称',
    setSignature:'修改签名'
}
let currentMode = ref(mode.none);
let iptVal = ref("");
let isShow = ref(false);
function openDialogFun(val){
    isShow.value = true;
    currentMode.value = val;
}

function setNicknameFun(){
    if(iptVal.value === ""){
        Message({type:'none',text:'不能为空!'});
        return ;
    }
    switch (currentMode.value){
        case mode.setNickname:
            let data = {
                id:userInfo.value.id,
                nickname:iptVal.value
            }
            setNickname(data).then((res) => {
                if(res.code === 200){
                    console.log(res);
                    userInfo.value.nickname = iptVal.value;

                    setUserInfo(userInfo.value);
                    Message({ type: "none", text: "修改成功!" });

                    iptVal.value = "";

                    isShow.value = false;
                }else{
                    console.log(res);
                }
            },(error)=>{
                console.log(error);
            });
            break;
        case mode.setSignature:
            let data2 = {
                id:userInfo.value.id,
                signature :iptVal.value
            }
            setSignature(data2).then((res) => {
                if(res.code === 200){
                    console.log(res);
                    userInfo.value.signature = iptVal.value;

                    setUserInfo(userInfo.value);
                    iptVal.value = "";
                    Message({ type: "none", text: "修改成功!" });

                    isShow.value = false;
                }else{
                    console.log(res);
                }
            },(error)=>{
                console.log(error);
            });
            break;

    }



}





</script>

<style scoped lang="scss">
.my-box{
    background: var(--theme-body-color);
    overflow: auto;
    height: 100%;
    &>*{
        padding: 0.04rem;
        margin: 0.03rem 0;
        background: var(--theme-background-color);
    }
    main{
        background: var(--theme-background-color);
    }
    main h2:nth-child(1){
        font-size: 0.32rem;
    }
    &>div:hover{
        padding: 0.04rem;
        margin: 0.03rem 0;
        background: #eee;
    }
}
</style>
