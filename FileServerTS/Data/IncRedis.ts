import { RedisCommand } from "./Interface/RedisCommand";

const source: string = "inc:";


//clientid 缓存
export class IncRedis {

    protected rediscommand: RedisCommand = null;

    constructor(config) {
        this.rediscommand = new RedisCommand(config);
    }
    
    public Inc(param: IncEntity): Promise<boolean> {

        let result: boolean = false;
        return this.rediscommand.execute((client)=> {

            return new Promise<void>((resolve, reject) => {
                let key = source + param.key;
                client.incr(key, (err, data)=> {
                    //直接返回不关闭连接
                    if (err) {
                        reject(err);
                    }
                    else if (param.expire && param.expire > 0) {

                        if (param.coverexpire) {
                            //每次都重新设置过期时间
                            client.expire(key, param.expire, (err, value)=> {
                                //直接返回不关闭连接
                                if (err) { reject(err); }
                                else if (value == 0) { reject(new Error("设置过期时间失败：" + key)); }
                                else { result = true; resolve(); }
                            });

                        } else {
                            //判断是否存在过期时间
                            client.ttl(key, (err, ttl)=> {
                                if (err) { reject(err); }
                                else if (ttl > 0) { result = true; resolve(); }
                                else {
                                    //不存在 重新设置过期时间
                                    client.expire(key, param.expire, (err, value)=> {
                                        //直接返回不关闭连接
                                        if (err) { reject(err); }
                                        else if (value == 0) { reject(new Error("设置过期时间失败：" + key)); }
                                        else { result = true; resolve(); }
                                    });
                                }
                            });
                        }

                    } else {
                        result = true;
                        resolve();
                    }
                });

            });

        }).then(()=> {
            return result;
        })

    }

    public Del(param: string): Promise<boolean> {
        let result: boolean = false;
        return this.rediscommand.execute((client)=> {
            return new Promise<void>((resolve, reject) => {
                let key = source + param;
                result = client.del(key);
                resolve();
            });
        }).then(()=> {
            return result;
        })

    }
    
    public GetCount(param: string): Promise<number> {

        let result: number = 0;
        return this.rediscommand.execute(client => {
            return new Promise<void>((resolve, reject) => {
                let key = source + param;
                client.get(key, function (err, data) {
                    //直接返回不关闭连接
                    if (err) {
                        reject(err);
                    }
                    else {
                        result = data ? parseInt(data) : 0;
                        resolve();
                    }
                });
            })
        }).then(()=> {
            return result;
        })
    }


}

export class IncEntity {

    constructor(public key: string, public expire: number = 1200, public coverexpire: boolean = false) { }

}