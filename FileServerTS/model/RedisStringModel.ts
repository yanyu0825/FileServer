import { IncRedis, StrRedis, IncEntity } from "../data/CommonRedis";
import { Config } from '../Config/Config';
import { Base } from "./Base";

const inccmd = new IncRedis(Config.rediscache);
const strcmd = new StrRedis(Config.rediscache);
export class RedisStringModel extends Base {

    public Inc(param: IncEntity): Promise<boolean> {
        return super.BaseValidate(param.key).then(result => {
            //存入redis 时间一个小时 值为1
            return inccmd.Inc(param);
        }, error => {
            return false;
        });
    }

    public Get(key: string): Promise<number> {
        return super.BaseValidate(key).then(result => {
            return inccmd.GetCount(key);
        }, error => {
            return false;
        });
    }

    public Del(key: string): Promise<boolean> {
        return super.BaseValidate(key).then(result => {
            return inccmd.Del(key);
        }, error => {
            return false;
        });
    }


    public Validate(key: string): Promise<boolean> {
        return super.BaseValidate(key).then(result => {
            if (result)
                return result;
            else
                throw new Error("validate");
        });
    }

    public Set(key: string, value: string, maxage?: number): Promise<boolean> {
        return super.BaseValidate(key).then(a => {
            return super.BaseValidate(value);
        }, error => {
            return false;
        }).then(result => {
            return strcmd.Set(key, value).then(result => {
                if (result && maxage && maxage > 0) {
                    return strcmd.Expire(key, maxage);
                } else {
                    return result;
                }
            });
        }, error => {
            return false;
        });
    }

    public GetStr(key: string): Promise<string> {
        return strcmd.Get(key);
    }


    constructor(log: ILog) {
        super(log);
    }

}