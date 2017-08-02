"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const MSCommand_1 = require("./Interface/MSCommand");
const mssql_1 = require("mssql");
//clientid 缓存
class FileInfoMS {
    constructor(config) {
        this.rediscommand = null;
        this.rediscommand = new MSCommand_1.MSCommand(config);
    }
    EnabledFile(code) {
        let back = false;
        return this.rediscommand.execute(client => {
            client.input('code', mssql_1.TYPES.VarChar, "%" + code); //
            return client.query('update [file] set [status]=1 where  [address] like @code and [status]=0').then(result => {
                back = result[0].rowsAffected > 0;
            });
        }).then(function () {
            return back;
        });
    }
    GetPath(address) {
        let back = null;
        //执行查询
        return this.rediscommand.execute(client => {
            client.input('code', mssql_1.TYPES.VarChar, "%" + address); //
            return client.query('select  [address] from [file] where [address] like @code').then(result => {
                if (result.recordset && result.recordset[0] && result.recordset[0].address) {
                    var add = result.recordset[0].address;
                    back = add.substring(0, add.length - address.length);
                }
                else
                    throw new Error("无数据");
            });
        }).then(() => {
            return back;
        });
    }
}
exports.FileInfoMS = FileInfoMS;
//# sourceMappingURL=FileInfoMS.js.map