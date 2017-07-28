var express = require('express');
var fs = require('fs');
var router = express.Router();
var pathmethod = require('path');
var async = require("async");
var multiparty = require('multiparty');

var fileconfig = require("../config/fileconfig");
var filemodel = require("../model/filemodel");
var fileinfomodel = require("../model/fileinfomodel");
var guid = require("../Helper/CrytoHelper");
var loghelper = require('../Helper/RedisLogHelper');


/* 文件管理器 
 */

router.get('/testgetfile', function (req, res) {
    filemodel.getfilepath({ forbidden: true, mimetype: "image/jpeg" }, function (err, result) {
        res.sendfile(result.address);
    });
});

/* 列出所有文件夹 最新的由自己创建的10文件. */
router.get('/query/:size/:page', function (req, res) {
    var userid = 1;

    //获取最近自己上传的10个文件
    fileinfomodel.queryinfo({ userid: userid, size: req.params.size || 10, page: req.params.page || 1 }, function (err, result) {
        //result = { total: 10, page: 1, data: [{ code: "", address: "", userid: 1, createtime: "", forbidden: false, ext: "" }] }
        //返回文件
        if (err) {
            loghelper.debug(err);
            res.status(503);// 返回自定义的404
            res.render("error", { message: err, error: { status: "503" } });
            return;
        }
        res.json(result);
        //res.render('files', { title: 'File', data: result });
    });

});

/*获取文件网页打开*/
router.get('/get/:code', function (req, res, next) {
    async.waterfall([
        function (cb) {
            //验证参数code的格式
            fileinfomodel.validate(req.params.code, function (result) {
                cb(result ? null : new Error("参数不正确"), req.params.code);
            });
        }, function (param, cb) {
            //读取文件的信息
            fileinfomodel.getinfo(param, function (err, result) {
                if (err || !result)
                    cb(err ? err : new Error("文件code 不存在"), null);
                else
                    cb(err, result);
            });
        },
        function (param, cb) {
            //读取本地文件地址  文件地址赋值到参数中 并传值出去
            //判断文件默认值  否则抛异常
            filemodel.getfilepath(param, cb);
        }],
        function (err, result) {
            //返回文件
            if (err) {
                loghelper.debug(err);
                //next(); // 返回自带的404
                res.status(404);// 返回自定义的404
                res.render("error", { message: err, error: { status: "404" } });
                return;
            }
            if (result.forbidden) {
                res.sendStatus(403);
                return;
            }
            //res.writeHead(200, { "Content-Type": result.mimetype + ";charset=utf-8" });
            //var content = fs.readFileSync(result.address);
            //res.end(content, "binary");
            res.sendFile(result.address, { root: "./" });
        });

});

/*下载文件*/
router.get('/download/:code', function (req, res) {

    async.waterfall([
        function (cb) {
            //验证参数code的格式
            fileinfomodel.validate(req.params.code, function (result) {
                cb(result ? null : new Error("参数不正确"), req.params.code);
            });
        }, function (param, cb) {
            //读取文件的信息
            fileinfomodel.getinfo(param, function (err, result) {
                if (err || !result)
                    cb(err ? err : new Error("文件code 不存在"), null);
                else
                    cb(err, result);
            });
        },
        function (param, cb) {
            //读取本地文件地址  文件地址赋值到参数中 并传值出去
            //判断文件默认值  否则抛异常
            filemodel.getfilepath(param, cb);
        }],
        function (err, result) {
            //返回文件
            if (err) {
                loghelper.debug(err);
                //next(); // 返回自带的404
                res.status(404);// 返回自定义的404
                res.render("error", { message: err, error: { status: "404" } });
                return;
            }
            if (result.forbidden) {
                res.status(403);
                res.render("error", { message: "不可访问", error: { status: "403" } });
                return;
            }

            //res.writeHead(200, { "Content-Type": "application/octet-stream", "Content-Disposition": "attachment; filename = download" + pathmethod.extname(result.address) });
            //var content = fs.readFileSync(result.address);
            //res.end(content, "binary");
            res.download(result.address);
        });
});

/*上传多个文件*/
router.post('/upload', function (req, res) {
    //读取userid
    var userid = 1;

    //生成multiparty对象，并配置上传目标路径
    var form = new multiparty.Form({ autoFiles: true, uploadDir: fileconfig.gettemppath() });

    //上传完成后处理
    form.parse(req, function (err, fields, files) { //fields 上传的其他字段值
        //var filesTmp = JSON.stringify(files, null, 2); 特殊的json tostring

        async.waterfall([
            function (cb) {
                if (err) {
                    return cb(err, null);
                }
                async.map(files.file, function (fileinfo, callback) {
                    //添加到数据库
                    fileinfomodel.newinfo({ "code": guid.randomString(32), "address": fileconfig.getsqlpath(fileinfo.path), "mimetype": fileinfo.headers["content-type"], "createuserid": userid }, function (error, result) {
                        callback(null, result);
                    });
                }, function (err, results) {
                    cb(null, results);
                });
            },
            //function (param, cb) {
            //    //重命名为真实文件名
            //    fs.rename(uploadedPath, dstPath, function (err) {
            //        if (err) {
            //            console.log('rename error: ' + err);

            //        } else {
            //            console.log('rename ok');
            //        }
            //    });
            //},
        ],
            function (err, result) {
                //返回文件
                if (err) {
                    loghelper.debug(err);
                    res.status(503);// 返回自定义的404
                    res.render("error", { message: err, error: { status: "503" } });
                    return;
                }
                res.json(result);
            });
    });
});


/*删除文件*/
router.get('/del/:code', function (req, res) {
    //读取userid
    var userid = 1;

    fileinfomodel.deleteinfo({ "code": req.params.code, "userid": userid }, function (error, result) {
        if (error) {
            loghelper.debug(error);
            res.status(503);// 返回自定义的404
            res.render("error", { message: error, error: { status: "503" } });
            return;
        }
        res.json(result);
    });
});


module.exports = router;