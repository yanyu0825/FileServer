import { UserRedis } from "../data/CommonRedis";
import { Config } from '../Config/Config';
import { Base } from "./Base";

const Cmd = new UserRedis(Config.userrediscache);
export class UserModel extends Base {
    private reg: RegExp = new RegExp("^[0-9a-zA-Z]{30}$");

    public GetUserID(token: string): Promise<number> {
        return this.Validate(token).then(result => {
            if (!result)
                throw new Error("token 格式不正确，token:" + token);
            return Cmd.Get(token);
        }).then(info => {
            if (!info) {
                throw new Error("token 不存在，token:" + token);
            }
            console.log(info);
            let e = JSON.parse(info);
            return e.userid||0;
        });
    }




    public Validate(key: string): Promise<boolean> {
        return super.BaseValidate(key).then(result => {
            return this.reg.test(key);
        });
    }

    constructor(log: ILog) {
        super(log);
    }

}