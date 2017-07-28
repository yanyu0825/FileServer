var _mysql = require('mysql');
var _util = require('util');
var _events = require('events');

var _config = Object.create(null);
var _pool = null;
var _connection = Object.create(null);

var createconnection = function (cb, self) {
    if (pool === undefined)
        pool = _mysql.createPool(self.config);
    pool.getConnection(function (err, conn) {
        if (err) {
            senderror(err, false, self);
            setTimeout(createconnection(cb, self) , 2000);
        } else {
            conn.on('error', function (err) {
                // 如果是连接断开，自动重新连接
                if (err.code === 'PROTOCOL_CONNECTION_LOST') {
                    createconnection(cb, self);
                } else {
                    senderror(error, true, self);
                }
            });
            conn.config.queryFormat = function (query, values) {
                if (!values) return query;
                return query.replace(/\:(\w+)/g, function (txt, key) {
                    if (values.hasOwnProperty(key)) {
                        return this.escape(values[key]);
                    }
                    return txt;
                }.bind(this));
            };
            cb(conn);


            //conn.connect(function (err) {
            //    if (err) {
            //        senderror(err, false, self);
            //        setTimeout(createconnection(cb, self) , 2000);
            //        return;
            //    } 
            //    cb(conn);
            //});
        }
    });
};


function MYSqlCommand(config) {
    if (!config)
        throw new Error("配置不能为null");
    _config = config;
    
    ///抛出结果
    this.senddata = function (error, data) {
        var self = this;
        if (!error instanceof Error) {
            self.showError("error is not Error");
        }
        self.emit("data", error, data);
    };

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
                });
            } catch (e) {//虽然觉得无用 留着吧
                self._quitconnection(function () {
                    self.senddata(e, null);
                });
            }
        }, self);
    };
    _events.EventEmitter.call(this);
};
_util.inherits(MYSqlCommand, _events.EventEmitter);


// 事件抛出异常
MYSqlCommand.prototype.showError = function (error) {
    if (error)
        console.log(error);
};

//创建连接
MYSqlCommand.prototype._createConnection = function (cb) {
    if (!_pool)
        _pool = _mysql.createPool(_config);
    var self = this;
    _pool.getConnection(function (err, conn) {
        if (err) {
            self.senddata(err, null);
            // 不要重连
            //setTimeout(createconnection(cb, self) , 2000);
            return;
        }
        _connection = conn;
        _connection.on('error', function (err) {
            // 如果是连接断开，自动重新连接
            if (err.code === 'PROTOCOL_CONNECTION_LOST') {
                self._createConnection(cb);
            } else {
                //退出连接
                self._quitconnection(function () {
                    //发送错误内容
                    self.senddata(err, null);
                });
            }
        });
        _connection.config.queryFormat = function (query, values) {
            if (!values) return query;
            return query.replace(/\:(\w+)/g, function (txt, key) {
                if (values.hasOwnProperty(key)) {
                    return this.escape(values[key]);
                }
                return txt;
            }.bind(this));
        };
        cb(_connection);
        //conn.connect(function (err) {
        //    if (err) {
        //        senderror(err, false, self);
        //        setTimeout(createconnection(cb, self) , 2000);
        //        return;
        //    } 
        //    cb(conn);
        //});
    });
    
};

//关闭链接
MYSqlCommand.prototype._quitconnection = function (cb) {
    if (_connection && _connection.connected)//链接存在 同时链接已经连接完毕
    {
        // mssql 的close方法不知道正确 也许是 request.cancel()
        _connection.release();
    }
    //连接重置
    _connection = Object.create(null);
    cb();
};

module.exports = MYSqlCommand; 