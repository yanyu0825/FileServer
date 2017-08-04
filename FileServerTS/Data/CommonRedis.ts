import * as base from "./BaseRedis";


//export declare var IncEntity: base.IncEntity;
export class IncEntity extends base.IncEntity { }

//clientid 缓存
export class UserRedis extends base.BaseRedis {

    constructor(config) {
        super(config,"u000:");
    }
}

export class StrRedis extends base.BaseRedis {

    constructor(config) {
        super(config, "str:");
    }
}

export class IncRedis extends base.BaseRedis {

    constructor(config) {
        super(config, "inc:");
    }
}