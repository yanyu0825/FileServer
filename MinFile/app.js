var gulp = require('gulp'),
    imagemin = require('gulp-imagemin'),
    pngquant = require('imagemin-pngquant'),
    cache = require('gulp-cache'),
    loghelper = require("./Helper/Log4jsHelper"),
    fileinfoms = require("./Data/fileinfoms"),
    _PATH = require('path');

var sourcefile = '../FileServer/uploads/**/*', distfile = '../FileServer/realfiles/';

//gulp.task('filemin', function () {
//    gulp.src(sourcefile)
//        .pipe(cache(imagemin({
//            optimizationLevel: 5, //类型：Number  默认：3  取值范围：0-7（优化等级）
//            progressive: false, //类型：Boolean 默认：false 无损压缩jpg图片
//            interlaced: true, //类型：Boolean 默认：false 隔行扫描gif进行渲染
//            multipass: true, //类型：Boolean 默认：false 多次优化svg直到完全优化

//            accurate: false,//高精度模式
//            quality: "low",//图像质量:low, medium, high and veryhigh;
//            method: "mpe",//网格优化:mpe, ssim, ms-ssim and smallfry;
//            min: 30,//最低质量
//            loops: 3,//循环尝试次数, 默认为6;
//            subsample: "default",//子采样:default, disable;

//            svgoPlugins: [{removeViewBox: false}],
//            use: [pngquant()]
//        })))
//        .pipe(gulp.dest(distfile)).pipe()
//        .on('error', function (err) {
//            loghelper.debug(err);
//        })
//        .on('end', function () {
//            //修改数据库文件状态
//            loghelper.debug(err);
//        });
//});

////gulp.start('filemin'); //启动时 检查文件修改
////gulp.watch(sourcefile, ['filemin']); //监听文件变化 执行任务testImagemin


gulp.watch(sourcefile, function (event) {
    loghelper.info('文件' + event.path + '被执行' + event.type);
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
        .pipe(gulp.dest(distfile))
        .on('end', function () {
            //发生的变动的类型：added, changed 或者 deleted。
            if (event.type == "added") {
                var code = _PATH.basename(event.path);
                //修改数据库文件状态
                fileinfoms.newinfo(code, function (err, result) {
                    if (err)
                        loghelper.debug("文件名" + event.type + ":" + code + ":修改文件状态失败:" + JSON.stringify(err));
                    if (!result)
                        loghelper.debug("文件名" + event.type + ":" + code + ":修改文件状态失败");
                })
            }
            //if (event.type == "changed") {
            //    //修改数据库文件状态
            //}
        }).on('error', function (err) {
            loghelper.debug("文件" + event.path +":"+ JSON.stringify(err));
        });
});

loghelper.debug("服务启动成功");