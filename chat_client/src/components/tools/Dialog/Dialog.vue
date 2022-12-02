<template>
    <teleport to="body">
        <div v-if="visible" class="mask-box">
            <div class="dialog-box">
                <div class = 'header-box'>
                    <a @click="hide">关闭</a>
                </div>
                <div class = "center-box">
                    <slot></slot>
                </div>
            </div>
        </div>
    </teleport>
</template>

<script setup>
import { ref,watch} from 'vue'
import {UPDATE_MODEL_EVENT} from "./emitsSign";


const props = defineProps({
    modelValue:{
        type: Boolean,
        default:false
    },
})
let visible = ref(false);

watch(() => props.modelValue,(val) => {
    visible.value = val;
});

const emit = defineEmits([UPDATE_MODEL_EVENT]);
function hide() {
    visible.value = false;
    emit(UPDATE_MODEL_EVENT, false);
}

</script>

<style scoped lang="scss">
.mask-box{
    position: absolute;
    top: 0;bottom: 0;left: 0;right: 0;
    background-color: rgba(0, 0, 0, 0.5);
    .dialog-box{
        box-shadow:2px 2px 5px #333333;
        position: absolute;
        width: 2.9rem;
        height: 2.9rem;
        top: 50%;
        left: 50%;
        transform: translate(-50%,-50%);
        //text-align: left;

        background-color: var(--theme-background-color);
        .header-box{
            //border-left: #3D97F8 0.1rem solid;
            background:var(--theme-title-color);

            position: relative;
            width: 100%;
            text-align: right;
            a{
                color: var(--theme-lcolor);
            }
        }
        .center-box{
            padding: 0.1rem;
        }
    }
}

</style>
