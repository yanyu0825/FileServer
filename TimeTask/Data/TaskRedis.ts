import * as base from "./BaseRedis";

//clientid 缓存
export class TaskRedis extends base.BaseRedis {

    constructor(config) {
        super(config, "task:");
    }
}
