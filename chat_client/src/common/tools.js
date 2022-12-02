
import store from "../store";
export const UPDATE_MODEL_EVENT = "update:modelValue";
export const CHANGE_EVENT = "change";
export const INPUT_EVENT = "input";

/**
 * 发布订阅对象类
 */
export class PubSub {
    constructor() {
        this.id = 1;
        this.tokenPrefix = "dnm_";
        this.callbacks = {
            // pay:{
            // 	123465:fn
            // }
        }
    }
    subscribe(channel, callback) {
        let token = this.tokenPrefix + (this.id++);
        if (this.callbacks[channel]) {
            this.callbacks[channel][token] = callback;
        } else {
            this.callbacks[channel] = { [token]: callback };
        }
        return token;
    }
    publish(channel, ...args) {
        if(!this.callbacks[channel])return;
        if(this.callbacks[channel].length === 0)return;
        Object.values(this.callbacks[channel]).forEach((callback) => {
            callback(...args);
        })
    }
    unsubscribe(flag){
        if(flag === undefined){
            this.callbacks = {};
        }else if(typeof flag === 'string'){
            if(flag.indexOf(this.tokenPrefix) === 0){
                let callbackObj = Object.values(this.callbacks).find(
                    (obj) => {
                        return obj.hasOwnProperty(flag);
                    }
                )
                //console.log(callbackObj);
                if(callbackObj){
                    delete callbackObj[flag];
                }
            }else{
                delete this.callbacks[flag];
            }
        }
    }
}

/**
 * 写入剪切板函数
 * @param content 要写入的字符串
 */
export function copyContentH5(content) {
    console.log(content);
    let copyDom = document.createElement('div');
    copyDom.innerText=content;
    copyDom.style.position='absolute';
    copyDom.style.top='0px';
    copyDom.style.right='-9999px';
    document.body.appendChild(copyDom);
    //创建选中范围
    let range = document.createRange();
    range.selectNode(copyDom);
    //移除剪切板中内容
    window.getSelection().removeAllRanges();
    //添加新的内容到剪切板
    window.getSelection().addRange(range);
    //复制
    let successful = document.execCommand('copy');
    copyDom.parentNode.removeChild(copyDom);

    try{
        var msg = successful ? "successful" : "failed";
        console.log('Copy command was : ' + msg);
    } catch(err){
        console.log('Oops , unable to copy!');
    }
}
//创建一个防抖函数debounce
/**
 * 防抖函数
 * @param fn 函数
 * @param delay 延时
 * @returns {_debounce}
 */
export function debounce(fn, delay) {
    let timer = null;
    const _debounce = function () {
        if (timer) clearTimeout(timer)
        timer = setTimeout(() => {
            fn();
        }, delay);
    }
    return _debounce;
}



import CryptoJS from 'crypto-js';
import router from "../router";
import MyWebSocket from "../api/ws/ws";
import {selectMyRelative, selectUnreadMsg} from "../api";
const key = CryptoJS.enc.Utf8.parse('wdnmdghz_aes_v1_mweb');

/**
 * 解密方法
 * @param word 密文
 * @returns {string}
 */
export function decrypt(word) {
    if(!word)return;
    let decrypt = CryptoJS.AES.decrypt(word, key, { mode: CryptoJS.mode.ECB, padding: CryptoJS.pad.Pkcs7 });
    let decryptedStr = decrypt.toString(CryptoJS.enc.Utf8);
    return decryptedStr.toString();
}

/**
 * 加密方法
 * @param word 明文
 * @returns {string}
 */
export function encrypt(word) {
    if(!word)return;
    let srcs = CryptoJS.enc.Utf8.parse(word);
    let encrypted = CryptoJS.AES.encrypt(srcs, key, { mode: CryptoJS.mode.ECB, padding: CryptoJS.pad.Pkcs7 });
    return encrypted.toString();
}




/************************************
 * 以上是公共方法,以下是本项目的方法
 * */





/**
 * 设置token
 * @param token
 */
export function setToken(token){
    localStorage.setItem('token', token);
}

/**
 * 获取token
 * @returns {string}
 */
export function getToken(){
    return localStorage.getItem('token');
}

/**
 * 移除token
 */
export function removeToken(){
    return localStorage.removeItem('token');
}

/**
 * 设置用户信息
 * @param userInfo
 * @returns {*}
 */
export function setUserInfo(userInfo){
    if(userInfo){
        localStorage.setItem('userInfo',encrypt(JSON.stringify(userInfo)));
        store.commit('SetUserInfo',userInfo);
        initWsAndTelatives();
        return userInfo;
    }
}

/**
 * 获取用户信息
 */
