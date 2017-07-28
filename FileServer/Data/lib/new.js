var _db = require('../../Config/dbs').account;
var _con = require("../Connction");
var _mysqlcmd = _con.createConnection("mysql");
var _util = require('util');

exports.Query = Query;


function Query() {
    _mysqlcmd.MYSqlCommand.call(this, _db);
}
_util.inherits(Query, _mysqlcmd.MYSqlCommand);

Query.prototype.execute = function (param, callback) {
    var self = this;
    try {
        var str = 'insert into account(name,password) values ';
        param.forEach(function (elem) { 
            str += "('" + elem.name + "','" + elem.password + "'),";
        })
        str= str.substring(0, str.length - 1);
        var client = self.createconnection();
        //client.connect();
        var s = client.query(str, 
         function selectCb(err, results, fields) {
            client.end();
            self.emit("data", err, results);
           
        });
        //console.log(s.sql);
        
    }catch(err)
    {
        self.emit("data", err, null);
    }
}







exports.init = function () {
    return new Query();
};