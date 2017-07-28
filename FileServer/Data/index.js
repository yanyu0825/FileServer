var Classes = Object.create(null);

exports.creatCommand = function (Type) {
    return loadClass(Type);
};
function loadClass(className) {
   
  var Class = Classes[className];

  if (Class !== undefined) {
    return Class;
  }

  // This uses a switch for static require analysis
  switch (className) {
    case 'query':
      Class = require('./lib/query');
            break;
        case 'code':
            Class = require('./lib/code');
            break;
        case 'newcache':
            Class = require('./lib/newcache');
            break;
        case 'getinfo':
            Class = require('./lib/getinfo');
            break;
        case 'newfile':
            Class = require('./lib/newfile');
            break;
    default:
      throw new Error('Cannot find class \'' + className + '\'');
  }

  // Store to prevent invoking require()
  Classes[className] = Class;
  return Class;
}
