let express = require('express');
let { runSql, queryPromise } = require('./modules/dbTools');
let api = express.Router();

api.post('/hello', async (req, res) => {
    res.send({
        code: 200,
        msg: '>_<!'
    });
});

api.post('/setNickname', async (req, res) => {
    let { nickname,id} = req.body;
    try {
        let rows = await queryPromise(`UPDATE user SET nickname = '${nickname}' where id ='${id}';`);
        // console.log(rows);
        res.send({
            code: 200,
        });
    } catch (error) {
        res.send({
            code: 400,
        });
    }
});
api.post('/setSignature', async (req, res) => {
    let { signature,id} = req.body;
    try {
        let rows = await queryPromise(`UPDATE user SET signature = '${signature}' where id ='${id}';`);
        res.send({
            code: 200,
        });
    } catch (error) {
        res.send({
            code: 400,
        });
    }
});



api.get('/selectMyRelative', async (req, res) => {
    try {
        let rows = await queryPromise(`SELECT id,nickname FROM user;`);
        res.send({
            code: 200,
            relatives: rows
        });
    } catch (error) {
        res.send({
            code: 400,
        });
    }
});


api.get('/selectUserInfo', async (req, res) => {
    try {
        let {id} = req.query;
        let rows = await queryPromise(`SELECT id,nickname,signature FROM user where id = ${id};`);
        res.send({
            code: 200,
            relative: rows[0]
        });
    } catch (error) {
        res.send({
            code: 400,
        });
    }
});


api.get('/selectMsg', async (req, res) => {
    let { to_who, from_who } = req.query;
    let page = 0;
    try {
        let rows = await queryPromise(`SELECT * FROM message where (to_who ='${to_who}' and from_who ='${from_who}') or (to_who ='${from_who}' and from_who ='${to_who}')`);
        res.send({
            code: 200,
            msgList: rows
        });
    } catch (error) {
        console.log(error)
        res.send({
            code: 400,
            msg:error,
        });
    }
});



api.get('/selectUnreadMsg', async (req, res) => {
    let { to_who } = req.query;
    try {
        let rows = await queryPromise(`SELECT * FROM message where to_who ='${to_who}' and read = ${false};`);
        console.log('selectUnreadMsg',rows);
        res.send({
            code: 200,
            msgList: rows
        });
    } catch (error) {
        res.send({
            code: 400,
        });
    }
});


api.post('/setMsgState', async (req, res) => {
    let { to_who, from_who ,state} = req.body;
    try {
        let rows = await queryPromise(`UPDATE message SET read = ${state} where to_who ='${to_who}' and from_who ='${from_who}';`);
        res.send({
            code: 200,
        });
    } catch (error) {
        res.send({
            code: 400,
        });
    }
});



module.exports = api;