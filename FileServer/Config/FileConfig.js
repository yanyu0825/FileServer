var pathmethod = require('path');
var fs = require('fs');

var config =
    {
        tempdir: "./uploads/",
        realdir: "./realfiles/",
        files: {
            "img": {
                allowtypes: ["image/jpg", "image/jpeg", "image/gif", "image/png"], //允许文件上传的的mimetype 
                defaultpath: "default.jpg",
            },
            "video": {
                allowtypes: ["123"], //允许视频文件上传的的mimetype 
                defaultpath: null,//如果为空 返回http状态码404
                //throwpath: null//如果为空 返回http状态码404
            },
            "other": {
                allowtypes: ["application/otcm"], //允许文件上传的的mimetype 
                defaultpath: null,//如果为空 返回http状态码404
            }

        }
    };

var fileconfig = function () {}

//获取各个文件类型的默认文件
fileconfig.prototype.getdefaultfile = function (mimetype, callback) {
    var path = null;
    for (var i in config.files) {
        var file = config.files[i];
        for (var j in file.allowtypes) {
            var type = file.allowtypes[j];
            if (mimetype == type) {
                path =  file.defaultpath;
                break;
            }
        }
    }
    return path;
}

//获取图片生成地址的真实文件夹
fileconfig.prototype.getrealpath = function () {
    var now = new Date();
    var realpath = pathmethod.join(config.realdir, now.getFullYear().toString(), (now.getMonth()+1).toString(), now.getDate().toString());

    mkdirsSync(realpath);
    return realpath;
}


//获取图片上传文件夹
fileconfig.prototype.gettemppath = function () {
    var now = new Date();
    var path = pathmethod.join(config.tempdir, now.getFullYear().toString(), (now.getMonth() + 1).toString(), now.getDate().toString());

    mkdirsSync(path);
    return path;
}
//截断地址中的主文件夹--返回如片的相对目录
fileconfig.prototype.getsqlpath = function (address) {
    return pathmethod.relative(config.tempdir, address);
}


//获取主文件夹
fileconfig.prototype.getdirpath = function () {
    return config.realdir;
}



// 同步文件夹创建 递归方法
function mkdirsSync(dirpath) {
    if (!fs.existsSync(dirpath)) {
        var pathtmp;
        dirpath.split(pathmethod.sep).forEach(function (dirname) {
            if (pathtmp) {
                pathtmp = pathmethod.join(pathtmp, dirname);
            }
            else {
                pathtmp = dirname;
            }
            if (!fs.existsSync(pathtmp)) {
                if (!fs.mkdirSync(pathtmp)) {
                    return false;
                }
            }
        });
    }
    return true;
}

// 异步文件夹创建 递归方法
function mkdirs(dirpath, mode, callback) {
    callback = callback ||
        function () { };

    fs.exists(dirpath,
        function (exitsmain) {
            if (!exitsmain) {
                //目录不存在
                var pathtmp;
                var pathlist = dirpath.split(path.sep);
                var pathlistlength = pathlist.length;
                var pathlistlengthseed = 0;

                mkdir_auto_next(mode, pathlist, pathlist.length,
                    function (callresult) {
                        if (callresult) {
                            callback(true);
                        }
                        else {
                            callback(false);
                        }
                    });

            }
            else {
                callback(true);
            }

        });
}

// 异步文件夹创建 递归方法
function mkdir_auto_next(mode, pathlist, pathlistlength, callback, pathlistlengthseed, pathtmp) {
    callback = callback ||
        function () { };
    if (pathlistlength > 0) {

        if (!pathlistlengthseed) {
            pathlistlengthseed = 0;
        }

        if (pathlistlengthseed >= pathlistlength) {
            callback(true);
        }
        else {

            if (pathtmp) {
                pathtmp = path.join(pathtmp, pathlist[pathlistlengthseed]);
            }
            else {
                pathtmp = pathlist[pathlistlengthseed];
            }

            fs.exists(pathtmp,
                function (exists) {
                    if (!exists) {
                        fs.mkdir(pathtmp, mode,
                            function (isok) {
                                if (!isok) {
                                    mkdir_auto_next(mode, pathlist, pathlistlength,
                                        function (callresult) {
                                            callback(callresult);
                                        },
                                        pathlistlengthseed + 1, pathtmp);
                                }
                                else {
                                    callback(false);
                                }
                            });
                    }
                    else {
                        mkdir_auto_next(mode, pathlist, pathlistlength,
                            function (callresult) {
                                callback(callresult);
                            },
                            pathlistlengthseed + 1, pathtmp);
                    }
                });

        }

    }
    else {
        callback(true);
    }

}

module.exports = new fileconfig();