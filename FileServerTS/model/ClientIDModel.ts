import { Config } from '../Config/Config';
import { IncRedis, IncEntity } from "../data/IncRedis";
import { RedisStringModel } from "./RedisStringModel";
import { CrytoHelper } from "../Helper/CrytoHelper";

var crytohelper = new CrytoHelper();

export class ClientIDModel extends RedisStringModel {
    private clientidreg: RegExp = new RegExp("^[0-9a-zA-Z]{30}$");
    
    //查询改客户端已经连续登陆错误的次数----登录成功就清除此值
    public GetErrorLoginCount(param: string): Promise<number> {
        //解析clientid
        let clientid: string = param;
        //如果使用key-value加密的方式
        //if (param.key) {
        //    clientid = param.key;
        //}

        return this.Validate(clientid).then(result => {
            //读取已经错误登录的次数
            return new IncRedis(Config.rediscache).GetCount(clientid);
        });
    }


    public Validate(clientid: string): Promise<boolean> {
        return super.Validate(clientid).then(result => {
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