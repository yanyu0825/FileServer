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

/// param= 文件名
fileinfoms.prototype.getpath = function (address,action) {
    //实例化cmd
    var mscommand = cmd.command(dbconfig, action);

    //执行查询
    mscommand.execute(function (client, cb, sql) {
        var str = 'select  [address] from [file] where [address] like @code';
        client.input('code', sql.VarChar, "%" + address)//

        client.query(str).then(function (result) {
            if (result && result[0]) {
                var add = result[0].address;
                cb(null, add.substring(0, add.length - address.length));
                //cb(null, add);
            } else
            {
                cb(new Error("无数据"), null);
            }
        }).catch(function (err) {
            cb(err, null);
        });
    });
}


module.exports = new fileinfoms()