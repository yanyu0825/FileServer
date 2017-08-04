export class FileInfoEntity {
    public code: string = null;
    public address: string = null;
    public userid: number = 0;
    public mimetype: string = null;
    public createtime: string = null;
    public status: boolean = false;
    public ext: string = null;
}

export class QueryFileInfoParamEntity extends FileInfoEntity{
    public page: number = 1;
    public size: number = 10;
}

export class QueryResultEntity<T> {
    public page: number = 0;
    public total: number = 0;
    public data: T[] = new Array<T>();
}