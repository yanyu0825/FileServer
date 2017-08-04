import { Config } from '../Config/Config';
import { FileInfoEntity } from "../Entity/FileInfoEntity";
import { RedisStringModel } from "./RedisStringModel";
import { CrytoHelper } from "../Helper/CrytoHelper";
import { Base } from "../model/Base";
import path = require('path');

var crytohelper = new CrytoHelper();

export class FileModel extends Base{
    private clientidreg: RegExp = new RegExp("^[0-9a-zA-Z]{30}$");
    
    //查询改客户端已经连续登陆错误的次数----登录成功就清除此值
    public GetFilePath(fileinfo: FileInfoEntity): Promise<string> {
        if (fileinfo == null)
            return Promise.reject(new Error("fileinfo 不能为空"));
        let address: string = path.normalize(fileinfo.status ? Config.GetRealPath(fileinfo.address) : Config.GetDefaultPath(fileinfo.mimetype)); //加载文件主目录
        return Promise.resolve(address);
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