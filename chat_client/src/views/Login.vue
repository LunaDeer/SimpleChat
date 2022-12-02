<template>
    <div class = "login-box">
        <div class = "center-box">
            <h1>欢迎!</h1>
            <div class = "page-box" v-if = "pageIndex === 0">
                <form>
                    <div>
                        <h2>登录</h2>
                    </div>
                    <div>
                        <p>帐号:<span v-if="!verifyId(userInfo.id)" style="color:red;font-size:0.14rem">(4-16位只能是字母数字_)</span></p>
                        <input type="text" maxlength="16" v-model="userInfo.id" />
                    </div>
                    <div>
                        <p>密码:</p>
                        <input autocomplete type="password" maxlength="16" v-model="userInfo.password" />
                    </div>
                    <div>
                        <button @click="loginFun">登录</button>
                    </div>
                </form>

            </div>

            <div class = "page-box" v-else>
                <div>
                    <h2>注册</h2>
                </div>

                <div>
                    <p>帐号:<span v-if="!verifyId(userRegisterInfo.id)" style="color:red;font-size:0.14rem">(4-16位只能是字母数字_)</span> </p>
                    <input type="text" maxlength="16" v-model="userRegisterInfo.id" />
                </div>
                <div>
                    <p>昵称:</p>
                    <input type="text" maxlength="16" v-model="userRegisterInfo.nickname" />
                </div>
                <div>
                    <p>密码:</p>
                    <input type="text" maxlength="16" v-model="userRegisterInfo.password" />
                </div>
                <div>
                    <p>确认密码:<span v-if = "userRegisterInfo.password !== userRegisterInfo.password2" style="color:red;font-size:0.14rem">(两次密码不一样)</span></p>
                    <input type="text" maxlength="16" v-model="userRegisterInfo.password2" />
                </div>
                <div>
                    <p>邀请码:</p>
                    <input type="text" maxlength="16" v-model="userRegisterInfo.invitationCode" />
                </div>
                <div>
                    <button @click="registerFun">注册</button>
                </div>
            </div>
        </div>


        <div class = "footer-box">
            <a v-if = "pageIndex === 1" @click = "pageIndex = 0">去登陆</a>
            <a v-else @click = "pageIndex = 1">去注册</a>
        </div>



    </div>
</template>

<script setup>

import router from '../router';
import {login,register} from "../api";
import {debounce,setToken} from "../common/tools";
import store from "../store";
import {ref} from "vue";
import Message from "../components/tools/Message/Message";
let userInfo = ref({
    id: '',
    password: '',
});
let pageIndex = ref(0);
let userRegisterInfo = ref({
    id: '',
    password: '',
    password2: '',
    nickname:'',
    invitationCode:''
});

let errCount = 0;
// let loginFun = (()=>{
//     errCount++;
//     if(errCount>5){
//         let a = confirm("错误次数太多了!");
//         errCount = 0;
//         return;
//     };
//     _loginFun();
// });
function verifyId(id){
    let uPattern = /^[a-zA-Z0-9_]{4,16}$/;
    return uPattern.test(id);
}

function loginFun() {
    let uPattern = /^[a-zA-Z0-9_]{4,16}$/;
    if(!uPattern.test(userInfo.value.id)){
        Message({ type: "none", text: "帐号不符合要求!" });
        return;
    }
    if(userInfo.value.id === ""){
        Message({ type: "none", text: "帐号不能为空!" });

        return;
    }
    if(userInfo.value.password === ""){
        Message({ type: "none", text: "密码不能为空!" });

        return;
    }

    store.dispatch("logIn", userInfo.value);
    // login(data).then((res) => {
    //     if(res.code === 200){
    //         setToken(res.token);
    //         console.log(res);
    //         router.push({ path: '/Home' });
    //     }else{
    //         alert("密码错误");
    //     }
    // },(error)=>{
    //     console.log(error);
    // });
}

let registerFun = debounce(()=>{
    _registerFun();
},500);
function _registerFun(){
    let uPattern = /^[a-zA-Z0-9_]{4,16}$/;
    if(!uPattern.test(userRegisterInfo.value.id)){
        Message({ type: "none", text: "帐号不符合要求!" });
        return;
    };
    if(userRegisterInfo.value.id === ""){
        Message({ type: "none", text: "帐号不符合要求!" });
        return;
    }
    if(userRegisterInfo.value.password === ""){
        Message({ type: "none", text: "密码不能为空!" });
        return;
    };
    if(userRegisterInfo.value.password2 === ""){
        Message({ type: "none", text: "确认密码不能为空!" });
        return;
    };
    if(userRegisterInfo.value.nickname === ""){
        Message({ type: "none", text: "昵称不能为空!" });
        return;
    };
    if(userRegisterInfo.value.password !== userRegisterInfo.value.password2){
        Message({ type: "none", text: "密码不符合要求!" });
        return;
    };
    if(userRegisterInfo.value.invitationCode === ''){
        Message({ type: "none", text: "邀请码不能为空!" });
        return;
    };

    register(userRegisterInfo.value).then((res) => {
        if(res.code === 200){
            // setToken(res.token);
            console.log(res);
            // router.push({ path: '/Home' });
            Message({ type: "none", text: "注册成功!" });
        }else{
            Message({ type: "none", text: res.msg });

        }
    },(error)=>{
        console.log(error);
    });
}
</script>

<style lang="scss">
.login-box{
    .center-box{
        text-align: center;
        padding-top: 0.5rem;
        height: 5.5rem;
        overflow: auto;
        &>h1{
            font-size: 0.7rem;
        }
        .page-box{
            margin: auto;
            //background: #5c6cad;
            width: 70%;
            p{
                text-align: left;
            }
            h2{
                font-size: 0.24rem;
                text-align: right;
            }
            div{
                margin-top: 0.07rem;
                width: 100%;
            }
            button{
                width: 50%;
            }
            input{
                width: 100%;
            }
        }
    }


    .footer-box
    {
        margin-right: 15%;
        height: 0.7rem;
        text-align: right;
    }
}
</style>
