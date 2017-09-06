import { ClientOpts, RedisClient, createClient } from "redis";

export class RedisCommand implements IConnection<RedisClient>{

    //private client: RedisClient = null;


    constructor(private config: ClientOpts) {
        if (config === undefined)
            throw new Error("配置不能为null");
        if (!config)
            throw new Error("配置不能为null");

        //this.client = redis.createClient(config);
        //let dd = new RedisClient(config);
    }

    //执行主入口 这个是关闭连接
    public execute(cb: (client: RedisClient) => Promise<void>): Promise<void> {
        let client: RedisClient = null;
        return this._createConnection().then(result => {
            client = result;
            return client;
        }).then(cb).then(() => {
            return this._quitconnection(client);
        }).catch((error) => {
            return this._quitconnection(client).then(a => {
                throw error;
            })
        });
    };


    //private showError(error: Error | void) {
    //    // 读取配置显示日志 外层记录日志
    //    console.log(error);
    //};


    private _createConnection(): Promise<RedisClient> {
        return new Promise((resolve, reject) => {

            //每次新开连接
            let client = createClient(this.config)
                .on("error", (error) => {
                    this._quitconnection(client).then(() => reject(error));
                }).on("connect", a => {
                    resolve(client);
                });
        });
    };

    private _quitconnection(client: RedisClient): Promise<void> {
        return new Promise<void>((resolve, reject) => {
            if (client)//链接存在 同时链接已经连接完毕
            {
                //如果redis服务没开 quit也不会成功所以这个时候要用end
                if (client.connected)
                    client.quit((err, t) => {
                        if (err)
                            console.log(err);
                        resolve();
                    })
                else {
                    client.end(false);
                    resolve();
                }
            } else
                resolve();
        });
    };


}

//export class ClientDataEntity<T> {
//    constructor(public client: RedisClient, public data: T) {

//    }
//}