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
                // ��������ӶϿ����Զ���������
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
        throw new Error("���ò���Ϊnull");
    _config = config;
    
    ///�׳����
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
                //ִ�лص� ���� ���������Ӳ��Ѿ�ѡ������ݿ� and һ���ص� ͨ��һ���¼��������� ͬʱ�ر�����
                cb(client, function (exeerror, exedata) {
                    //�ر����Ӻ󷵻�����
                    self._quitconnection(function () {
                        //��������
                        self.senddata(exeerror, exedata);
                    });
                });
            } catch (e) {//��Ȼ�������� ���Ű�
                self._quitconnection(function () {
                    self.senddata(e, null);
                });
            }
        }, self);
    };
    _events.EventEmitter.call(this);
};
_util.inherits(MYSqlCommand, _events.EventEmitter);


// �¼��׳��쳣
MYSqlCommand.prototype.showError = function (error) {
    if (error)
        console.log(error);
};

//��������
MYSqlCommand.prototype._createConnection = function (cb) {
    if (!_pool)
        _pool = _mysql.createPool(_config);
    var self = this;
    _pool.getConnection(function (err, conn) {
        if (err) {
            self.senddata(err, null);
            // ��Ҫ����
            //setTimeout(createconnection(cb, self) , 2000);
            return;
        }
        _connection = conn;
        _connection.on('error', function (err) {
            // ��������ӶϿ����Զ���������
            if (err.code === 'PROTOCOL_CONNECTION_LOST') {
                self._createConnection(cb);
            } else {
                //�˳�����
                self._quitconnection(function () {
                    //���ʹ�������
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

//�ر�����
MYSqlCommand.prototype._quitconnection = function (cb) {
    if (_connection && _connection.connected)//���Ӵ��� ͬʱ�����Ѿ��������
    {
        // mssql ��close������֪����ȷ Ҳ���� request.cancel()
        _connection.release();
    }
    //��������
    _connection = Object.create(null);
    cb();
};

module.exports = MYSqlCommand; 