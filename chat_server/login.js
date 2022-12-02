let express = require('express');
const CryptoJS = require('crypto-js');

let { setToken, verToken } = require('./token.js');
let dayjs = require("./modules/dayjs.min.js");
let login = express.Router();

let { runSql, queryPromise } = require('./modules/dbTools');


login.post('/login', async (req, res) => {
    try {
        console.log(req.body);
        let { id, password } = req.body;

        let rows = await queryPromise(`SELECT id,nickname FROM user where id ='${id}' and password ='${md5(password)}';`);
        console.log(rows);
        if (rows.length > 0) {
            setToken(id).then((token) => {
                res.send({
                    code: 200,
                    token: token,
                    userInfo: {
                        id: rows[0].id,
                        nickname: rows[0].nickname,
                    }
                });
            })
        }
        else {
            res.send({
                code: 400,
                msg: '帐号不存在,或者密码错误!'
            });
        }
    } catch (error) {
        res.send({
            code: 400,
            msg: '出错了!'
        });
    }

});

login.post('/register', async (req, res) => {
    try {
        console.log(req.body);
        let { id, password, nickname,invitationCode} = req.body;

        let timeSalt = (dayjs().format("HH")+Math.floor(dayjs().minute()/5).toString());
        let correctInvitationCode = md5(id+timeSalt).slice(0,7);
        console.log(correctInvitationCode);
        let rows = await queryPromise(`SELECT * FROM user where id ='${id}';`);

        if (rows.length !== 0){
            return res.send({
                code: 400,
                msg: 'id已经注册过了!'
            });
        }

        if(invitationCode !== correctInvitationCode){
            return res.send({
                code: 400,
                msg: '邀请码不对!'
            });
        }
        //可以注册
        if (rows.length === 0) {
            await runSql(`INSERT INTO user (id,nickname,password) VALUES ('${id}','${nickname}','${md5(password)}')`);
            return res.send({
                code: 200,
            });
        }
    } catch (error) {
        return res.send({
            code: 401,
            msg: '出错了!'
        });
    }

});



verifyLogin = (req, res, next) => {
    let token = req.headers['authorization'];
    if (token == undefined) {
        return next();
    } else {
        verToken(token).then((data) => {
            req.data = data;
            console.log("请求用户为:", data.id);
            console.log("请求数据为:", req.body);
            return next();
        }).catch((error) => {
            return next();
        })
    }
};

module.exports = {
    login,
    verifyLogin
};


const key = CryptoJS.enc.Utf8.parse('wdnmdghz_aes_v1_mweb');
function decrypt(word) {
    if (!word) return;
    let decrypt = CryptoJS.AES.decrypt(word, key, { mode: CryptoJS.mode.ECB, padding: CryptoJS.pad.Pkcs7 });
    let decryptedStr = decrypt.toString(CryptoJS.enc.Utf8);
    return decryptedStr.toString();
}
function encrypt(word) {
    if (!word) return;
    let srcs = CryptoJS.enc.Utf8.parse(word);
    let encrypted = CryptoJS.AES.encrypt(srcs, key, { mode: CryptoJS.mode.ECB, padding: CryptoJS.pad.Pkcs7 });
    return encrypted.toString();
}
function md5(str) {
    return CryptoJS.MD5(str).toString();
}


