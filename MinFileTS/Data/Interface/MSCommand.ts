import { ConnectionPool, config, Request, Transaction } from "mssql";
//import * as mssql from "mssql";

export class MSCommand implements IConnection<Request> {
    constructor(private config: config) {
        if (config === undefined)
            throw new Error("配置不能为null");
        if (!config)
            throw new Error("配置不能为null");
    }

    //执行主入口 这个是关闭连接
    public execute(cb: (client: Request) => Promise<void>): Promise<void> {
        let conn: ConnectionPool = null;
        return this._createConnection().then(result => {
            conn = result;
            return new Request(result);
        }).then(cb).then(() => {
            return this._quitconnection(conn);
        }).catch((error) => {
            return this._quitconnection(conn).then(() => {
                throw error;
            });
        });
    };

    //执行主入口 这个是关闭连接
    //public transaction(cb: (client: Request) => Promise<void>): Promise<void> {
    //    let transaction: Transaction = null;
    //    return this._createConnection().then(result => {
    //        transaction = new Transaction(result);
    //        return transaction.begin().then(() => {
    //            return new Request(transaction);
    //        })
    //    }).then(cb).then(() => {
    //        return transaction.commit()
    //    }).then(() => {
    //        return this._quitconnection(transaction.ConnectionPool);
    //    }).catch((error) => {
    //        if (transaction && transaction.ConnectionPool.connected) {
    //            return transaction.rollback().then(() => {
    //                return this._quitconnection(transaction.ConnectionPool).then(() => {
    //                    throw error;
    //                });;
    //            })
    //        }
    //    });
    //};

    private _createConnection(): Promise<ConnectionPool> {
        return new ConnectionPool(this.config).connect();
    };

    private _quitconnection(conn: ConnectionPool): Promise<void> {
        if (conn && conn.connected)
            return conn.close();
    };


}
