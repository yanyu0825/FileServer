var Classes = Object.create(null);


//var config= {
//    command: "mysql", config: {
//        host: '192.168.1.8'
//        //, port: 3306
//        , database: 'account'
//        ,user: 'root'
//        ,password: '111111'
//    }
//}
exports.command = function (config,cb) {
    //if (!config.name)//判断是否需要一直链接不关闭链接
    //return loadClass(config.command).init(config.config);

    var Class = loadClass(config.command);
    var command= new Class(config.config);
    command.on("data", function (error,data) {
        cb(error,data);
    });
    return command;
};

exports.command = function (config, cb) {
    //if (!config.name)//判断是否需要一直链接不关闭链接
    //return loadClass(config.command).init(config.config);
    
    var Class = loadClass(config.command);
    var command = new Class(config.config);
    command.on("data", function (error, data) {
        cb(error, data);
    });
    return command;
};

function loadClass(className) {
  ////取消缓存
  //var Class = Classes[className]; 
  //if (Class !== undefined) {
  //  return Class;
  //}

  // This uses a switch for static require analysis
  switch (className) {
    case 'mysql':
      Class = require('./lib/mysql');
      break;
    case 'mssql':
      Class = require('./lib/mssql');
      break;
    case 'redis':
      Class = require('./lib/redis');
      break;
    //case 'basecommand':
    //  Class = require('./lib/command');
    //  break;
    //case 'testmysql':
    //  Class = require('./lib/testmysql');
    //   break;
    default:
      throw new Error('Cannot find class \'' + className + '\'');
  }

  // Store to prevent invoking require()
  //Classes[className] = Class;

  return Class;
}
