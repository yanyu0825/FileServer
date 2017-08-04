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
                back = result[0].rowsAffected > 0;
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
                if (result.recordset && result.recordset[0] && result.recordset[0].address) {
                    var add = result.recordset[0].address;
                    back = add.substring(0, add.length - address.length);
                }
                else
                    throw new Error("无数据");
            });
        }).then(() => {
            return back;
        });
    }


}

