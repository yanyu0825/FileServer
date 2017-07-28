var _mssql = require('mssql');
var _util = require('util');
var _events = require('events');

var _config = Object.create(null);
var _connection = Object.create(null);


function MSSqlCommand(config) {
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
    
    this.sqlmanagement = _mssql;
    //执行主入口
    this.execute = function (cb) {
        var self = this;
        self._createConnection(function (client) {
            try {
                //执行回调 参数 创建的链接并已经选择好数据库 and 一个回调 通过一个事件返回数据 同时关闭链接
                cb(client, function (exeerror, exedata) {
                    //关闭连接后返回数据
                    self._quitconnection(function () {
                        //返回数据
                        self.senddata(exeerror, exedata);
                    });
                }, self.sqlmanagement);
            } catch (e) {//虽然觉得无用 留着吧
                self._quitconnection(function () {
                    self.senddata(e, null);
                });
            }
        });
    };
    _events.EventEmitter.call(this);
};
_util.inherits(MSSqlCommand, _events.EventEmitter);


// 事件抛出异常
MSSqlCommand.prototype.showError = function (error) {
    if (error)
        console.log(error);
};

//创建连接
MSSqlCommand.prototype._createConnection = function (cb) {
    var self = this;
    _mssql.connect(_config, function (err) {
        if (err) {
            //抛错
            self.senddata(err, null);
            // 不要重连
            //setTimeout(createconnection(cb, self) , 2000);
            return;
        }
        // 执行回调
        var request = new _mssql.Request();
        _connection = request.connection;
        request.on("error", function (error) {
            //退出连接
            self._quitconnection(function () {
                //发送错误内容
                self.senddata(err, null);
            });
        })
        cb(request);
    });
    _mssql.on('error', function (err) {
        // 如果是连接断开，自动重新连接
        if (err.code === 'PROTOCOL_CONNECTION_LOST') {
            self._createConnection(cb);
        } else {
            self.senddata(err, null);
        }
    });
};

//关闭链接
MSSqlCommand.prototype._quitconnection = function (cb) {
    if (_connection && _connection.connected)//链接存在 同时链接已经连接完毕
    {
        // mssql 的close方法不知道正确 也许是 request.cancel()
        _connection.close();
    }
    //连接重置
    _connection = Object.create(null);
    cb();
};

module.exports = MSSqlCommand; 