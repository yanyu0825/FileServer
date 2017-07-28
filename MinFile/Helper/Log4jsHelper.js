var log4js = require('log4js');
var path = require("path");
var fs = require('fs');
var objConfig = require("../Config/log4js.json");

//LogFile.trace('This is a Log4js-Test');
//LogFile.debug('We Write Logs with log4js');
//LogFile.info('You can find logs-files in the log-dir');
//LogFile.warn('log-dir is a configuration-item in the log4js.json');
//LogFile.error('In This Test log-dir is : \'./logs/log_test/\'');

//console.log("log_start end!");  






var helper = {};
module.exports = helper;

// 检查配置文件所需的目录是否存在，不存在时创建
if (objConfig.appenders) {
    var baseDir = objConfig["customBaseDir"];
    var defaultAtt = objConfig["customDefaultAtt"];

    for (var i = 0, j = objConfig.appenders.length; i < j; i++) {
        var item = objConfig.appenders[i];
        if (item["type"] == "console")
            continue;

        if (defaultAtt != null) {
            for (var att in defaultAtt) {
                if (item[att] == null)
                    item[att] = defaultAtt[att];
            }
        }
        if (baseDir != null) {
            if (item["filename"] == null)
                item["filename"] = baseDir;
            else
                item["filename"] = baseDir + item["filename"];
        }
        var fileName = item["filename"];
        if (fileName == null)
            continue;
        var pattern = item["pattern"];
        if (pattern != null) {
            fileName += pattern;
        }
        var category = item["category"];
        //if (!isAbsoluteDir(fileName))//path.isAbsolute(fileName))
        //    throw new Error("配置节" + category + "的路径不是绝对路径:" + fileName);
        if (!(path.isAbsolute(fileName)))
        {
            fileName = path.resolve(fileName);
        }

        var dir = path.dirname(fileName);
        checkAndCreateDir(dir);
    }
}

// 目录创建完毕，才加载配置，不然会出异常
log4js.configure(objConfig);

var logDebug = log4js.getLogger('logDebug');
var logInfo = log4js.getLogger('logInfo');
var logWarn = log4js.getLogger('logWarn');
var logErr = log4js.getLogger('logErr');
var logconsole = log4js.getLogger('console');

helper.debug = function (msg) {
    if (msg == null)
        msg = "";
    logDebug.debug(msg);
    logconsole.debug(msg);
};

helper.info = function (msg) {
    if (msg == null)
        msg = "";
    logInfo.info(msg);
};

// 配合express用的方法
helper.use = function (app) {
    //页面请求日志, level用auto时,默认级别是WARN
    app.use(log4js.connectLogger(logInfo, { level: 'debug', format: ':method :url' }));
}

// 判断日志目录是否存在，不存在时创建日志目录
function checkAndCreateDir(dir) {
    var predir = path.resolve(dir, '..');
    if (!fs.existsSync(predir))
    {
        checkAndCreateDir(predir);
    }
    if (!fs.existsSync(dir))
        fs.mkdirSync(dir);
}

// 指定的字符串是否绝对路径
function isAbsoluteDir(path) {
    if (path == null)
        return false;
    var len = path.length;

    var isWindows = process.platform === 'win32';
    if (isWindows) {
        if (len <= 1)
            return false;
        return path[1] == ":";
    } else {
        if (len <= 0)
            return false;
        return path[0] == "/";
    }
}