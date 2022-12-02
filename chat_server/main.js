let express = require('express');
let dayjs = require("./modules/dayjs.min.js");
let { ipList } = require('./modules/pcTools');
let path = require('path');
let ws = require('./modules/wsServer.js');
let ejs = require('ejs');
let cors = require('cors');
const { expressjwt } = require('express-jwt');

let api = require('./api.js');
let { login, verifyLogin } = require('./login.js');

const app = express();
app.use(cors());

app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.use(express.static(path.join(__dirname, 'public')));

app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'html'); 
app.engine('html', ejs.__express);

app.use(verifyLogin);
app.use('/', login);
app.use('/api', api);

app.use((err, req, res, next) => {
    let optations = {
        message: err.message,
        error: err
    }
    if (err.name === 'UnauthorizedError') {
        return res.send({
            code: 444,
            msg: 'token失效'
        });
    }
    else {
        res.send({
            data: optations
        });
    }
});

app.get('*', function (req, res){
    console.log('404 handler..')
    res.render('404.html', {
        status: 404,
        title: 'NodeBlog',
    });
});

app.listen(80, function () {
    console.log("-------------------------------------------");
    console.log("http://" + ipList[0]);
    console.log("\033[42;30m " + dayjs().format("YYYY-MM-DD HH:mm:ss") + " \033[40;32m httpServe is running.\033[0m");
})



