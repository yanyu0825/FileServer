var _db = require('../../Config/dbs').redis;
var _connction = require("Connction");
var _events = require('events');
var _util = require('util');
//var _new = require('./new.js');
var count = 1000;
//exports.getinfo = getinfo;




function getinfo() {
    this.cmd = function () {
        var self = this;
        var cmd = _connction.command(_db);
        cmd.on("data", function (data) {
            self.emit("data", data);
        });
        cmd.on("error", function (error) {
            self.emit("error", error);
        });
        return cmd;
    };
    this.executecommand = function (param) {
        var self = this.cmd();
        self.execute(function () {
            var client = self.createconnection();
            client.lrange("log.json", 1, count , function (err, data) {
                self.backdata(err, data);
                client.end();
            })
        });
    };
    _events.EventEmitter.call(this);
}

_util.inherits(getinfo, _events.EventEmitter);

//getinfo.prototype.execute = function (param) {
//    var self = this;
//    var client = self.createconnection();
//    //client.connect();
    
//    client.lrange("log.json", 1, count , function (err, data) {
//        var d = data.map(function (r) { return JSON.parse(r) });;
//        var cmd = _new.init();
//        cmd.once("data", function (error, newdata) { 
//            if (!error && newdata) {
//                //存入数据库 存入成功后 删除数据
//                client.ltrim("log.json", count, -1 , function (err, deldata) {
//                    //存入数据库 存入成功后 删除数据
//                    self.emit("data", error, deldata == "OK"?data:deldata);
//                    client.end();
//                })
//            } else { 
//                self.emit("data", error, null);
//                client.end();
//            }
//        });
//        cmd.execute(d);
        
//    })
//    //client.hset(["hash key", "hashtest 2", "some other value"], _redis.print);

//}


exports.init = function () {
    return new getinfo();
};

