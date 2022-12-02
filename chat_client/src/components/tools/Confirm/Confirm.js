import { createVNode, render } from 'vue'
import Confirm from './Confirm.vue'
import {pubsub} from "./pubsub";

const div = document.createElement('div')
div.setAttribute('class', 'message-container')
document.body.appendChild(div)

let vnode = null;
export default ({ type, text },confirmFun,cancelFun) => {
    vnode = createVNode(Confirm, { type, text})
    render(vnode, div);

    confirmFun?confirmFun:()=>{};
    cancelFun?cancelFun:()=>{};
    pubsub.subscribe('confirm', () => {
        confirmFun();
        destoryFun();
    });

    pubsub.subscribe('cancel', () => {
        cancelFun();
        destoryFun();
    });
}

function destoryFun(){
    if(vnode){
        render(null, div);
        pubsub.unsubscribe('confirm');
        pubsub.unsubscribe('cancel');
    }
}

