
var _db = require('../Config/dbs');
//var _script = require(require('../script').user);
var _cmd = require("./test.js");
function filemodel(datas)
{
    this.data = datas;
}

filemodel.prototype.Execute = function (action)
{
    //var command = _cmd.init(_db.account);
    //command.on("error", function (error, data) {
    //    action(null);
    //});
    ////command.on("data", function (data) {
    ////    action(data[0][''] > 0?datas:null);
    ////});
    //command.execute(this.data, function (result) {
    //    if (result)
    //        this.Result = result;
    //    action(Result)
    //});
    _cmd.execute(this.data, function (result) {
        if (result)
            this.Result = result;
        action(Result)
    });
}

exports= new filemodel(data);