import { RedisCommand } from "./Interface/RedisCommand";
//redis基础方法
export class BaseRedis {

    protected _source: string = "baseredis:";
    protected _rediscommand: RedisCommand = null;

    constructor(config, source?: string) {
        this._rediscommand = new RedisCommand(config);
        if (source && source.length > 0)
            this._source = source;
    }

    public SetList(key: string, value: string): Promise<boolean> {
        let result: boolean = false;
        return this._rediscommand.execute((client)=> {
            return new Promise<void>((resolve, reject) => {
                let realkey = this._source + key;
                result = client.rpush(realkey, value, (err, setresult) => {
                    if (err)
                        reject(err);
                    else {
                        result = setresult > 0;
                        resolve();
                    }
                });
            });
        }).then(()=> {
            return result;
        })

    }

    public Get(param: string): Promise<string> {
        let result: string = null;
        return this._rediscommand.execute((client)=> {

            return new Promise<void>((resolve, reject) => {
                let key = this._source + param;
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

        }).then(()=> {
            return result;
        })

    }

    public Set(param: string, value: string): Promise<boolean> {
        let result: boolean = false;
        return this._rediscommand.execute((client) => {
            return new Promise<void>((resolve, reject) => {
                let key = this._source + param;
                result = client.set(key, value, (err, setresult) => {
                    if (err)
                        reject(err);
                    else {
                        result = setresult == "OK";
                        resolve();
                    }
                });
            });
        }).then(()=> {
            return result;
        })

    }

    public Expire(param: string, maxage: number): Promise<boolean> {
        let result: boolean = false;
        return this._rediscommand.execute((client) => {
            return new Promise<void>((resolve, reject) => {
                let key = this._source + param;
                result=client.expire(key, maxage, (err, setresult) => {
                    if (err)
                        reject(err);
                    else {
                        //result = setresult == 1;
                        resolve();
                    }
                });
            });
        }).then(()=> {
            return result;
        })

    }



    public Inc(param: IncEntity): Promise<boolean> {

        let result: boolean = false;
        return this._rediscommand.execute((client) => {

            return new Promise<void>((resolve, reject) => {
                let key = this._source + param.key;
                client.incr(key, (err, data) => {
                    //直接返回不关闭连接
                    if (err) {
                        reject(err);
                    }
                    else if (param.expire && param.expire > 0) {

                        if (param.coverexpire) {
                            //每次都重新设置过期时间
                            client.expire(key, param.expire, (err, value) => {
                                //直接返回不关闭连接
                                if (err) { reject(err); }
                                else if (value == 0) { reject(new Error("设置过期时间失败：" + key)); }
                                else { result = true; resolve(); }
                            });

                        } else {
                            //判断是否存在过期时间
                            client.ttl(key, (err, ttl) => {
                                if (err) { reject(err); }
                                else if (ttl > 0) { result = true; resolve(); }
                                else {
                                    //不存在 重新设置过期时间
                                    client.expire(key, param.expire, (err, value) => {
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

        }).then(() => {
            return result;
        })

    }

    public Del(key: string): Promise<boolean> {
        let result: boolean = false;
        return this._rediscommand.execute((client) => {
            return new Promise<void>((resolve, reject) => {
                let realkey = this._source + key;
                result = client.del(realkey, (err, num) => {
                    if (err)
                        reject(err);
                    else
                    {
                        resolve();
                    }
                });
            });
        }).then(() => {
            return result;
        })

    }

    public GetCount(param: string): Promise<number> {

        let result: number = 0;
        return this._rediscommand.execute(client => {
            return new Promise<void>((resolve, reject) => {
                let key = this._source + param;
                client.get(key, (err, data)=> {
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
        }).then(() => {
            return result;
        })
    }



    public HMGet(key: string, filed: string): Promise<any> {
        let back: any = null;
        return this._rediscommand.execute(client => {
            return new Promise<void>((resolve, reject) => {
                let realkey = this._source + key;
                client.hmget(realkey, filed, (err, data) => {
                    if (err)
                        reject(err);
                    else {
                        back = data && data.length > 0 ? JSON.parse(data[0]) : null;
                        resolve();
                    }
                });
            });
        }).then(()=> {
            return back;
        })
    }

    public HMSet(key: string, filed: string, value: string): Promise<boolean> {
        let back: boolean = false;
        return this._rediscommand.execute(client => {
            return new Promise<void>((resolve, reject) => {
                let realkey = this._source + key;
                client.hmset(realkey, filed, value, (err, data)=> {
                    if (err)
                        reject(err);
                    else {
                        back = data;
                        resolve();
                    }
                });
            });
        }).then(() => {
            return back;
        })
    }

    public HDel(key: string, filed: string): Promise<boolean> {
        let back: boolean = true;
        return this._rediscommand.execute(client => {
            return new Promise<void>((resolve, reject) => {
                let realkey = this._source + key;
                client.hdel(realkey, filed, (err, data) => {
                    if (err)
                        reject(err);
                    else {
                        //back = data > 0;
                        resolve();
                    }
                });
            });
        }).then(() => {
            return back;
        })
    }

}

export class IncEntity implements IIncEntity {
    constructor(public key: string, public expire: number = 1200, public coverexpire: boolean = false) { }
}

export interface IIncEntity {
    key: string;
    expire: number;
    coverexpire: boolean;
}