export function getUserInfo(){
    let userInfoCiphertext = localStorage.getItem('userInfo');
    if(userInfoCiphertext) {
        store.commit('SetUserInfo',JSON.parse(decrypt(userInfoCiphertext)));
        initWsAndTelatives();
    }
}


/**
 * 路由跳转
 * @param i
 */
export function go(i){
    router.go(i);
}

/**
 * 设置发送对象
 * @param json
 */
export function setSendTarget(json){
    localStorage.setItem('target',JSON.stringify(json));
}

/**
 * 获取发送对象
 * @returns {null|any}
 */
export function getSendTarget(){
    if(localStorage.getItem('target'))
        return JSON.parse(localStorage.getItem('target'));
    else
        return null;
}

/**
 * 移除发送对象
 */
export function removeSendTarget(){
    localStorage.removeItem('target');
}



/**
 * 加载localStorage的好友,没有的话发ajax从服务器获取用户的好友
 */
export function loadRelatives(){
    //如果有
    if(localStorage.getItem("relatives")){
        let _relatives = JSON.parse(localStorage.getItem("relatives"));
        store.commit('SetRelatives',_relatives);
    }else {
        searchRelativeFun();
    }
}

/**
 * 发ajax从服务器查找好友
 */
export function searchRelativeFun(){
    selectMyRelative().then((res) => {
        let _relatives = {}
        if(res.code === 200){
            //console.log(res);
            res.relatives.forEach((item,i)=>{
                //console.log(item.id,res.relatives[i]);
                _relatives[item.id] = res.relatives[i];
            })
            //console.log(_relatives);
            // relatives.value = res.relatives;
            localStorage.setItem("relatives",JSON.stringify(_relatives));
            store.commit('SetRelatives',_relatives);
        }else{
            //console.log(res);
        }
    },(error)=>{
        console.log(error);
    });
}

let pid2 = "";
/**
 * 初始化ws和好友列表
 * @param flag 为真清空loca
 */
export function initWsAndTelatives(flag){
    if(window.hasOwnProperty('ws'))
        ws.close();
    if(flag === true){
        localStorage.removeItem("relatives");
    }
    pubSub.unsubscribe(pid2);
    setTimeout(()=>{
        let baseInfo = {

            ip: import.meta.env.VITE_API_URL,
            // ip: '10.0.24.8',
            // ip: '127.0.0.1',
            // ip: '192.168.1.5',
            // ip: '101.43.182.17',
            port: '1111',
            path: store.state.userInfo.id,
        };
        window.ws = new MyWebSocket(baseInfo);
        ws.open(baseInfo);
        // console.log(ws);
    },500);
    loadRelatives();
    pid2 = pubSub.subscribe('onmessage', (msg) => {
        //如果是消息中存在GM属性证明是系统消息
        if(msg.indexOf("GM") !== -1){
            // console.log(JSON.parse(msg));
            let {GM,OnlineClient} = JSON.parse(msg);
            if(GM === "OnceOnline"){
                // console.log('OnceOnline',OnlineClient);
                OnlineClient.forEach((id)=>{
                    store.commit('SetRelativesOnline',id );
                })
            }
            else if(GM === "Online"){
                // console.log("Online",OnlineClient);
                OnlineClient.forEach((id)=>{
                    store.commit('SetRelativesOnline',id );
                })
            }
            else if(GM === "Offline"){
                // console.log("Offline",OnlineClient);
                OnlineClient.forEach((id)=>{
                    store.commit('SetRelativesOffline',id );
                })
            }
        }
        else {
            // 判断消息是否已读
            // 首先接受消息
            // (JSON.parse(msg));
            // 获取当前进入的窗口
            let page = (()=>{
                let a = location.hash.split('/');
                return a[a.length-1];
            })();

            //console.log(page);
            let msgObj = JSON.parse(msg);

            //判断当前是在聊天窗口中
            if(page === 'Msg'){
                //在聊天窗口中
                //并且消息目标对象是自己
                if(msgObj.to_who === store.state.userInfo.id){
                    ;
                }else {
                    //当前聊天对象不是自己
                    store.commit('SetUnreadMsg',msgObj);
                    // saveUnreadMsg(msg);
                }
            }else{
                // 不在聊天窗口中
                store.commit('SetUnreadMsg',msgObj);
                // saveUnreadMsg(msg.from_who);
            }
        }
    });

    selectUnreadMsg({to_who:store.state.userInfo.id}).then((res) => {
        if(res.code === 200){
            res.msgList.forEach((msgObj)=>{
                store.commit('SetUnreadMsg',msgObj)
            });
        }else{
            console.log(res);
        }
    },(error)=>{
        console.log(error);
    });
}


