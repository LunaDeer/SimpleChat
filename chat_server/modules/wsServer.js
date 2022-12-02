const WebSocket = require('ws');
const dayjs = require('./dayjs.min.js');
const url = require('url');
let { ipList } = require('./pcTools');
let clientMap = new Map();
let { runSql, queryPromise } = require('./dbTools');
const { json } = require('express');

const wss = new WebSocket.Server(
    {
        port: 1111,
        host: ipList[0],
        backlog: 50,
        maxPayload: 52100,
    },
    () => {
        console.log("\033[42;30m " + dayjs().format("YYYY-MM-DD HH:mm:ss") + " \033[40;32m wsServer is running.\033[0m");
    }
);

wss.on('connection', function connection(ws, req) {
    const ip = req.socket.remoteAddress;
    // encodeURI
    let id = decodeURI(req.url.replace('/', ''));
    if (id === "undefined") return;
    ws.id = id;
    clientMap.set(id, ws);
    ws.send((() => {
        let OnlineClient = [];
        clientMap.forEach(function (value, key) {
            OnlineClient.push(key);
        })
        let data = {
            GM: 'OnceOnline',
            OnlineClient
        }
        return JSON.stringify(data);
    })());
    let data = {
        GM: 'Online',
        OnlineClient: [ws.id]
    }
    clientMap.forEach((ws) => {
        ws.send((() => {
            return JSON.stringify(data);
        })());
    });
    ws.on('message', async function message(msgJson, isBinary) {
        msgJson = msgJson.toString();
        console.log(`来自:${ws.id}的消息:${msgJson}`);
        try {
            // let messageTableName = 'message_' + dayjs().format('YYYY_MM');
            let messageTableName = 'message';
            console.log(messageTableName);
            if (!await hasTable(messageTableName)) {
                await runSql(`CREATE TABLE "main"."${messageTableName}" ("id"  INTEGER NOT NULL,"msg"  TEXT,"create_time"  TEXT,"to_whoo"  TEXT,"from_who"  TEXT,"read"  BLOB,PRIMARY KEY ("id" ASC));`);
            }
            let msgObj = JSON.parse(msgJson);
            let clientTarget = null;
            //如果是系统内部指令
            if (msgObj.hasOwnProperty('GM')) {
                if (msgObj.GM === "setSendTarget") {
                    ws.sendTarget = msgObj;
                }
                else if (msgObj.GM === "removeSendTarget") {
                    ws.sendTarget = null;
                }
                //记录当前用户的聊天对象是谁
            } else {
                if (clientMap.has(msgObj.to_who)) {
                    console.log(`发给:${msgObj.to_who}`);
                    //目标用户客户端对象
                    clientTarget = clientMap.get(msgObj.to_who);
                    if (clientTarget.readyState === WebSocket.OPEN) {
                        clientTarget.send(msgJson);
                        //数据库操作
                        // 在自己的数据库里存一份
                        //给自己发消息
                        // 目标用户是msgObj.to_who
                        // 目标用户的客户端的当前聊天对象 clientTarget.sendTarget
                        // 我的id ws.id
                        // 我的id 和目标用户的客户端的当前聊天对象 相等证明消息已读
                        let state = false;
                        if (clientTarget.sendTarget)
                            state = (clientTarget.sendTarget.id === ws.id);
                        await runSql(`INSERT INTO "${messageTableName}" (msg,create_time,to_who,from_who,read) VALUES ('${msgObj.msg}','${dayjs().format('YYYY-MM-DD_HH:mm:ss')}','${msgObj.to_who}','${ws.id}',${state})`);
                    }
                } else {
                    // console.log("该用户不在线!");
                    await runSql(`INSERT INTO "${messageTableName}" (msg,create_time,to_who,from_who,read) VALUES ('${msgObj.msg}','${dayjs().format('YYYY-MM-DD_HH:mm:ss')}','${msgObj.to_who}','${ws.id}',${false})`);
                }
            }
        } catch (error) {
            console.log(error);
        }
    });



    ws.on('close', (msg) => {
        console.log(ws.id, '断开连接！', msg);
        ws.send(`${ws.id}:断开连接！`);
        clientMap.delete(ws.id);
        //不在线了需要给所有人发 自己下线了
        let data = {
            GM: 'Offline',
            OnlineClient: [ws.id]
        }
        clientMap.forEach((ws) => {
            ws.send((() => {
                return JSON.stringify(data);
            })());
        });
        ws.id = undefined;
    });
    ws.on("error", function (code, reason) {
        console.log("异常关闭")
    });
});


async function hasTable(tableName) {
    try {
        let rows = await queryPromise(`select count(*) as count from sqlite_master where type = 'table' and name = '${tableName}';`);
        return (rows[0].count !== 0);
    } catch (error) {
        console.log(error);
        return false;
    }
}

module.exports = {
    wss,
    clientMap
};