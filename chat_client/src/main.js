
import { createApp } from 'vue';
import router from "./router";
import App from './App.vue';
import './assets/style/init.scss';
import Tokencheckrouter from "./router/interceptor";
import store from "./store";

import {PubSub} from "./common/tools";
window.pubSub = new PubSub();
// window.ip = "101.43.182.17";


Tokencheckrouter();

const app = createApp(App);
app.use(router);
app.use(store);
app.mount('#app');
