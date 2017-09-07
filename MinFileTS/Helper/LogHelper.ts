import { Config } from "../Config/Config";
import { StrRedis } from "../data/CommonRedis";
var packageconfig = require("../package.json");

const key = "errorlog";

const strcmd = new StrRedis(Config.rediscache);
export class LogHelper implements ILog {


    public debug(msg: string, title?: string) {
        if (msg) {
            let entity: IRemoteLogEntity = { title: title && title.length > 0 ? title : "调试信息", content: msg, appname: packageconfig.name, logtype: "Trace", time: new Date().toLocaleString() };
            strcmd.SetList(key, JSON.stringify(entity), false).then(a => {
                if (Config.opendebug)
                    console.log(msg);
            }).catch(err => {
                console.log(err);
            });
        }
    }

    public error(msg: Error, title?: string) {
        if (msg) {
            let entity: IRemoteLogEntity = { title: title && title.length > 0 ? title : msg.message, content: msg.stack, appname: packageconfig.name, logtype: "Error", time: new Date().toLocaleString() };
            strcmd.SetList(key, JSON.stringify(entity), false).then(a => {
                if (Config.opendebug)
                    console.log(msg);
            }).catch(err => {
                console.log(err);
            });
        }
    }

}

//日志记录格式
interface IRemoteLogEntity {
    title: string;
    content: string;
    appname: string;
    logtype: string;
    time: string;
}