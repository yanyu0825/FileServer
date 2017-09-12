
import pathmethod = require('path');
import fs = require('fs');

export class Config {

    public static rediscache = { host: "ydg1988825.gicp.net", port: 6379, db: "0", connect_timeout: 5000 };
    public static userrediscache = { host: "ydg1988825.gicp.net", port: 6379, db: "5", connect_timeout: 5000 };
    public static loginurl = "http://account.yanyu0825.cn/#/access/signin";
    public static account = { maxage: 3600, maxcount: 3 };
    public static ip = { maxage: 1800, maxcount: 10 };
    public static client = { maxage: 1200, maxcount: 3, regmaxcount: 3, name: "cid" };
    public static token = { "maxage": 1200, name: "token" };
    //public static domain = "localhost";

    public static openpms: boolean = true; //是否启用权限验证
    public static opendebug: boolean = true; //是否启用debug
    public static accountdb = { server: "ydg1988825.gicp.net", user: "sa", password: "Yanyu0825", database: "Account_New", pool: { max: 10, min: 0, idleTimeoutMillis: 30000 } };

    

    public static filesdb = {
        server: 'ydg1988825.gicp.net',
        database: 'File',
        user: "sa",
        password: "Yanyu0825",
        pool: {
            max: 10,
            min: 0,
            idleTimeoutMillis: 30000
        }
    };

    public static fileredis = {
        port: 6379
        , host: 'ydg1988825.gicp.net'
        , database: 4
        //,options: {
        //    autoretry: false
        //}
    };

    //public static logredis = {
    //    port: 6379
    //    , host: 'ydg1988825.gicp.net'
    //    , database: 0
    //    //,options: {
    //    //    autoretry: false
    //    //}
    //}

    private static fileconfig = {
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

    //读取上传文件的地址
    public static GetTempPath(): string {
        var now = new Date();
        //var path = pathmethod.join(config.tempdir, now.getFullYear().toString() , (now.getMonth() + 1).toString(), now.getDate().toString());
        //var path = pathmethod.join(config.tempdir, now.getFullYear().toString() + (now.getMonth() + 1).toString());
        let path: string = this.fileconfig.tempdir;

        this.CreateDirextory(path);
        return path;
    }

    public static GetOriginPath(sqlpath: string): string {
        return pathmethod.join(this.fileconfig.tempdir, pathmethod.basename(sqlpath));
    }

    //读取默认文件地址
    public static GetDefaultPath(mimetype): string {
        var path = null;
        for (var i in this.fileconfig.files) {
            var file = this.fileconfig.files[i];
            for (var j in file.allowtypes) {
                if (mimetype == file.allowtypes[j]) {
                    path = file.defaultpath;
                    break;
                }
            }
        }
        return pathmethod.normalize(pathmethod.join(this.fileconfig.realdir, path));
    }
    //构造存储数据库中的path
    public static GetSqlPath(filename: string): string {
        var now = new Date();
        return pathmethod.join(now.getFullYear().toString() + (now.getMonth() + 1).toString(), pathmethod.basename(filename));
    }


    //获取真实文件的地址
    public static GetRealPath(sqlpath: string): string {
        return pathmethod.normalize(pathmethod.join(this.fileconfig.realdir, sqlpath));
    }
    

    private static CreateDirextory(path: string): void {
        path = pathmethod.normalize(path);
        if (!fs.existsSync(path)) {
            var pathtmp;
            path.split(pathmethod.sep).forEach((dirname) => {
                if (pathtmp) {
                    pathtmp = pathmethod.join(pathtmp, dirname);
                }
                else {
                    pathtmp = dirname;
                }
                if (!fs.existsSync(pathtmp)) {
                    fs.mkdirSync(pathtmp)
                }
            });
        }
    }

}
