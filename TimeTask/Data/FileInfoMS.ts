import { MSCommand } from "./Interface/MSCommand";
import { TYPES } from "mssql";

//clientid 缓存
export class FileInfoMS {

    private rediscommand: MSCommand = null;

    constructor(config) {
        this.rediscommand = new MSCommand(config);
    }

    public EnabledFile(code: string): Promise<boolean> {
        let back: boolean = false;
        return this.rediscommand.execute(client => {
            client.input('code', TYPES.VarChar, "%" + code)//
            return client.query('update [files] set [status]=1 where  [address] like @code and [status]=0').then(result => {
                back = result.rowsAffected[0] > 0;
            });
        }).then(function () {
            return back;
        })
    }


    public GetPath(address): Promise<string> {
        let back: string = null;

        //执行查询
        return this.rediscommand.execute(client => {
            client.input('code', TYPES.VarChar, "%" + address)//
            return client.query('select  [address] from [files] where [address] like @code').then(result => {

                result.recordset.forEach(item => {
                    if (item.address) {
                        var add = item.address;
                        back = add.substring(0, add.length - address.length);
                    }
                })
                if (!back) 
                    throw new Error(`无数据:${address}`);
            });
        }).then(() => {
            return back;
        });
    }
    
    //查询所有已经审核通过的文件
    public GetChangeFilePath(time: Date): Promise<string[]> {
        let back: string[] = [];
        //执行查询
        return this.rediscommand.execute(client => {
            client.input('time', TYPES.DateTime, time)//
            return client.query('select a.[address] from [files](nolock) a join [FileLog](nolock) b on a.[code]=b.filecode where a.[status]=1 and b.[time]>=@time').then(result => {
                result.recordset.forEach(item => {
                    if (item.address) {
                        back.push(item.address);
                    }
                });
            });
        }).then(() => {
            return back;
        });
    }


}

