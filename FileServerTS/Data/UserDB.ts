import { MSCommand } from "./Interface/MSCommand";
import { config, TYPES } from "mssql";

const source: string = "inc:";

//clientid 缓存
export class UserDB {

    private rediscommand: MSCommand = null;

    constructor(config: config) {
        this.rediscommand = new MSCommand(config);
    }
    
    //public Contains(name: string): Promise<boolean> {

    //    let result: boolean = false;
    //    return this.rediscommand.execute(client => {
    //        return new Promise<void>((resolve, reject) => {

    //            client.input("name", TYPES.NVarChar, name);
    //            //查询账号信息
    //            client.query<any>('SELECT count(1) as num FROM [UserAccount](nolock)  where Name =@name ', (err, recordset, affected) => {
    //                if (err) {
    //                    reject(err);
    //                }
    //                else {
    //                    recordset.forEach((item, index, arry) => {
    //                        result = item.num > 0;
    //                    })
    //                    resolve();
    //                }
    //            });


    //        })
    //    }).then(function () {
    //        return result;
    //    })
    //}

    //public Register(param: RegisterEntity): Promise<boolean> {

    //    let result: boolean = false;
    //    return this.rediscommand.transaction(client => {
    //        return new Promise<void>((resolve, reject) => {

    //            client.input("name", TYPES.VarChar, param.name.trim());
    //            client.input("password", TYPES.Char, param.password.trim());
    //            client.input("code", TYPES.Char, param.code.trim());
    //            client.input("ip", TYPES.VarChar, param.ip.trim());
    //            client.input("platform", TYPES.VarChar, param.platform ? param.platform.trim() : "platform");//代表是那个平台，那个游戏
    //            client.input("mark", TYPES.VarChar, param.mark.trim());//代表 额外的参数 可以指代从哪个推广商过来的
    //            client.input("source", TYPES.SmallInt, 2);//代表账号类型 手机，邮箱
    //            //插入账号信息
    //            client.query<any>('insert into [UserAccount]([Code],[Name] ,[Password],[RegAddress],[RegSource],[RegMark],[Source]) values(@code,@name,@password,@ip,@platform,@mark,@source)', (err, recordset, affected) => {
    //                if (err) {
    //                    reject(err);
    //                } else if (affected < 1) {
    //                    reject(new Error("插入账号信息失败"));
    //                } else {
    //                    //插入用户信息
    //                    client.query('insert into [Account]([Code]) values(@code)', (err, recordset, affected) => {
    //                        if (err) {
    //                            reject(err);
    //                        } else {
    //                            result = affected > 0;
    //                            resolve();
    //                        }
    //                    })
    //                }
    //            });


    //        })
    //    }).then(function () {
    //        return result;
    //    })
    //}
    

}

