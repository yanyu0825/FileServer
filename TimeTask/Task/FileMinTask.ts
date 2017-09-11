import { ITask, JobContent } from "./ITask";
import { FileInfoMS } from "../Data/FileInfoMS";
import { Config } from "../Config/Config";
import _PATH = require('path');
import { LogHelper } from "../Helper/LogHelper";
import * as gulp from "gulp";
import { fsync, exists } from "fs";

var imagemin = require('gulp-imagemin'),
    //gulp = require('gulp'),
    pngquant = require('imagemin-pngquant'),
    cache = require('gulp-cache');

export class FileMinTask implements ITask<string> {
    public Excute(content: JobContent<string>): Promise<boolean> {
        //防止循环引用所以在函数内实例化FileInfoMS
        //return Promise.resolve(true);
        //读取数据库文件数据变化 重新压缩文件
        return new FileInfoMS(Config.filesdb).GetChangeFilePath(content.lasttime).then(address => {
            return Promise.all(address.map(item => {
                return new Promise<boolean>((resolve, reject) => {
                    let originalpath = _PATH.normalize(_PATH.join(Config.fileconfig.sourcefile, _PATH.basename(item)));
                    var destpath = _PATH.normalize(_PATH.join(Config.fileconfig.distfile, item));
                    exists(originalpath, (exists) => {
                        if (exists) {
                            //压缩文件
                            gulp.src(originalpath)
                                .pipe(cache(imagemin({
                                    optimizationLevel: 5, //类型：Number  默认：3  取值范围：0-7（优化等级）
                                    progressive: false, //类型：Boolean 默认：false 无损压缩jpg图片
                                    interlaced: true, //类型：Boolean 默认：false 隔行扫描gif进行渲染
                                    multipass: true, //类型：Boolean 默认：false 多次优化svg直到完全优化
                                    accurate: false,//高精度模式
                                    quality: "low",//图像质量:low, medium, high and veryhigh;
                                    method: "mpe",//网格优化:mpe, ssim, ms-ssim and smallfry;
                                    min: 30,//最低质量
                                    loops: 3,//循环尝试次数, 默认为6;
                                    subsample: "default",//子采样:default, disable;
                                    svgoPlugins: [{ removeViewBox: false }],
                                    use: [pngquant()]
                                })))
                                .pipe(gulp.dest(file => {
                                    return _PATH.dirname(destpath);
                                }))
                                .on('end', () => {
                                    console.log(`${destpath}文件被写入成功`)
                                    resolve(true);
                                }).on('error', (err) => {
                                    //new LogHelper().error(err, `同步文件失败`);
                                    reject(err);
                                });
                        } else {
                            reject(new Error(`${originalpath}不存在`));
                        }
                    });
                });
            }));
        }).then(result => {
            return result.every(item => item);
        }).catch(err => {
            new LogHelper().error(err, `同步文件失败`);
            return false;
        })
    }
}

