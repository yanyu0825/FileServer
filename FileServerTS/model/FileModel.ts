import { Config } from '../Config/Config';
import { FileInfoEntity } from "../Entity/FileInfoEntity";
import { RedisStringModel } from "./RedisStringModel";
import { CrytoHelper } from "../Helper/CrytoHelper";
import { fsync, exists, unlink } from "fs";
import { Base } from "../model/Base";
import path = require('path');

var crytohelper = new CrytoHelper();

export class FileModel extends Base {
    private clientidreg: RegExp = new RegExp("^[0-9a-zA-Z]{30}$");

    //查询改客户端已经连续登陆错误的次数----登录成功就清除此值
    public GetFilePath(fileinfo: FileInfoEntity): Promise<string> {
        if (fileinfo == null)
            return Promise.reject(new Error("fileinfo 不能为空"));
        let address: string = path.normalize(fileinfo.status ? Config.GetRealPath(fileinfo.address) : Config.GetDefaultPath(fileinfo.mimetype)); //加载文件主目录
        return Promise.resolve(address);
    }
    //审核查看的文件
    public GetFilePath2(fileinfo: FileInfoEntity): Promise<string> {
        if (fileinfo == null)
            return Promise.reject(new Error("fileinfo 不能为空"));

        //如果源文件存在则读源文件否则读生成的文件
        return new Promise<string>((resolve, reject) => {
            let address: string = Config.GetOriginPath(fileinfo.address); //加载文件主目录
            exists(address, originexits => {
                if (originexits)
                    resolve(address)
                else {
                    let realaddress: string = Config.GetRealPath(fileinfo.address); //加载文件主目录
                    exists(realaddress, realexits => {
                        if (realexits)
                            resolve(realaddress)
                        else {
                            reject(new Error("文件不存在" + fileinfo.code));
                        }
                    })
                }

            })
        })
    }


    public Validate(clientid: string): Promise<boolean> {
        return super.BaseValidate(clientid).then(result => {
            if (this.clientidreg.test(clientid)) {
                return Promise.resolve(true);
            } else {
                return Promise.reject(new Error("clientinvalid"));
            }
        }, error => {
            return Promise.reject(new Error("clientinvalid"));
        })

    }


    constructor(log: ILog) {
        super(log);
    }

}