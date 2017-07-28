var getinfoms = require("../data/fileinfoms");
var getinforedis = require("../data/inforedis");
//var async = require("async");



var fileinfomodel = function () { };

//{ userid: userid, size: 10, page: 1 }
fileinfomodel.prototype.queryinfo = function (param, cb) {
    //读取redis缓存数据
    if (!param)
        return cb(new Error("参数不正确"), null);
    
    //从数据库取出数据
    getinfoms.queryinfo(param, function (err, result) {
        cb(err, result);
    })
}

fileinfomodel.prototype.validate = function (code, cb) {
    if (!code) {
        cb(false);
    }
    else {
        var result = code.match("^[0-9a-zA-Z]{32}$");
        cb(result && result.length > 0);
    }
}

fileinfomodel.prototype.getinfo = function (code, cb) {
    //读取redis缓存数据
    var result = null;
    getinforedis.getinfo(code, function (err, result) {
        if (err || result) {//如果有误或者数据存在 直接返回
            cb(err, result);
            return;
        }
        
        //从数据库取出数据
        getinfoms.getinfo(code, function (err, result) {
            if (err || !result) {
                cb(err, null);
                return;
            }
            if (result) {
                //数据缓存到redis
                getinforedis.setinfo(result, function (err, Data) {
                    // 返回
                    cb(null, result)
                });
                
            }
        })
    });



}

//param={ "code": req.params.code, "userid": userid }
fileinfomodel.prototype.deleteinfo = function (param, cb) {
    
    getinfoms.disabled(param, function (err, result) {
        if (err || !result) {
            cb(err, null);
            return;
        }
        if (result) {
            //数据缓存到redis
            getinforedis.disabled(param.code, function (err, Data) {
                // 返回
                cb(err, Data)
            });

        }
    })

}

//entity = {"code":"","address":"","mimetype":"","createuserid":1}
fileinfomodel.prototype.newinfo = function (entity, cb) {
    if (!entity || !entity.code || !entity.address || !entity.mimetype || !entity.createuserid)
        return cb(null, { result: false, code: null, msg: "文件信息有误" });
    //存入数据
    getinfoms.newinfo(entity, function (error, result) {
        cb(null, { result: result, code: entity.code, msg: error?error.message:null })
    });
}

module.exports = new fileinfomodel();
//exports = new fileinfomodel();