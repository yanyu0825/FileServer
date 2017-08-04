"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const crypto = require("crypto");
//var crypto = require("crypto");
const _max = 100000;
var _number = 0;
function format(num, length) {
    var result = num.toString();
    for (var i = 0, count = length - result.length; i < count; i++) {
        result = '0' + result;
    }
    return result.substr(0, length);
}
class CrytoHelper {
    constructor() {
        this.key = "observer";
    }
    static encrypt(str, secret) {
        var cipher = crypto.createCipher("aes192", secret);
        var enc = cipher.update(str, "utf8", "hex");
        enc += cipher.final("hex");
        return enc;
    }
    static decrypt(str, secret) {
        var decipher = crypto.createDecipher("aes192", secret);
        var dec = decipher.update(str, "hex", "utf8");
        dec += decipher.final("utf8");
        return dec;
    }
    ;
    static md5(str) {
        var md5sum = crypto.createHash("md5");
        md5sum.update(str, "utf8");
        str = md5sum.digest("hex");
        return str;
    }
    ;
    static randomString(size) {
        size = size || 6;
        var code_string = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
        var max_num = code_string.length - 1;
        var new_pass = "";
        while (size > 0) {
            new_pass += code_string.charAt(Math.floor(Math.random() * max_num));
            size--;
        }
        return new_pass;
    }
    ;
    static randomIntString(size) {
        size = size || 6;
        var code_string = "0123456789";
        var max_num = code_string.length - 1;
        var new_pass = "";
        while (size > 0) {
            new_pass += code_string.charAt(Math.floor(Math.random() * max_num));
            size--;
        }
        return new_pass;
    }
    ;
    static hmacsha256(content) {
        var SecrectKey = 'FF4D9425D29B4530AADAAF3F69A3576C'; //加密的密钥；
        //SecrectKey = crypto.randomBytes(16).toString('hex');//密钥加密；
        var Signture = crypto.createHmac('sha256', SecrectKey); //定义加密方式
        Signture.update(content);
        var miwen = Signture.digest().toString('base64');
        return miwen;
    }
    ;
    static Password(content) {
        return this.hmacsha256(content);
    }
    ;
    ///账号code
    static NewAccountCode(prefix) {
        let current = new Date();
        let month = format(current.getMonth() + 1, 2);
        let date = format(current.getDate(), 2);
        let hour = format(current.getHours(), 2);
        let minutes = format(current.getMinutes(), 2);
        let seconds = format(current.getSeconds(), 2);
        let milseconds = format(current.getMilliseconds(), 2);
        let unique = this.randomIntString(9);
        let str = current.getFullYear() + month + date + hour + minutes + seconds + milseconds + "_" + unique;
        return prefix + str;
    }
    ;
    ///订单号
    static newcode(size) {
        var current = new Date();
        var month = format(current.getMonth() + 1, 2);
        var date = format(current.getDate(), 2);
        var hour = format(current.getHours(), 2);
        var minutes = format(current.getMinutes(), 2);
        var seconds = format(current.getSeconds(), 2);
        var milseconds = format(current.getMilliseconds(), 2);
        var unique = format(_number % 1000000000, 9);
        var str = current.getFullYear() + month + date + hour + minutes + seconds + milseconds + "_" + unique;
        _number++;
        return str;
    }
    ;
    static guid(len) {
        var chars = '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz'.split('');
        var uuid = [];
        if (len) {
            var radix = chars.length;
            // Compact form
            for (var i = 0; i < len; i++)
                uuid[i] = chars[0 | Math.random() * radix];
        }
        else {
            // rfc4122, version 4 form
            var r;
            // rfc4122 requires these characters
            uuid[8] = uuid[13] = uuid[18] = uuid[23] = '-';
            uuid[14] = '4';
            // Fill in random data.  At i==19 set the high bits of clock sequence as
            // per rfc4122, sec. 4.1.5
            for (i = 0; i < 36; i++) {
                if (!uuid[i]) {
                    r = 0 | Math.random() * 16;
                    uuid[i] = chars[(i == 19) ? (r & 0x3) | 0x8 : r];
                }
            }
        }
        return uuid.join('');
    }
}
exports.CrytoHelper = CrytoHelper;
//# sourceMappingURL=CrytoHelper.js.map