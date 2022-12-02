import Message from "../../components/tools/Message/Message";

class MyWebSocket {
    constructor(baseInfo) {
        this.baseInfo = baseInfo;
        this.baseInfo.openFlag = false;
        // {
        //     // // ip: '192.168.43.154',
        //     // // ip: '127.0.0.1',
        //     ip: '192.168.1.103',
        //     port: '1111',
        //     path: 'jjj',
        //     openFlag: false,
        // };
        this.websocket = null;
    };
    onOpen= function () {
        // console.log('open');
    };
    onMessage= function (msg) {
        //console.log(msg);
        pubSub.publish('onmessage', msg );
    };
    onClose= function () {
        // console.log('close');
    };
    onError= function (error) {
        console.log(error);
    };
    onConnectionFail= function (error) {
        console.log(error);
    };
    open(baseInfoObj) {
        try {
            Object.assign(this.baseInfo, baseInfoObj);
            if ('WebSocket' in window) {
                this.websocket = new WebSocket(
                    `ws://${this.baseInfo.ip}:${this.baseInfo.port}/${this.baseInfo.path}`
                );
                setTimeout(() => {
                    if (this.websocket.readyState !== WebSocket.OPEN) {
                        this.onConnectionFail();
                        this.baseInfo.openFlag = false;
                    }
                }, 1000);
            } else {
                Message({ type: "none", text: "你浏览器不支持WebSocket" });
                // alert('你浏览器不支持WebSocket!');
            }

            this.websocket.onerror = (error) => {
                this.onError(error);
            };

            this.websocket.onopen = (event) => {
                this.onOpen(event);
                this.baseInfo.openFlag = true;
            };

            this.websocket.onmessage = (event) => {
                this.onMessage(event.data);
            };

            this.websocket.onclose = () => {
                this.onClose();
                this.baseInfo.openFlag = false;
            };
        } catch (error) {
            this.onConnectionFail(error.message);
        }
    }
    send(text) {
        if (this.websocket.readyState !== WebSocket.OPEN) return;
        if (text === '') return;
        this.websocket.send(text);
    }
    close() {
        if (this.websocket) {
            this.websocket.close();
        }
    }
}

export default MyWebSocket;
