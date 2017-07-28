var _mssql = require('mssql');
var _util = require('util');
var _events = require('events');

var _config = Object.create(null);
var _connection = Object.create(null);


function MSSqlCommand(config) {
    if (!config)
        throw new Error("���ò���Ϊnull");
    _config = config;
    
    //�׳����
    this.senddata = function (error, data) {
        var self = this;
        if (!error instanceof Error) {
            self.showError("error is not Error");
        }
        self.emit("data", error, data);
    };
    
    this.sqlmanagement = _mssql;
    //ִ�������
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
                }, self.sqlmanagement);
            } catch (e) {//��Ȼ�������� ���Ű�
                self._quitconnection(function () {
                    self.senddata(e, null);
                });
            }
        });
    };
    _events.EventEmitter.call(this);
};
_util.inherits(MSSqlCommand, _events.EventEmitter);


// �¼��׳��쳣
MSSqlCommand.prototype.showError = function (error) {
    if (error)
        console.log(error);
};

//��������
MSSqlCommand.prototype._createConnection = function (cb) {
    var self = this;
    _mssql.connect(_config, function (err) {
        if (err) {
            //�״�
            self.senddata(err, null);
            // ��Ҫ����
            //setTimeout(createconnection(cb, self) , 2000);
            return;
        }
        // ִ�лص�
        var request = new _mssql.Request();
        _connection = request.connection;
        request.on("error", function (error) {
            //�˳�����
            self._quitconnection(function () {
                //���ʹ�������
                self.senddata(err, null);
            });
        })
        cb(request);
    });
    _mssql.on('error', function (err) {
        // ��������ӶϿ����Զ���������
        if (err.code === 'PROTOCOL_CONNECTION_LOST') {
            self._createConnection(cb);
        } else {
            self.senddata(err, null);
        }
    });
};

//�ر�����
MSSqlCommand.prototype._quitconnection = function (cb) {
    if (_connection && _connection.connected)//���Ӵ��� ͬʱ�����Ѿ��������
    {
        // mssql ��close������֪����ȷ Ҳ���� request.cancel()
        _connection.close();
    }
    //��������
    _connection = Object.create(null);
    cb();
};

module.exports = MSSqlCommand; 