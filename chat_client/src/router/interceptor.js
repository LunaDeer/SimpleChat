import router from "../router";
import {getToken} from "../common/tools";
let Tokencheckrouter = () => {
    //路由拦截
    router.beforeEach((to, from, next) => {
        //判断进入路由之前，查看元信息是否需要登入
        console.log(to.path);
        if (to.meta.requiresAuth) {
            if (getToken()) {
                next();
            }else {
                next({
                    path: '/Login',
                })
            }
        }else if(to.path === "/Login" && getToken()){
            next({
                path: '/Home',
            })
        }
        else {
            next();
        }
    })
}



export default Tokencheckrouter

