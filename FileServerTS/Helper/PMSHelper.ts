import { LogHelper } from "./LogHelper";
import { Config } from "../Config/Config";
import { ClientRequest, request } from "http";

export class PMSHelper {

    constructor(protected log: ILog = new LogHelper()) {
    }

    public Contains(userid: number, pmsid: number): Promise<boolean> {
        if (!Config.openpms)
            return Promise.resolve(true);
        else
            return new Promise<number>((resolve, reject) => {
                if (!pmsid || !userid || pmsid < 1 || userid < 1) {
                    reject(new Error("权限的id,userid 不正确"));
                }
                else
                    resolve(pmsid);
            }).then(pmsid => {
                //判断用户权限- 从接口中读取用户在本项目的权限-最好在路由中作因为路由才有接口的id
                return new Promise<boolean>((resolve, reject) => {
                    request({
                        protocol: "http:",
                        hostname: 'pms.yanyu0825.cn',//远端服务器域名
                        port: 80,//远端服务器端口号
                        method: "POST",
                        path: '/api/contains',//上传服务路径
                        headers: {
                            'Content-Type': 'application/json'
                        }
                    }, res => {
                        let chunks = [];
                        res.on('data', (data) => {
                            chunks.push(data);
                        });
                        res.on('end', () => {
                            if (res.statusCode == 200) {
                                console.log(chunks.toString());
                                let result: PmsResultEntity = JSON.parse(chunks.toString());
                                if (result.Status == "success" && result.Data.result)
                                    resolve(true);
                                else
                                    resolve(false);
                            }
                            else {
                                reject(new Error("pms访问返回不正确 statusCode：" + res.statusCode));
                                this.log.debug(res.statusMessage + ":" + chunks.toString());
                            }
                        });
                    }).on('error', (err) => {
                        reject(err);
                    }).end(JSON.stringify({ userid: userid, resourceid: pmsid }));
                });
            })

    }


    public Use(pmsid: number) {
        return ((req, res, next) => {
            this.Contains(req.body.userid, pmsid).then(result => {
                if (result)
                    next();
                else {
                    let err = new Error("账号无权限");
                    err["status"] = 403;
                    throw err;
                }
            }).catch(err => {
                this.log.error(err);
                res.status(err.status || 500).render("error", { message: err.message, error: err });
            });
        });

    }
    // request data



}

export class PmsResultEntity {
    public Status: string = null;
    public Data: PmsEntity = new PmsEntity();
}

export class PmsEntity {

    constructor(public result: boolean = false, public children: number[] = new Array<number>())
    { }
}
