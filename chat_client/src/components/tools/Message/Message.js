import { createVNode, render } from 'vue'
import Message from './Message.vue'
const div = document.createElement('div')
div.setAttribute('class', 'message-container')
document.body.appendChild(div)
let timer = null
export default ({ type, text }) => {
    const vnode = createVNode(Message, { type, text })
    render(vnode, div);
    clearTimeout(timer)
    timer = setTimeout(() => {
        render(null, div)
    }, 2000)
}

