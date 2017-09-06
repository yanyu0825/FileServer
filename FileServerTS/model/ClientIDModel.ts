import { Config } from '../Config/Config';
import { HashRedis, IncRedis, IncEntity } from "../data/CommonRedis";
import { RedisStringModel } from "./RedisStringModel";
import { CrytoHelper } from "../Helper/CrytoHelper";

export class ClientIDModel extends RedisStringModel {
    private clientidreg: RegExp = new RegExp("^[0-9a-zA-Z]{30}$");

    //如果不存在clientid 生成一个新的id，但是这个只是用户visiter 项目中
    public New(param: string): Promise<string> {
        //解析clientid
        let clientid: string = param;
        //如果使用key-value加密的方式
        //if (param.key) {
        //    clientid = param.key;
        //}

        return this.Validate(clientid).then(result => {
            return clientid;
        }, error => {
            //生成新的id
            let newid = CrytoHelper.randomString(30);
            this.log.debug("没有clientid 自动生成一个:" + newid);
            return newid;
        });
    }


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

    //查询此clientid访问此接口的次数
    public GetClientUseCount(param: string, code: string): Promise<number> {
        //解析clientid
        let clientid: string = param;
        //如果使用key-value加密的方式
        //if (param.key) {
        //    clientid = param.key;
        //}

        return this.Validate(clientid).then(a => {
            return super.BaseValidate(code);
        }).then(result => {
            if (!result)
                throw new Error("参数不能为空");
            //读取本客户端已经使用的次数
            return new HashRedis(Config.rediscache).HGetExpire(clientid, code);
        });
    }

    //此clientid使用这个接口
    public IncClientUseCount(param: string, code: string, time: number): Promise<boolean> {
        //解析clientid
        let clientid: string = param;
        //如果使用key-value加密的方式
        //if (param.key) {
        //    clientid = param.key;
        //}

        return this.Validate(clientid).then(a => {
            return super.BaseValidate(code);
        }).then(result => {
            if (!result)
                throw new Error("参数不能为空");
            //读取本客户端已经使用的次数
            return new HashRedis(Config.rediscache).HincrbyExpire(clientid,code, time, false);
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