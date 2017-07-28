var dbconfig = require('../Config/dbs').file;
var cmd = require("../Helper/db");

var fileinfoms = function () { }



//fileinfoms.prototype.modify = function (param, action) {
    
//    //实例化cmd
//    var mscommand = cmd.command(dbconfig, action);
    
//    //执行查询
//    mscommand.execute(function (client, cb) {
//        client.query("select * from  [file] where code='" + param.replace("'", "''") + "'").then(function (recordset) {
//            cb(null, recordset.length > 0 ? recordset[0]:null);
//        }).catch(function (err) {
//            cb(err, null);
//        });
//    });
//}

/// param= 文件名
fileinfoms.prototype.newinfo = function (param, action) {
    
    //实例化cmd
    var mscommand = cmd.command(dbconfig, action);
    
    //执行查询
    mscommand.execute(function (client, cb, sql) {
        var str = 'update [file] set [status]=1 where  [address] like @code and [status]=0';
        client.input('code', sql.VarChar, "%"+param)//
        
        client.query(str).then(function (recordset) {
            cb(null, client.rowsAffected>0);
        }).catch(function (err) {
            cb(err, false);
        });

    });
}

module.exports = new fileinfoms()