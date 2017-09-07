import * as  express from 'express';
import path = require('path');
//import favicon = require('serve-favicon');
//import logger = require('morgan');
import cookieParser = require('cookie-parser');
import bodyParser = require('body-parser');
import { Config } from './Config/Config';
import { UserModel } from './model/UserModel';
import { LogHelper } from './Helper/LogHelper';

import routes = require('./routes/index');
import users = require('./routes/user');
import files = require('./routes/files');

var loghelper = new LogHelper();
var usermodel = new UserModel(loghelper);
var app: express.Express = express();
// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');
app.set('trust proxy', true) //如果放到线上使用nginx 或者iisnode必须要用这个 http://blog.csdn.net/liangklfang/article/details/51050454

// uncomment after placing your favicon in /public
//app.use(favicon(__dirname + '/public/favicon.ico'));
//app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

//若需要使用签名，需要指定一个secret,字符串,否者会报错
app.use(cookieParser('secret'));
//app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

//账号登录状态验证
app.use((req, res, next) => {
    new Promise<string>((resolve, reject) => {
        //读取token
        let token: string = req.cookies[Config.token.name];
        if (token)
            resolve(token);
        else
            reject(new Error("token为空"))
    }).then(token => {
        return usermodel.GetUserID(token);
    }).then(result => {
        if (result < 1) {
            throw new Error("账号登录失效请重新登录");
        }
        req.body["userid"] = result;
        next();
    }).catch(err => {
        if (Config.opendebug)
        {
            req.body["userid"] = 1;
            return next();
        }
        try {
            loghelper.error(err);
            if (req.accepts().some((item, index, arry) => {
                return "text/html,application/xhtml+xml,application/xml;".includes(item);
            }) && !req.xhr) {
                var url = encodeURI(req.protocol + "://" + req.header("host") + req.url);
                res.redirect(Config.loginurl + "?back=" + url);
            }
            else
                res.status(401).render('error', { message: err.message, error: err });
        } catch (error) {
            res.status(401).render('error', { message: err.message, error: err });
        }

    })
});


app.use('/', routes);
app.use('/users', users);
app.use('/files', files);

// error handlers

// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
    app.use((err: any, req, res, next) => {
        res.status(err['status'] || 500);
        res.render('error', {
            message: err.message,
            error: err
        });
    });
}

// production error handler
// no stacktraces leaked to user
app.use((err: any, req, res, next) => {
    res.status(err.status || 500);
    res.render('error', {
        message: err.message,
        error: {}
    });
});

app.set('port', process.env.PORT || 3000);

var server = app.listen(app.get('port'), function () {
    loghelper.debug('Express server listening on port ' + server.address().port);
});
