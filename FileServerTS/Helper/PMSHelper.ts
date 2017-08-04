import { TestLogHelper } from "./TestLogHelper";

import { ClientRequest }  from "http";

export class PMSHelper {

    constructor(protected log: ILog = new TestLogHelper()) {
    }

    private Contains(userid: number, pmsid: number): Promise<boolean> {
        return new Promise<number>((resolve, reject) => {
            if (!pmsid || !userid || pmsid < 1 || userid < 1) {
                reject(new Error("权限的id,userid 不正确"));
            }
            else
                resolve(pmsid);
        }).then(pmsid => {
            //判断用户权限- 从接口中读取用户在本项目的权限-最好在路由中作因为路由才有接口的id
            return new Promise<boolean>((resolve, reject) => {
                new ClientRequest({
                    hostname: 'pms.yanyu0825.cn',//远端服务器域名
                    port: 80,//远端服务器端口号
                    method: "POST",
                    path: '/validate',//上传服务路径
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
                            resolve(JSON.parse(chunks.toString()))
                        }
                        else {
                            reject(new Error("访问返回不正确：" + res.statusCode));
                            this.log.debug(res.statusMessage + ":" + chunks.toString());
                        }
                    });
                }).on('error', (err) => {
                    reject(err);
                }).end(JSON.stringify({ userid: userid, id: pmsid }));
            });



            //let r: boolean = [1123, 123].indexOf(pmsid) >= 0;
            //if (!r) {
            //    let err = new Error("账号无权限");
            //    err["status"] = 403;
            //    throw err;
            //}
            //return r;
        })

    }


    public Use(pmsid: number) {
        return ((req, res, next) => {
            this.Contains(req.body.userid, pmsid).then(result => {
                if (result)
                    next();
                else
                    throw new Error("账号无权限");
            }).catch(err => {
                this.log.error(err);
                res.status(err.status || 500).render("error", { message: err.message, error: err });
            });
        });

    }
    // request data



}

