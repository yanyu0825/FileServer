var _db = require('../../Config/dbs').redis;
var _con = require("../Connction");
var _redis = _con.createConnection("redis");
var _util = require('util');
var _expire = 60;
exports.newcache = newcache;




function newcache() {
    _redis.RedisCommand.call(this, _db);
}

_util.inherits(newcache, _redis.RedisCommand);

newcache.prototype.execute = function (param) {
    var self = this;
    var client = self.createconnection();
    //client.connect();
    
    client.set(param.key, JSON.stringify(param.value), function (error, data) {
        if (data == "OK") {
            client.expire(param.key, _expire, function (error, data) {
                self.emit("data", error, data == 1?param:data);
                client.end();
            });
        } else { 
            self.emit("data", error, data == "OK"?param:data);
            client.end();
        }
    });
    //client.hset(["hash key", "hashtest 2", "some other value"], _redis.print);

}


exports.init = function () {
    return new newcache();
};