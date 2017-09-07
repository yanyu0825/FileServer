import express = require('express');
var router: express.Router = express.Router();
import pathmethod = require('path');
import fs = require('fs');

import multiparty = require('multiparty');
import guid = require("../Helper/CrytoHelper");
import { Config } from "../Config/Config";
import { LogHelper } from '../Helper/LogHelper';
import { FileModel } from "../model/FileModel";
import { FileInfoModel } from "../model/FileInfoModel";
import { PMSHelper } from "../Helper/PMSHelper";

import { FileInfoEntity, QueryFileInfoParamEntity, QueryResultEntity } from "../Entity/FileInfoEntity";

var loghelper = new LogHelper();
var pmshelper = new PMSHelper();
var filemodel = new FileModel(loghelper);
var fileinfomodel = new FileInfoModel(loghelper);

/* 文件管理器*/


/* 列出所有文件夹 最新的由自己创建的10文件. */
router.get('/query/:size/:page', pmshelper.Use(3), (req, res) => {

    let entity = new QueryFileInfoParamEntity();
    entity.size = req.params.size || 10;
    entity.page = req.params.page || 1;
    entity.userid = req.body.userid;
    //获取最近自己上传的10个文件
    fileinfomodel.Query(entity).then(result => {
        //result = { total: 10, page: 1, data: [{ code: "", address: "", userid: 1, createtime: "", forbidden: false, ext: "" }] }
        //返回文件
        //res.json(result);
        res.render('files', { title: 'File', data: result });
    }).catch(err => {
        loghelper.error(err);
        res.status(err.status || 500).render("error", { message: err.message, error: err });
    });

});

/*获取文件网页打开*/
router.get('/get/:code', pmshelper.Use(4),function (req, res, next) {
    console.log(req.route);
    fileinfomodel.Validate(req.params.code).then(result => {
        if (!result)
            throw new Error("参数不正确");
        return fileinfomodel.GetInfo(req.params.code);
    }).then(result => {
        if (!result)
            throw new Error("文件code 不存在");

        return filemodel.GetFilePath(result).then(realaddress => {
            //result.address = realaddress;
            return realaddress;
        });
    }).then(result => {
        //res.writeHead(200, { "Content-Type": result.mimetype + ";charset=utf-8" });
        //var content = fs.readFileSync(result.address);
        //res.end(content, "binary");
        res.sendFile(result, { root: "./" }, err => {
            loghelper.error(err);
            res.sendStatus(404);
        });
    }).catch(err => {
        loghelper.error(err);
        //next(); // 返回自带的404
        res.status(err.status || 500).render("error", { message: err.message, error: err });
    })
});

/*下载文件*/
router.get('/download/:code', pmshelper.Use(4), function (req, res) {

    fileinfomodel.Validate(req.params.code).then(result => {
        if (!result)
            throw new Error("参数不正确");
        return fileinfomodel.GetInfo(req.params.code);
    }).then(result => {
        if (!result)
            throw new Error("文件code 不存在");

        return filemodel.GetFilePath(result).then(realaddress => {
            // result.address = a;
            return realaddress;
        });
    }).then(result => {
        //res.writeHead(200, { "Content-Type": "application/octet-stream", "Content-Disposition": "attachment; filename = download" + pathmethod.extname(result.address) });
        //var content = fs.readFileSync(result.address);
        //res.end(content, "binary");
        res.download(result, err => {
            loghelper.error(err);
            res.sendStatus(404);
        });
    }).catch(err => {
        loghelper.error(err);
        //next(); // 返回自带的404
        res.status(err.status || 500).render("error", { message: err.message, error: err });
    })
});

/*上传多个文件*/
router.post('/upload', pmshelper.Use(5),function (req, res) {

    //生成multiparty对象，并配置上传目标路径
    var form = new multiparty.Form({ autoFiles: true, uploadDir: Config.GetTempPath() });

    //上传完成后处理
    form.parse(req, (err, fields, files) => { //fields 上传的其他字段值
        //var filesTmp = JSON.stringify(files, null, 2); 特殊的json tostring
        new Promise<boolean>(function (resolve, reject) {
            if (err)
                return reject(err);
            else
                return resolve(true);
        }).then(a => {
            let tasks: Promise<boolean>[] = files.file.map(fileinfo => {
                let entity: FileInfoEntity = new FileInfoEntity();
                entity.code = guid.CrytoHelper.randomString(32);
                entity.address = Config.GetSqlPath(fileinfo.path);
                entity.mimetype = fileinfo.headers["content-type"];
                entity.userid = req.body.userid;
                return new FileInfoModel(loghelper).NewInfo(entity);
            })
            return Promise.all(tasks);
        }).then(result => {
            return result.every(item => item);
        }).then(result => {
            res.json(result);
        }).catch(err => {
            loghelper.error(err);
            res.status(err.status || 500).render("error", { message: err.message, error: err });
        });
    });
});

/*删除文件*/
router.get('/del/:code', pmshelper.Use(6), function (req, res) {
    //读取userid
    fileinfomodel.DeleteInfo(req.params.code, req.body.userid).then(result => {
        res.json(result);
    }).catch(err => {
        loghelper.debug(err);
        res.status(err.status || 500).render("error", { message: err.message, error: err });
    });
});

export = router;