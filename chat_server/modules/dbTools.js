let sqlite3 = require('sqlite3').verbose();
const path = require('path');
const dayjs = require('./dayjs.min.js');
let db = new sqlite3.Database(path.join(__dirname,"..","dnm.db"));

//执行sql语句
const runSql = async (sql) => {
    return new Promise(async (resolve, reject) => {
        db.run(sql, (err) => {
            resolve(err)
        })
    })
}

//查询
const queryPromise = async (sql) => {
    return new Promise(async (resolve, reject) => {
        db.all(sql, function (err, rows) {
            if (err) {
                reject(err)
            } else {
                resolve(rows)
            }
        })
    })
}


async function test(){
    try {
        let { to_who, from_who ,state} = {
            to_who:7777,
            from_who:7777,
            state:true
        };
        let page = 0;
        let rows = await queryPromise(`SELECT * FROM message where (to_who ='${to_who}' and from_who ='${from_who}') or (to_who ='${from_who}' and from_who ='${to_who}') ORDER BY id DESC limit ${page*5},5;`);
        console.log(rows);
    } catch (error) {
        console.log(error);
    }
}



module.exports = {
    runSql,
    queryPromise,
}






