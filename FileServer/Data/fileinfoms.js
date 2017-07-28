var dbconfig = require('../Config/dbs').file;
var cmd = require("../Helper/db");
var pathmethod = require('path');

var fileinfoms = function () { }



fileinfoms.prototype.getinfo = function (param, action) {
    
    //实例化cmd
    var mscommand = cmd.command(dbconfig, action);
    
    //执行查询
    mscommand.execute(function (client, cb) {
        var str = "select [code],[address],[createtime] ,[createuserid],[mimetype],[status] as forbidden from  [file] where [status]=1 and  code=@code";
        client.input('code', sql.VarChar, param)//
        client.query(str).then(function (recordset) {
            cb(null, recordset.length > 0 ? recordset[0]:null);
        }).catch(function (err) {
            cb(err, null);
        });
    });
}

fileinfoms.prototype.newinfo = function (param, action) {
    
    //实例化cmd
    var mscommand = cmd.command(dbconfig, action);
    
    //执行查询
    mscommand.execute(function (client, cb, sql) {
        var str = 'insert into [file](code,address,createuserid,mimetype) values (@code,@address,@userid,@mimetype);insert into [FileLog] ([filecode],[userid],[type]) values(@code,@userid,\'added\')';
        client.input('code', sql.VarChar, param.code)//
        client.input('address', sql.VarChar, param.address)//
        client.input('userid', sql.Int, param.createuserid)//
        client.input('mimetype', sql.VarChar  , param.mimetype)//
        
        client.query(str).then(function (recordset) {
            cb(null, client.rowsAffected>0);
        }).catch(function (err) {
            cb(err, false);
        });

    });
}
fileinfoms.prototype.disabled = function (param, action) {

    //实例化cmd
    var mscommand = cmd.command(dbconfig, action);

    //执行查询
    mscommand.execute(function (client, cb, sql) {
        var str = 'update [file] set [status]=0 where  [code] = @code;   insert into [FileLog] ([filecode],[userid],[type]) values(@code,@userid,\'disabled\')';
        client.input('code', sql.VarChar, param.code)//
        client.input('userid', sql.Int, param.userid)//
        client.query(str).then(function (recordset) {
            cb(null, client.rowsAffected > 0);
        }).catch(function (err) {
            cb(err, false);
        });

    });
}



fileinfoms.prototype.queryinfo = function (param, action) {
    
    //实例化cmd
    var mscommand = cmd.command(dbconfig, action);
    
    //执行查询
    mscommand.execute(function (client, cb, sql) {
        client.input('tblName', sql.NVarChar(200), "[File]")//表名
        client.input('fldName', sql.NVarChar(2000), "[code],[address],[createtime],[createuserid],[mimetype],[status]")//字段
        client.input('pageSize', sql.Int, param.size)//
        client.input('page', sql.Int  , param.page)//
        client.input('fldSort', sql.NVarChar(200)  , "[createtime]")// 排序的字段
        client.input('Sort', sql.Bit  , true)// 排序的方法
        client.input('strCondition', sql.NVarChar(2000)," and createuserid="+ param.userid)// 条件
        client.input('ID', sql.NVarChar(150)  , "[code]")//主键
        
        client.output('pageCount', sql.Int)//当前条数
        client.output('Counts', sql.Int)//总数
        
        client.execute("[DataPagination]", function (err, recordsets, returnValue, affected) {
            if (err)
                cb(err, null);
            else { 
                var data = [];
                recordsets[0].forEach(function (item) { 
                    data.push({ code: item.code, address: item.address, userid: item.userid, createtime: item.createtime, forbidden: item.status, ext: pathmethod.extname(item.address) })
                })
                cb(null, { total: client.parameters.Counts.value, page: param.page, data: data });
            }
        });
        
        //client.query("[DataPagination]").then(function (recordset) {
        //    cb(null, client.rowsAffected > 0);
        //}).catch(function (err) {
        //    cb(err, false);
        //});

    });
}


module.exports = new fileinfoms()