var _events = require('events');
var _util = require('util');

exports.Code = Code;
var _max = 100000;
var _number = 0;

function format(number, length) {
    var result = number.toString();
    for (var i = 0, count = length - result.length; i < count; i++) {
        result = '0' + result;
    }
    return result.substr(0, length);
}
function Code() {
    _events.EventEmitter.call(this);
}
_util.inherits(Code, _events.EventEmitter);

Code.prototype.execute = function () {
    try {
        var current = new Date();
        var month = format(current.getMonth() + 1, 2);
        var date = format(current.getDate(), 2);
        var hour = format(current.getHours(), 2);
        var minutes = format(current.getMinutes(), 2);
        var seconds = format(current.getSeconds(), 2);
        var milseconds = format(current.getMilliseconds(), 2);
        var unique = format(_number % 1000000000, 9);
        var str = "node" + current.getFullYear() + month + date + hour + minutes + seconds + milseconds + "_" + unique;
        _number++;
        //return str;
        this.emit("data", null, str);
    } catch (err) { 
        this.emit("data", err, null);
    }
}


exports.init = function () {
    return new Code();
};