var _db = require('../../Config/dbs').redis;
var _connction = require("Connction");
var cmd = _connction.command(_db);


exports.execute = function (param,callback) {
    cmd.execute(function () {
        var client = cmd.createconnection();
        //选择数据库
        client.rpush("file", JSON.stringify(param), function (err, data) {
            if (err) {
                cmd.error(err);
                return;
            }
            else {
                client.llen("file", function (err, data) {
                    cmd.end();

                    cmd.error(err);
                    callback(data);
                })
            }
        });
       
    });
}


