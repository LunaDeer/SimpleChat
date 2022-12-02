//用于生成和解析token
var jwt = require('jsonwebtoken');
var signkey = 'jjj';

setToken = function (id) {
    return new Promise((resolve, reject) => {
        const token = jwt.sign({
            id,
        }, signkey, { expiresIn: '30d' });
        resolve('Bearer '+token);
    })
}

verToken = function (token) {
    return new Promise((resolve, reject) => {
        var info = jwt.verify(token.split(' ')[1], signkey);
        resolve(info);
    })
}

module.exports = {
    setToken,
    verToken
}