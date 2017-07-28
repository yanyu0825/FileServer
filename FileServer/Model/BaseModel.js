
var _cmd = require("../data");
var params = Object.create(null);
var callback = null;
var Execute= function()
{
    var command = _cmd.command("query");
    command.once("data", function(error, data) {
        //command.removeListener("data", data);
        //生成cookies 随即字符串
        if (error || data.length <= 0) {
            callback("account");
            return;
        }
        var cmd = _cmd.command("code");
        cmd.once("data", newcode);
        cmd.execute();
    });
    command.execute(params);
}


function newcode(error, data) {
    if (error || !data) {
        callback("newcode");
        return;
    }
    //action(error?error:data);
    var cmd = _cmd.command("newcache");
    cmd.once("data", newcache);
    //cmd.execute({ key: data, value: JSON.stringify(params) });
    cmd.execute({ key: data, value: params });
}
//存储到redis后
function newcache(error, data) {
    if (error || !data) {
        callback("newcode");
        return;
    }
    callback(data);
}

exports.init = function (data,action) {
    params = data;
    callback = action;
    Execute();
};