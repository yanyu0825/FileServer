import _PATH = require('path');
import { LogHelper } from "./Helper/LogHelper";
import { FileInfoMS } from "./Data/FileInfoMS";
//import { StrRedis } from "./Data/StrRedis";
import { Config } from "./Config/Config";


//import { IGulpCacheStatic } from "gulp-cache"
var imagemin = require('gulp-imagemin'),
    gulp = require('gulp'),
    pngquant = require('imagemin-pngquant'),
    cache = require('gulp-cache'),
    loghelper = new LogHelper(),
    fileinfoms = new FileInfoMS(Config.filesredis);
//var strredis = new StrRedis(Config.filesredis);

const sourcefile: string = '../FileServer/uploads/**/*', distfile = '../FileServer/realfiles/';

gulp.watch(sourcefile, function (event) {
    //读取数据库中的地址
    var code = _PATH.basename(event.path);
    var filepath = fileinfoms.GetPath(code).then(data => {
        if (data) {
            var path = _PATH.normalize(distfile + data);
            gulp.src(event.path)
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
                .pipe(gulp.dest(path))
                .on('end', () => {
                    //发生的变动的类型：added, changed 或者 deleted。
                    if (event.type == "added") {
                        var code = _PATH.basename(event.path);
                        //修改数据库文件状态
                        fileinfoms.EnabledFile(code).then(result => {
                            if (!result)
                                loghelper.debug("文件名" + event.type + ":" + code + ":修改文件状态失败");
                            else
                                loghelper.debug('文件' + event.path + '被执行' + event.type);
                        }).catch(err => {
                            loghelper.error(err, "文件名" + event.type + ":" + code + ":修改文件状态失败:");
                        })
                    }
                    //if (event.type == "changed") {
                    //    //修改数据库文件状态
                    //}
                }).on('error', (err) => {
                    loghelper.error(err, "文件" + event.path);
                });
        } else {
            throw new Error("获取文件对应在数据库中的表述为空");
        }

    }).catch(err => {
        loghelper.error(err);
    });
});

loghelper.debug("服务启动成功");







