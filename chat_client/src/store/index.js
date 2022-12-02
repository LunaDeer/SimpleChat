import {createStore} from 'vuex'
import {login} from "../api";
import router from "../router";
import { setToken, setUserInfo} from "../common/tools";
import Message from "../components/tools/Message/Message";

// 创建一个新的 store 实例
const store = createStore({
    state() {
        return {
            userInfo: {},
            relatives:{},
            unreadMsg:new Map(),
        }
    },
    mutations: {
        LogIn(state, res) {
            setUserInfo(res.userInfo);
            setToken(res.token);
            router.replace({name:'Home'});
        },
        SetUserInfo(state,userInfo){
            state.userInfo = userInfo;
        },
        SetRelatives(state,relatives){
            state.relatives = relatives;
        },
        SetRelativesOnline(state,id){
            state.relatives[id].isOnline = true;
            // console.log(state.relatives[id].isOnline);
        },
        SetRelativesOffline(state,id){
            state.relatives[id].isOnline = false;
            // console.log(state.relatives[id].isOnline);
        },
        SetUnreadMsg(state,unreadMsg){
            state.unreadMsg.set(unreadMsg.from_who,unreadMsg);
        }
    },
    actions: {
        async logIn({commit}, userInfo) {
            login(userInfo).then((res) => {
                    if (res.code === 200) {
                        commit('LogIn', res);
                    } else {
                        Message({ type: "none", text: res.msg });
                        // alert();
                    }
            }).catch((err) => {
                Message({ type: "none", text: err });
                // alert(err);
            });
        },
    },
    modules: {
        // config,
    }
})

export default store
