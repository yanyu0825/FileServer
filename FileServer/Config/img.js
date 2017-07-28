var path = require('path');
var multer = require('multer');

var filename = "./uploads/";
var contentType = {
    'jpg': 'image/jpeg',
    'jpeg': 'image/jpeg',
    'gif': 'image/gif',
    'png': 'image/png'
};
var fileFilter = function (req, file, cb) {
    var keys = [], arr = contentType,j=0;
    for (var i in arr) {
        if (file.mimetype != arr[i])
            keys.push(i);
        j++;
    }
    if (keys.length == j) {
        cb(new Error("只能上传" + keys.toString() + "图片!"));
    }
    else
        cb(null, true);
};
var storage = multer.diskStorage({
    destination: filename,
    filename: function (req, file, cb) {
        cb(null, Date.now().toString())
    }
});

var config = 
 {
    filename : filename,
    targetDir: function (app) {
        return path.join(app.get('rootDir'), 'img');
    },
    defaultpath: path.join(filename, "default.jpg"),
    contentType: contentType,
    upload: multer({
        storage : storage,
        fileFilter : fileFilter
    })
};




module.exports = config;