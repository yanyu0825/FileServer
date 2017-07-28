var gulp = require('gulp'),
    imagemin = require('gulp-imagemin'),
    pngquant = require('imagemin-pngquant'),
    cache = require('gulp-cache'),
    loghelper = require("./Helper/Log4jsHelper");

var sourcefile = '../FileServer/uploads/**/*', distfile = '../FileServer/realfiles/';

gulp.task('filemin', function () {
    gulp.src(sourcefile)
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

            svgoPlugins: [{removeViewBox: false}],
            use: [pngquant()]
        })))
        .pipe(gulp.dest(distfile))
        .on('error', function (err) {
            loghelper.debug(err);
        });
});

gulp.start('filemin'); //启动时 检查文件修改
gulp.watch(sourcefile, ['filemin']); //监听文件变化 执行任务testImagemin

