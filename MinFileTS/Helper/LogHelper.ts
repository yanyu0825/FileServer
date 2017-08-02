
import { StrRedis } from "../data/StrRedis";
var packageconfig = require("../package.json");

const key = "errorlog";

const strcmd = new StrRedis({ host: "ydg1988825.gicp.net", port: 6379, db: "0" });
export class LogHelper implements ILog {


    public debug(msg: string, title?: string) {
        if (msg) {
            strcmd.SetList(key, JSON.stringify({ title: title && title.length > 0 ? title : "调试信息", content: msg, appname: packageconfig.name, logtype: "Trace", time: new Date().toLocaleString() }))
                .catch(err => {
                    console.log(err);
                });
        }
    }

    public error(msg: Error, title?: string) {
        if (msg) {
            strcmd.SetList(key, JSON.stringify({ title: title && title.length > 0 ? title : msg.message, content: msg.stack, appname: packageconfig.name, logtype: "Error", time: new Date().toLocaleString() }))
                .catch(err => {
                    console.log(err);
                });
        }
    }

}


class RemoteLogEntity {
    constructor(public title: string, public content: string, public appname: string, public logtype: string, public time: string) {
    }
}
