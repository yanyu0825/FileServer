
var _cmd = require("../data");
var params = Object.create(null);

var path = require('path');
var config = require("../config/fileconfig");
var fs = require('fs');


var filemodel = function(){};


var Execute= function()
{
    var command = _cmd.command("query");
    command.once("data", function(error, data) {
        //command.removeListener("data", data);
        //生成cookies 随即字符串
        if (error || data.length <= 0) {
            callback("account");
            return;
        }
        var cmd = _cmd.command("code");
        cmd.once("data", newcode);
        cmd.execute();
    });
    command.execute(params);
}


//新建文件
function newfile(error, data) {
    if (error || !data) {
        callback("newcode");
        return;
    }
    //action(error?error:data);
    var cmd = _cmd.command("newcache");
    cmd.once("data", newcache);
    //cmd.execute({ key: data, value: JSON.stringify(params) });
    cmd.execute({ key: data, value: params });
}



//读取文件的真实地址
filemodel.prototype.getfilepath = function (param, callback) {
    if (!param)
        throw new Error("读取文件的真实地址 参数有误");
    //var realpath = path.join(config.getdirpath(), param.forbidden ? config.getdefaultfile(param.mimetype) : param.address); //加载文件主目录
    

    //fs.exists(realpath, function (exists) {
    //    if (exists) {
    //        param.address = realpath;
    //    }
    //    callback(exists ? null : new Error("文件不存在"), param);
    //});

    //param.address = param.forbidden ? config.getdefaultfile(param.mimetype) : param.address; //不加文件主目录留待 sendfile 再加
    param.address = path.join(config.getdirpath(), param.forbidden ? config.getdefaultfile(param.mimetype) : param.address); //加载文件主目录
    callback(null, param);
}


module.exports = new filemodel();