import { RedisCommand } from "./Interface/RedisCommand";
import { IncRedis } from "./IncRedis";
const source: string = "str:";


//clientid 缓存
export class StrRedis extends IncRedis {

    constructor(config) {
        super(config);
    }

    public SetList(key: string, value: string): Promise<boolean> {
        let result: boolean = false;
        return this.rediscommand.execute(function (client) {
            return new Promise<void>((resolve, reject) => {
                result = client.rpush(key, value, (err, setresult) => {
                    if (err)
                        reject(err);
                    else {
                        result = setresult > 0;
                        resolve();
                    }
                });
            });
        }).then(function () {
            return result;
        })

    }

    public Get(param: string): Promise<string> {
        let result: string = null;
        return this.rediscommand.execute(function (client) {

            return new Promise<void>((resolve, reject) => {
                let key = source + param;
                client.get(key, (err, data) => {
                    //直接返回不关闭连接
                    if (err) {
                        reject(err);
                    }
                    else {
                        result = data;
                        resolve();
                    }
                });
            });

        }).then(function () {
            return result;
        })

    }

    public Set(param: string, value: string): Promise<boolean> {
        let result: boolean = false;
        return this.rediscommand.execute(function (client) {
            return new Promise<void>((resolve, reject) => {
                let key = source + param;
                result = client.set(key, value, (err, setresult) => {
                    if (err)
                        reject(err);
                    else {
                        console.log(setresult);
                        result = setresult == "OK";
                        resolve();
                    }
                });
            });
        }).then(function () {
            return result;
        })

    }

    public Expire(param: string, maxage: number): Promise<boolean> {
        let result: boolean = false;
        return this.rediscommand.execute(function (client) {
            return new Promise<void>((resolve, reject) => {
                let key = source + param;
                client.expire(key, maxage, (err, setresult) => {
                    if (err)
                        reject(err);
                    else {
                        result = setresult == 1;
                        resolve();
                    }
                });
            });
        }).then(function () {
            return result;
        })

    }



}
