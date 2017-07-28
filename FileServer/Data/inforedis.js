var dbconfig = require('../Config/dbs').fileredis;
var cmd = require("../Helper/db");


var inforedis = function () { };

inforedis.prototype.getinfo = function (param, action) {
    //var rediscommand = new cmd(dbconfig);
    //rediscommand.execute(function (client, callback) {
    //    client.hmget("fileinfo", param, function (err, data) {
    //        //关闭连接 并返回 也可以client.quit()
    //        //callback(function () {
    //        //    cb(err, data);
    //        //});
    //        //直接返回不关闭连接
    //        cb(err, JSON.parse(data[0]));
    
    //    });
    //})
    
    //实例化cmd
    var rediscmd = cmd.command(dbconfig, action);
    
    //执行查询
    rediscmd.execute(function (client, cb) {
        client.hmget("fileinfo", param, function (err, data) {
            //直接返回不关闭连接
            cb(err, data && data.length > 0?JSON.parse(data[0]):null);

        });
    });


    //this.cmd = function () {
    //    var self = this;
    //    var cmd = _connction.command(_db);
    //    cmd.on("data", function (data) {
    //        self.emit("data", data);
    //    });
    //    cmd.on("error", function (error) {
    //        self.emit("error", error);
    //    });
    //    return cmd;
    //};
    //this.executecommand = function (param) {
    //    var self = this.cmd();
    //    self.execute(function () {
    //        var client = self.createconnection();
    //        client.lrange("log.json", 1, count , function (err, data) {
    //            self.backdata(err, data);
    //            client.end();
    //        })
    //    });
    //};
    //_events.EventEmitter.call(this);
}

inforedis.prototype.setinfo = function (entity, action) {
    //实例化cmd
    var rediscmd = cmd.command(dbconfig, action);
    
    rediscmd.execute(function (client, cb) {
        client.hmset("fileinfo", entity.code, JSON.stringify(entity), function (err, data) {
            cb(err, data);
        });
    })
}

inforedis.prototype.disabled = function (code, action) {

    //实例化cmd
    var rediscmd = cmd.command(dbconfig, action);

    rediscmd.execute(function (client, cb) {
        client.hdel("fileinfo", code,function (err, data) {
            cb(err, data>0);
        });
    })
}

module.exports = new inforedis();