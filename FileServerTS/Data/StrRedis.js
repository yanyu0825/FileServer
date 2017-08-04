"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const IncRedis_1 = require("./IncRedis");
const source = "str:";
//clientid 缓存
class StrRedis extends IncRedis_1.IncRedis {
    constructor(config) {
        super(config);
    }
    SetList(key, value) {
        let result = false;
        return this.rediscommand.execute(function (client) {
            return new Promise((resolve, reject) => {
                result = client.rpush(key, value, (err, setresult) => {
                    if (err)
                        reject(err);
                    else {
                        result = setresult > 0;
                        resolve();
                    }
                });
            });
        }).then(function () {
            return result;
        });
    }
    Get(param) {
        let result = null;
        return this.rediscommand.execute(function (client) {
            return new Promise((resolve, reject) => {
                let key = source + param;
                client.get(key, (err, data) => {
                    //直接返回不关闭连接
                    if (err) {
                        reject(err);
                    }
                    else {
                        result = data;
                        resolve();
                    }
                });
            });
        }).then(function () {
            return result;
        });
    }
    Set(param, value) {
        let result = false;
        return this.rediscommand.execute(function (client) {
            return new Promise((resolve, reject) => {
                let key = source + param;
                result = client.set(key, value, (err, setresult) => {
                    if (err)
                        reject(err);
                    else {
                        console.log(setresult);
                        result = setresult == "OK";
                        resolve();
                    }
                });
            });
        }).then(function () {
            return result;
        });
    }
    Expire(param, maxage) {
        let result = false;
        return this.rediscommand.execute(function (client) {
            return new Promise((resolve, reject) => {
                let key = source + param;
                client.expire(key, maxage, (err, setresult) => {
                    if (err)
                        reject(err);
                    else {
                        result = setresult == 1;
                        resolve();
                    }
                });
            });
        }).then(function () {
            return result;
        });
    }
}
exports.StrRedis = StrRedis;
//# sourceMappingURL=StrRedis.js.map