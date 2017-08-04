import { MSCommand } from "./Interface/MSCommand";
import { FileInfoEntity, QueryFileInfoParamEntity, QueryResultEntity } from "../Entity/FileInfoEntity"
import { TYPES } from "mssql";
import pathmethod = require('path');

//clientid 缓存
export class FileInfoMS {

    private command: MSCommand = null;

    constructor(config) {
        this.command = new MSCommand(config);
    }

    //查询文件信息
    public GetInfo(code: string): Promise<FileInfoEntity> {
        let back: FileInfoEntity = null;
        return this.command.execute(client => {
            client.input('code', TYPES.VarChar, code)//
            return client.query('select [code],[address],[createtime] ,[createuserid] as userid,[mimetype],[status] from  [files] where code=@code').then(result => {
                back = result.recordset[0];
            });
        }).then(()=> {
            return back;
        })
    }

    //添加一个文件
    public New(fileinfo: FileInfoEntity): Promise<boolean> {
        let back: boolean = false;
        return this.command.execute(client => {
            client.input('code', TYPES.VarChar, fileinfo.code)//
            client.input('address', TYPES.VarChar, fileinfo.address)//
            client.input('userid', TYPES.Int, fileinfo.userid)//
            client.input('mimetype', TYPES.VarChar, fileinfo.mimetype)//

            return client.query('insert into [files](code,address,createuserid,mimetype) values (@code,@address,@userid,@mimetype);insert into [FileLog] ([filecode],[userid],[type]) values(@code,@userid,\'added\')').then(result => {
                back = result.rowsAffected[0] > 0 && result.rowsAffected[1] > 0;
            });
        }).then(() => {
            return back;
        })
    }

    //禁用文件
    public disabled(code: string, userid: number): Promise<boolean> {
        let back: boolean = false;
        return this.command.execute(client => {
            client.input('code', TYPES.VarChar, code)//
            client.input('userid', TYPES.Int, userid)//
            return client.query('update [files] set [status]=0 where  [code] = @code;   insert into [FileLog] ([filecode],[userid],[type]) values(@code,@userid,\'disabled\')').then(result => {
                back = result.rowsAffected[0] > 0 && result.rowsAffected[1] > 0;
            });
        }).then(() => {
            return back;
        })
    }

    //查询文件信息
    public queryinfo(param: QueryFileInfoParamEntity): Promise<QueryResultEntity<FileInfoEntity>> {
        let back: QueryResultEntity<FileInfoEntity> = new QueryResultEntity<FileInfoEntity>();

        //执行查询
        return this.command.execute(client => {
            let condition: string = "";
            if (param.userid > 0) {
                condition += " and createuserid=" + param.userid;
            }

            client.input('tblName', TYPES.NVarChar(200), "Files")//表名
            client.input('fldName', TYPES.NVarChar(2000), "[code],[address],[createtime],[createuserid],[mimetype],[status]")//字段
            client.input('pageSize', TYPES.Int, param.size)//
            client.input('page', TYPES.Int, param.page)//
            client.input('fldSort', TYPES.NVarChar(200), "createtime")// 排序的字段
            client.input('Sort', TYPES.Bit, true)// 排序的方法
            client.input('strCondition', TYPES.NVarChar(2000), condition)// 条件
            client.input('ID', TYPES.NVarChar(150), "code")//主键

            client.output('pageCount', TYPES.Int)//当前条数
            client.output('Counts', TYPES.Int)//总数

            return client.execute('DataPagination').then(result => {
                back.page = result.output["pageCount"];
                back.total = result.output["Counts"];
                result.recordset.forEach((item) => {
                    var entity = new FileInfoEntity();
                    entity.code = item.code;
                    entity.address = item.address;
                    entity.createtime = item.createtime;
                    entity.userid = item.createuserid;
                    entity.mimetype = item.mimetype;
                    entity.status = item.status;
                    entity.ext = pathmethod.extname(item.address);
                    back.data.push(entity);
                });
            });
        }).then(() => {
            return back;
        });
    }


}

