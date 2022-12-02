import {onBeforeUnmount, onMounted,ref} from "vue";

export function pullRefresh(callBack){
    let tipboxRef = ref(null);
    let tipmsgRef = ref(null);
    let wrapRef = ref(null);
    let refreshCallBack = callBack;
    let refreshStyleObj = {
        height: 0,
        overflow: 'hidden',
        textAlign: 'center',
        backgroundColor: '#b2cbea',
        color: '#333',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        width: '100%',
        pointerEvents: 'none',
        transition: 'min-height 0.2s ease',
    }

    let state = undefined // start | moving | end
    let touchStartY = undefined;
    let touchTrigger = 100;
    let dist = 0
    let tipbox = tipboxRef.value;
    let tipmsg = tipmsgRef.value;
    let wrap = wrapRef.value;
    onMounted(()=>{
        tipbox = tipboxRef.value;
        tipmsg = tipmsgRef.value;
        wrap = wrapRef.value;

        window.addEventListener('touchstart', touchstartCall, false);
        window.addEventListener('touchmove', touchmoveCall, { passive: false });
        window.addEventListener('touchend', touchendCall, false);
    })
    onBeforeUnmount(()=>{
        window.removeEventListener('touchstart', touchstartCall);
        window.removeEventListener('touchmove', touchmoveCall);
        window.removeEventListener('touchend', touchendCall);
    })

    function touchstartCall(e){
        // console.log('touchstart', e.touches,window.scrollY)
        if (!window.scrollY)
            touchStartY = e.touches[0].screenY;
        state = 'start'
    }
    function touchmoveCall(e) {
        // console.log('touchmove', e.touches)
        const screenY = e.touches[0].screenY

        if (state === 'start') {
            touchStartY = screenY
            state = 'moving'
        }

        dist = screenY - touchStartY

        if (dist > 0) {
            e.preventDefault();
            tipbox.style.minHeight = Math.min(dist, 50) + 'px'
        }
    }
    function touchendCall(e) {
        // console.log('touchend', e.touches)
        if(dist >= 50 && !window.scrollY) {
            refreshCallBack();
        }
        touchStartY = 0
        tipbox.style.minHeight = 0
    }

    return {
        tipboxRef,
        tipmsgRef,
        wrapRef,
        refreshStyleObj,
    }


}

