import { Config } from '../Config/Config';
import { Base } from "../model/Base";
import path = require('path');
import { FileInfoEntity, QueryFileInfoParamEntity, QueryResultEntity } from "../Entity/FileInfoEntity";
import { FileInfoMS } from "../Data/FileInfoMS";
import { FileInfoRedis } from "../Data/FileInfoRedis";



var fileinfoms = new FileInfoMS(Config.filesdb);
var fileinforedis = new FileInfoRedis(Config.fileredis);

export class FileInfoModel extends Base {
    private reg: RegExp = new RegExp("^[0-9a-zA-Z]{32}$");

    //创建文件信息
    public NewInfo(entity: FileInfoEntity): Promise<boolean> {
        if (!entity || !entity.code || !entity.address || !entity.mimetype || !entity.userid)
            return Promise.reject(new Error("文件信息参数有误"));
        //存入数据
        return new FileInfoMS(Config.filesdb).New(entity);
    }

    //{ userid: userid, size: 10, page: 1 }
    public Query(param: QueryFileInfoParamEntity): Promise<QueryResultEntity<FileInfoEntity>> {
        if (!param)
            return Promise.reject(new Error("参数不正确"));

        //从数据库取出数据
        return fileinfoms.queryinfo(param);
    }

    public GetInfo(code: string): Promise<FileInfoEntity> {
        //读取redis缓存数据
        return fileinforedis.GetInfo(code).then(result => {
            if (result != null) {//如果有误或者数据存在 直接返回
                return result;
            }

            //从数据库取出数据
            return fileinfoms.GetInfo(code).then(msinfo => {
                if (msinfo == null) {
                    throw new Error("无此文件")
                }
                result = msinfo;
                //数据缓存到redis
                return fileinforedis.SetInfo(msinfo);
            }).then(a => {
                if (!a)
                    this.log.debug("添加缓存信息失败");
                return result;
            }, err => {
                this.log.error(err, "添加缓存信息失败");
                return result;
            });
        });
    }

    public DeleteInfo(code: string, userid: number): Promise<boolean> {
        return fileinfoms.disabled(code, userid).then(result => {
            if (!result) {
                throw new Error("禁用文件失败")
            }
            //删除数据缓存
            return fileinforedis.Disabled(code);
        })

    }

    public Check(code: string, userid: number, status: boolean): Promise<boolean> {
        if (status)
            return fileinfoms.enabled(code, userid).then(result => {
                if (!result) {
                    throw new Error("启用文件失败")
                }
                //删除数据缓存
                return result;
            })
        else
            return fileinfoms.disabled(code, userid).then(result => {
                if (!result) {
                    throw new Error("禁用文件失败")
                }
                //删除数据缓存
                return fileinforedis.Disabled(code);
            })

    }













    public Validate(code: string): Promise<boolean> {
        return super.BaseValidate(code).then(result => {
            if (this.reg.test(code)) {
                return Promise.resolve(true);
            } else {
                return Promise.reject(new Error("code"));
            }
        }, error => {
            return Promise.reject(new Error("code"));
        })

    }


    constructor(log: ILog) {
        super(log);
    }

}