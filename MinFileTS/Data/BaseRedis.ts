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

    public SetList(key: string, value: string, needprefix: boolean = true): Promise<boolean> {
        let result: boolean = false;
        return this._rediscommand.execute((client) => {
            return new Promise<void>((resolve, reject) => {
                let realkey = needprefix ? this._source + key : key;
                result = client.rpush(realkey, value, (err, setresult) => {
                    if (err)
                        reject(err);
                    else {
                        result = setresult > 0;
                        resolve();
                    }
                });
            });
        }).then(() => {
            return result;
        })

    }

    public Get(param: string, needprefix: boolean = true): Promise<string> {
        let result: string = null;
        return this._rediscommand.execute((client) => {

            return new Promise<void>((resolve, reject) => {
                let realkey = needprefix ? this._source + param : param;
                client.get(realkey, (err, data) => {
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

        }).then(() => {
            return result;
        })

    }

    public Exists(param: string, needprefix: boolean = true): Promise<boolean> {
        let result: boolean = false;
        return this._rediscommand.execute((client) => {

            return new Promise<void>((resolve, reject) => {
                let realkey = needprefix ? this._source + param : param;
                result = client.EXISTS(realkey, (err, data) => {
                    //直接返回不关闭连接
                    if (err) {
                        reject(err);
                    }
                    else {
                        result = data > 0;
                        resolve();
                    }
                });
            });

        }).then(() => {
            return result;
        })

    }

    public Set(param: string, value: string, needprefix: boolean = true): Promise<boolean> {
        let result: boolean = false;
        return this._rediscommand.execute((client) => {
            return new Promise<void>((resolve, reject) => {
                let realkey = needprefix ? this._source + param : param;
                result = client.set(realkey, value, (err, setresult) => {
                    if (err)
                        reject(err);
                    else {
                        result = setresult == "OK";
                        resolve();
                    }
                });
            });
        }).then(() => {
            return result;
        })

    }

    public Expire(param: string, maxage: number, needprefix: boolean = true): Promise<boolean> {
        let result: boolean = false;
        return this._rediscommand.execute((client) => {
            return new Promise<void>((resolve, reject) => {
                let realkey = needprefix ? this._source + param : param;
                result = client.expire(realkey, maxage, (err, setresult) => {
                    if (err)
                        reject(err);
                    else {
                        result = setresult == 1;
                        resolve();
                    }
                });
            });
        }).then(() => {
            return result;
        })

    }



    public Inc(param: IIncEntity, needprefix: boolean = true): Promise<boolean> {

        let result: boolean = false;
        return this._rediscommand.execute((client) => {

            return new Promise<void>((resolve, reject) => {
                let realkey = needprefix ? this._source + param.key : param.key;
                client.incr(realkey, (err, data) => {
                    //直接返回不关闭连接
                    if (err) {
                        reject(err);
                    }
                    else if (param.expire && param.expire > 0) {

                        if (param.coverexpire) {
                            //每次都重新设置过期时间
                            client.expire(realkey, param.expire, (err, value) => {
                                //直接返回不关闭连接
                                if (err) { reject(err); }
                                else if (value == 0) { reject(new Error("设置过期时间失败：" + realkey)); }
                                else { result = true; resolve(); }
                            });

                        } else {
                            //判断是否存在过期时间
                            client.ttl(realkey, (err, ttl) => {
                                if (err) { reject(err); }
                                else if (ttl > 0) { result = true; resolve(); }
                                else {
                                    //不存在 重新设置过期时间
                                    client.expire(realkey, param.expire, (err, value) => {
                                        //直接返回不关闭连接
                                        if (err) { reject(err); }
                                        else if (value == 0) { reject(new Error("设置过期时间失败：" + realkey)); }
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

    public Del(key: string, needprefix: boolean = true): Promise<boolean> {
        let result: boolean = false;
        return this._rediscommand.execute((client) => {
            return new Promise<void>((resolve, reject) => {
                let realkey = needprefix ? this._source + key : key;
                result = client.del(realkey, (err, num) => {
                    if (err)
                        reject(err);
                    else {
                        resolve();
                    }
                });
            });
        }).then(() => {
            return result;
        })

    }

    public GetCount(param: string, needprefix: boolean = true): Promise<number> {

        let result: number = 0;
        return this._rediscommand.execute(client => {
            return new Promise<void>((resolve, reject) => {
                let realkey = needprefix ? this._source + param : param;
                client.get(realkey, (err, data) => {
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



    public HMGet(key: string, filed: string, needprefix: boolean = true): Promise<any> {
        let back: any = null;
        return this._rediscommand.execute(client => {
            return new Promise<void>((resolve, reject) => {
                let realkey = needprefix ? this._source + key : key;
                client.hmget(realkey, filed, (err, data) => {
                    if (err)
                        reject(err);
                    else {
                        back = data && data.length > 0 ? JSON.parse(data[0]) : null;
                        resolve();
                    }
                });
            });
        }).then(() => {
            return back;
        })
    }

    public HMSet(key: string, filed: string, value: string, needprefix: boolean = true): Promise<boolean> {
        let back: boolean = false;
        return this._rediscommand.execute(client => {
            return new Promise<void>((resolve, reject) => {
                let realkey = needprefix ? this._source + key : key;
                client.hmset(realkey, filed, value, (err, data) => {
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

    public HDel(key: string, filed: string, needprefix: boolean = true): Promise<boolean> {
        let back: boolean = true;
        return this._rediscommand.execute(client => {
            return new Promise<void>((resolve, reject) => {
                let realkey = needprefix ? this._source + key : key;
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


    public HGet(key: string, filed: string, needprefix: boolean = true): Promise<string> {
        let result: string = null;
        return this._rediscommand.execute(client => {
            return new Promise<void>((resolve, reject) => {
                let realkey = needprefix ? this._source + key : key;
                client.hget(realkey, filed, (err, data) => {
                    if (err) {
                        reject(err);
                    }
                    else {
                        result = data;
                        resolve();
                    }
                });
            });
        }).then(() => {
            return result;
        })
    }

    public HSet(key: string, filed: string, content: string, needprefix: boolean = true): Promise<boolean> {
        let result: boolean = false;
        return this._rediscommand.execute((client) => {
            return new Promise<void>((resolve, reject) => {
                let realkey = needprefix ? this._source + key : key;
                client.hset(realkey, filed, content, (err, data) => {
                    if (err) {
                        reject(err);
                    }
                    else {
                        result = data > 0;
                        resolve();
                    }
                });
            });
        }).then(() => {
            return result;
        })
    }

    public Hincrby(key: string, filed: string, needprefix: boolean = true): Promise<boolean> {
        let result: boolean = false;
        return this._rediscommand.execute((client) => {

            return new Promise<void>((resolve, reject) => {
                let realkey = needprefix ? this._source + key : key;
                client.hincrby(realkey, filed, 1, function (err, data) {
                    //直接返回不关闭连接
                    if (err) {
                        reject(err);
                    }
                    else {
                        result = data > 0;
                        resolve();
                    }
                });
            });

        }).then(() => {
            return result;
        })
    }

    public Hvals<T>(key: string, needprefix: boolean = true): Promise<T[]> {

        let result: T[] = new Array<T>();
        return this._rediscommand.execute(client => {
            return new Promise<void>((resolve, reject) => {
                let realkey = needprefix ? this._source + key : key;
                client.hvals(realkey, (err, data) => {
                    //直接返回不关闭连接
                    if (err) {
                        reject(err);
                    }
                    else {
                        data.forEach(item => {
                            result.push(JSON.parse(item));
                        })
                        resolve();
                    }
                });
            })
        }).then(() => {
            return result;
        })
    }



    public HincrbyExpire(key: string, filed: string, expire: number, coverexpire: boolean = false, needprefix: boolean = true): Promise<boolean> {
        return this.Inc({ key: `${key}:${filed}`, expire: expire, coverexpire: coverexpire }, needprefix).then(a => {
            if (!a)
                throw new Error("设置过期时间失败");
            return this.Hincrby(key, filed, needprefix).catch(err => {
                if (err)
                    console.log(err);
                return this.Del(`${key}:${filed}`, needprefix).then(a => false);
            });
        });
    }

    public HGetExpire(key: string, filed: string, needprefix: boolean = true): Promise<number> {
        return this.Exists(`${key}:${filed}`, needprefix).then(result => {
            if (!result)
                return this.HDel(key, filed, needprefix).then(a => {
                    return 0;
                });
            else {
                return this.HGet(key, filed, needprefix).then(a => parseInt(a));
            }
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
