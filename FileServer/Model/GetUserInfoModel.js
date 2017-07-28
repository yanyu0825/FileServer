
var _cmd = require("../data");
var params = Object.create(null);
var callback = null;
var Execute= function()
{
    var command = _cmd.command("getinfo");
    command.once("data", function(error, data) {
        //command.removeListener("data", data);
        //生成cookies 随即字符串
        if (error || !data) {
            callback("account");
            return;
        }
        callback(data);
    });
    command.execute(params);
}



exports.init = function (data,action) {
    params = data;
    callback = action;
    Execute();
};