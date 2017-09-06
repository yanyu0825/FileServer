import { LogHelper } from "./LogHelper";
import { ClientIDModel } from "../model/ClientIDModel";
import { Config } from "../Config/Config";
import { ClientRequest, request } from "http";

export class ClientHelper {

    constructor(protected log: ILog = new LogHelper()) {
    }

    private CanUse(code: string, ClientID: string, max: number): Promise<boolean> {
        return new Promise<boolean>((resolve, reject) => {
            if (!code || code.length < 1 || !max || max < 1) {
                reject(new Error("参数不正确"));
            }
            else
                resolve(true);
        }).then(a => {
            //读取用户已经读取此接口次数
            return new ClientIDModel(this.log).GetClientUseCount(ClientID, code);
        }).then(count => {
            return count <= max;
        })

    }

    //time=秒，max=最大访问次数 访问接口的针对clientid的过滤器 code=此接口的唯一码
    public Filter(code: string, time: number = 300, max: number = 3) {
        return ((req, res, next) => {
            let clientid: string = req.signedCookies && req.signedCookies[Config.client.name] ? req.signedCookies[Config.client.name] : null;
            //验证refer 主域
            new Promise<boolean>((resolve, reject) => {
                let r: boolean = true;
                if (req.headers.referer) {

                    let domain = req.hostname;
                    //读取主域名
                    let domains = req.hostname.split(".");
                    if (domains.length > 2)
                        domain = domains[domains.length - 2] + "." + domains[domains.length - 1];
                    r = req.headers.referer.endsWith(domain);
                }
                resolve(r);
            }).then(a => {
                if (!a)
                    throw new Error("主域不对");
                return this.CanUse(code, clientid, max).then(result => {
                    if (result) {
                        res.once('finish', () => {
                            new ClientIDModel(this.log).IncClientUseCount(clientid, code, time);
                        });
                        res.once('close', () => {
                            new ClientIDModel(this.log).IncClientUseCount(clientid, code, time);
                        });
                        return next();
                    }
                    else {
                        let err = new Error("访问接口被拒绝");
                        err["status"] = 403;
                        throw err;
                    }
                }).catch(err => {
                    this.log.error(err);
                    res.status(err.status || 500).render("error", { message: err.message, error: err });
                });
            })
        });

    }
}

