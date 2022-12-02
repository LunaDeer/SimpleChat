<template>
    <div class = "recent-chat-box">
        <div class = "relative-list-box">
            <div v-for = "(relative,i) in relatives" @click = "msgFun(relative)">
                <h2>{{myid === relative.id?"我":relative.nickname}} </h2>
                <h2>{{relative.msg}}</h2>
            </div>
        </div>
    </div>
</template>
<script setup>
import {computed, ref} from 'vue';
import {setSendTarget} from "../common/tools";
import router from "../router";
import store from "../store";
import {setMsgState} from "../api";


function msgFun(relative){
    //设置已读消息
    if(unreadMsg.value.has(relative.id)){
        //本地已读
        unreadMsg.value.delete(relative.id);

        let readMsgOPbj = {
            state:true,
            to_who:myid.value,
            from_who:relative.id
        };

        //服务端已读
        setMsgState(readMsgOPbj).then((res) => {
            if(res.code === 200){
                console.log(res);
            }else{
                console.log(res);
            }
        },(error)=>{
            console.log(error);
        });

    }
    setSendTarget(relative);
    router.replace({name:'Msg'});
}



let unreadMsg = computed(()=>{
    return store.state.unreadMsg;
})

let relatives = computed(()=>{
    let _relatives = new Set();
    unreadMsg.value.forEach((value)=>{
        let data = store.state.relatives[value.from_who];
        data.msg = value.msg;
        _relatives.add(data);
    });
    // console.log(store.state.relatives);
    return _relatives;
})


let myid = computed(()=>{
    return store.state.userInfo.id;
})

</script>



<style scoped lang="scss">

.recent-chat-box{
    background: var(--theme-body-color);
    overflow: auto;
    height: 100%;
    .relative-list-box{
        &>div>h2:nth-child(1){
            font-size: 0.24rem;
        }
        &>div>h2:nth-child(2){
            font-size: 0.16rem;
        }
        &>div{
            padding: 0.04rem;
            margin: 0.03rem 0;
            background: var(--theme-background-color);
        }
        &>div:hover{
            padding: 0.04rem;
            margin: 0.03rem 0;
            background: #eee;
        }
    }
}
</style>
