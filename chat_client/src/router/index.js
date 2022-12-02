import {createRouter, createWebHashHistory} from "vue-router"
const Login = () => import('@/views/Login.vue');
const Home = () => import('@/views/Home.vue');

const Relative = () => import('@/components/Relative.vue');
const Chat = () => import('@/components/UnreadChat.vue');
const Msg = () => import('@/components/Msg.vue');
const My = () => import('@/components/My.vue');

const routes = [
    {
        path: '/',
        // name: 'Screen',
        // component: Screen,
        redirect: to => {
            return { path: '/Login'}
        },
    },
    {
        path: '/Login',
        name: 'Login',
        component: Login
    },
    {
        path: '/Msg',
        name: 'Msg',
        component: Msg,
        meta: { requiresAuth: true },
    },

    {
        path: '/Home',
        name: 'Home',
        meta: { requiresAuth: true },
        component: Home,
        redirect: to => {
            return { path: '/Home/My'}
        },
        children: [
            {
                name: 'Relative',
                path: 'Relative',
                component: Relative,
                meta: { requiresAuth: true },
            },
            {
                name: 'Chat',
                path: 'Chat',
                component: Chat,
                meta: { requiresAuth: true },
            },
            {
                name: 'My',
                path: 'My',
                component: My,
                meta: { requiresAuth: true },
            },
        ]
    },
]


const router = createRouter({
    history: createWebHashHistory(),
    routes,
})

export default router;
