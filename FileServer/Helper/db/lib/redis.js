var _redis = require('redis');
var _events = require('events');
var _util = require('util');

var _config = Object.create(null);
var _connection = Object.create(null);


function RedisCommand(config) {
    if (config === undefined)
        throw new Error("配置不能为null");
    if (!config)
        throw new Error("配置不能为null");
    _config = config;
    
    //抛出结果
    this.senddata = function (error, data) {
        var self = this;
        if (!error instanceof Error) {
            self.showError("error is not Error");
        }
        self.emit("data", error, data);
    };
    
    //执行主入口
    this.execute = function (cb) {
        var self = this;
        self._createConnection(function (client) {
            //选择数据库
            client.select(_config.database, function (err, data) {
                if (err || data != "OK") {
                    self.senddata(err?err:new Error("选择数据库不成功"), null);
                    return;
                };
                try {
                    //执行回调 参数 创建的链接并已经选择好数据库 and 一个回调 通过一个事件返回数据 同时关闭链接
                    cb(client, function (exeerror, exedata) {
                        //关闭连接后返回数据
                        self._quitconnection(client,function () {
                            self.senddata(exeerror, exedata);
                        });
                    });
                } catch (e) {//虽然觉得无用 留着吧
                    self._quitconnection(function () {
                        self.senddata(e, null);
                    });
                }
            });
        });
    };
    
    _events.EventEmitter.call(this);
};
_util.inherits(RedisCommand, _events.EventEmitter);



// 事件抛出异常
RedisCommand.prototype.showError = function (error) {
    if (error)
        console.log(error);
};

//创建连接
RedisCommand.prototype._createConnection = function (cb) {
    var self = this;
    var connection = _redis.createClient(_config);
    connection.on("error", function (error) {
        self.senddata(error, null);
    });
    connection.on("connect", function () {
        cb(connection);
    });
    
};

//关闭链接
RedisCommand.prototype._quitconnection = function (connection, cb) {
    if (connection && connection.connected)//链接存在 同时链接已经连接完毕
        connection.quit();
    //连接重置
    cb();
};

module.exports = RedisCommand;
