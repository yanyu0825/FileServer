import * as base from "./BaseRedis";
import { FileInfoEntity, QueryFileInfoParamEntity, QueryResultEntity } from "../Entity/FileInfoEntity"

export declare var IncEntity: base.IncEntity;

const key: string = "fileinfo"

//clientid 缓存
export class FileInfoRedis extends base.BaseRedis{
    
    constructor(config) {
        super(config, "");
    }

    //查询文件信息
    public GetInfo(code: string): Promise<FileInfoEntity> {
        return this.HMGet(key, code);
    }

    //添加一个文件
    public SetInfo(entity: FileInfoEntity): Promise<boolean> {
        return this.HMSet(key, entity.code, JSON.stringify(entity));
    }

    //禁用文件
    public Disabled(code: string): Promise<boolean> {
        return this.HDel(key, code);
    }

}

