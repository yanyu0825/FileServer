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


/* 分页查询文件. */
router.post('/query/:size/:page', (req, res) => {

    let entity: QueryFileInfoParamEntity = req.body;
    entity.size = req.params.size || 10;
    entity.page = req.params.page || 1;
    entity.userid = req.body.userid;
    entity.status = true;
    //获取最近自己上传的10个文件
    fileinfomodel.Query(entity).then(result => {
        //result = { total: 10, page: 1, data: [{ code: "", address: "", userid: 1, createtime: "", forbidden: false, ext: "" }] }
        //返回文件
        //res.json(result);
        result.data.forEach(item => {
            item.address = null;
        });
        res.json(result);
        //res.render('files', { title: 'File', data: result });
    }).catch(err => {
        loghelper.error(err);
        res.status(err.status || 500).render("error", { message: err.message, error: err });
    });

});


/*获取文件网页打开*/
router.get('/get/:code', function (req, res, next) {
    fileinfomodel.Validate(req.params.code).then(result => {
        if (!result)
            throw new Error("参数不正确");
        return fileinfomodel.GetInfo(req.params.code);
    }).then(result => {
        if (!result)
            throw new Error("文件code 不存在");
        return filemodel.GetFilePath(result);
    }).then(result => {
        //res.writeHead(200, { "Content-Type": result.mimetype + ";charset=utf-8" });
        //var content = fs.readFileSync(result.address);
        //res.end(content, "binary");
        res.sendFile(result, { root: "./" }, err => {
            if (err) {
                loghelper.error(err);
                res.sendStatus(404);
            }
        });
    }).catch(err => {
        loghelper.error(err);
        //next(); // 返回自带的404
        res.status(err.status || 500).render("error", { message: err.message, error: err });
    })
});

/*下载文件*/
router.get('/download/:code', function (req, res) {

    fileinfomodel.Validate(req.params.code).then(result => {
        if (!result)
            throw new Error("参数不正确");
        return fileinfomodel.GetInfo(req.params.code);
    }).then(result => {
        if (!result)
            throw new Error("文件code 不存在");

        return filemodel.GetFilePath(result);
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




export = router;