var _connction = require("Connction");
var _events = require('events');
var _util = require('util');
exports.base = base;


function initcmd(dbconfig) {
    var cmd= _connction.command(dbconfig);
    cmd.on("data", function (error, data) {
        base.emit("data", error,data);
    });
    return cmd;
}

function base(dbconfig) {
    this.command = initcmd(dbconfig);
    this.execute = function (callback) {
        var self = this;
        cmd.execute(function () {
            callback();
        });
    };
    _events.EventEmitter.call(this);
}

_util.inherits(base, _events.EventEmitter);


function ss(cmd) { 
    var self = cmd;
    var client = self.createconnection();
    client.lrange("log.json", 1, count , function (err, data) {
        self.backdata(err, data);
        client.end();
    });

}

exports.init = function (config) {
    return new base(config);
};

