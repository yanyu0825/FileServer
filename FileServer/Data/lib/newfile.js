var _db = require('../../Config/dbs').redis;
var _connction = require("Connction");
var db = 3;//选择数据库

exports.execute = function (param, callback) {
    var cmd = _connction.command(_db);
    cmd.execute(function (client, errorlog) {
        //选择数据库
        client.select(db, function (err, data) {
            if (err || data != "OK") {
                errorlog(err); callback(data);
                return;
            }
            client.rpush("file", JSON.stringify(param), function (err, data) {
                if (err) {
                    errorlog(err);
                    return;
                }
                else {
                    client.llen("file", function (err, data) {
                        errorlog(err);
                        callback(data);
                    })
                }
            });
        })
        
       
    });
}

exports.get = function (id, callback) {
    var cmd = _connction.command(_db);
    cmd.execute(function (client, errorlog) {
        client.lrange("file", id - 1, id - 1 , function (err, data) {
            errorlog(err);
            callback(data?JSON.parse(data):null);
        });
    });
}

exports.getlen = function (callback) {
    var cmd = _connction.command(_db);
    cmd.execute(function (client, errorlog) {
        //选择数据库    
        client.select(db, function (err, data) {
            if (err||data!="OK") {
                errorlog(err);
                return;
            }
            client.llen("file", function (err, data1) {
                errorlog(err);
                callback(data1);
            })
        })   
        
    });
}



