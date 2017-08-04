import { RedisCommand } from "./Interface/RedisCommand";
import { FileInfoEntity, QueryFileInfoParamEntity, QueryResultEntity } from "../Entity/FileInfoEntity"
import { TYPES } from "mssql";
import pathmethod = require('path');

const key: string = "fileinfo"

//clientid 缓存
export class FileInfoRedis {

    private command: RedisCommand = null;

    constructor(config) {
        this.command = new RedisCommand(config);
    }

    //查询文件信息
    public GetInfo(code: string): Promise<FileInfoEntity> {
        let back: FileInfoEntity = null;
        return this.command.execute(client => {
            return new Promise<void>((resolve, reject) => {
                client.hmget(key, code, (err, data) => {
                    if (err)
                        reject(err);
                    else {
                        back = data && data.length > 0 ? JSON.parse(data[0]) : null;
                        resolve();
                    }
                });
            });
        }).then(function () {
            return back;
        })
    }

    //添加一个文件
    public SetInfo(entity: FileInfoEntity): Promise<boolean> {
        let back: boolean = false;
        return this.command.execute(client => {
            return new Promise<void>((resolve, reject) => {
                client.hmset(key, entity.code, JSON.stringify(entity), function (err, data) {
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

    //禁用文件
    public Disabled(code: string): Promise<boolean> {
        let back: boolean = false;
        return this.command.execute(client => {
            return new Promise<void>((resolve, reject) => {
                client.hdel(key, code, (err, data) => {
                    if (err)
                        reject(err);
                    else {
                        back = data > 0;
                        resolve();
                    }
                });
            });
        }).then(() => {
            return back;
        })
    }

}

