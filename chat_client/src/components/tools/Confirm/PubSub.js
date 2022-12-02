
class PubSub {
    constructor() {
        this.id = 1;
        this.tokenPrefix = "dnm_";
        this.callbacks = {

        }
    }
    subscribe(channel, callback) {
        let token = this.tokenPrefix + (this.id++);
        if (this.callbacks[channel]) {
            this.callbacks[channel][token] = callback;
        } else {
            this.callbacks[channel] = { [token]: callback };
        }
        return token;
    }
    publish(channel, ...args) {
        if(!this.callbacks[channel])return;
        if(this.callbacks[channel].length === 0)return;
        Object.values(this.callbacks[channel]).forEach((callback) => {
            callback(...args);
        })
    }
    unsubscribe(flag){
        if(flag === undefined){
            this.callbacks = {};
        }else if(typeof flag === 'string'){
            if(flag.indexOf(this.tokenPrefix) === 0){
                let callbackObj = Object.values(this.callbacks).find(
                    (obj) => {
                        return obj.hasOwnProperty(flag);
                    }
                )
                console.log(callbackObj);
                if(callbackObj){
                    delete callbackObj[flag];
                }
            }else{
                delete this.callbacks[flag];
            }
        }


    }
}
export let pubsub = new PubSub();
