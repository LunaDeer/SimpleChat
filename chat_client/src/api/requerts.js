import axios from 'axios';
// import store from '@/store';
import router from "../router";
import {getToken,  removeToken} from "../common/tools";
// axios.defaults.withCredentials = true
const requerts = axios.create({

    // 基础路径
    baseURL:`http://${import.meta.env.VITE_API_URL}/`,
    // baseURL:'http://192.168.1.5/',
    // baseURL:'http://192.168.1.103/',
    // baseURL:'http://127.0.0.1/',
    // baseURL:'http://101.43.182.17/',
    timeout:3000
});
// 请求拦截器:在发请求之前请求拦截器可以检测到,在请求发出去之前做一些事情
requerts.interceptors.request.use((config) => {
    let token = getToken();
    if(token){
        config.headers.common['Authorization'] = token;
    }
    return config;
}, error =>{
    console.log(error);
    //对请求错误做什么
    return Promise.reject(error);
});
// 响应拦截器
requerts.interceptors.response.use((response) => {
    if(response.data.code === 444){
        removeToken();
        localStorage.clear();
        router.replace({name: 'Login'});
        ws.close();
        return response.data;
    }
    return response.data;
},(error) => {
    return Promise.reject(error);
    //设置加载状态
    // store.commit("SetLoading",false);
    // switch (error.response.status){
    //     //421没token
    //     case 421:
    //         router.replace({path: '/'});
    //         return;
    //     //token过期
    //     case 422:
    //         removeToken();
    //         router.replace({path: '/'});
    //         return;
    //     default:
    //         return Promise.reject(new Error('faile'));
    // }
});
// 对外暴露
export default requerts;
