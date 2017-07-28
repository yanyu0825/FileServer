var objConfig = require("../Config/log4js.json");
var dbconfig = require('../Config/dbs').logredis;
var cmd = require("../Helper/db");

//实例化cmd
var rediscmd = cmd.command(dbconfig, function (err, data) {
    if (err)
        console.log(err);
});


var helper = {};
module.exports = helper;

helper.debug = function (msg) {
    if (msg != null)
        insertToRedis("异常错误信息", msg,"Debug")
};

helper.info = function (msg) {
    if (msg != null)
        insertToRedis("记录信息", msg, "Info")
};

// 配合express用的方法
helper.use = function (app) {
    //页面请求日志, level用auto时,默认级别是WARN
    app.use(function (request, response, next) {
        insertToRedis("访问记录", request.baseUrl,"Info")
        next();
    });
}



function insertToRedis(title, msg, logtype) {
    
    var param = JSON.stringify({ title: title, content: msg, appname: "fileserver", logtype: logtype, time: new Date().toLocaleString() });

    
    //执行查询
    rediscmd.execute(function (client, cb) {
        client.rpush("errorlog", param, function (err, data) {
            //直接返回不关闭连接
            cb(err, data);
        });
    });
}