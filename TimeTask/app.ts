import { scheduleJob, scheduledJobs, Job } from "node-schedule";
import { Config } from "./Config/Config";
import { LogHelper } from "./Helper/LogHelper";
import { TaskRedis } from "./Data/TaskRedis";

const loghelper = new LogHelper();
const taskredis = new TaskRedis(Config.rediscache);
const taskrediskey = "tasks";

//读取配置
console.log('启动定时任务..........');

var tasks = Config.GetTasks();

tasks.forEach(task => {
    console.log(`初始化任务:${task.Name}`);
    let tasklasttime: Date = null;
    let job: Job = scheduleJob(task.Name, task.TimeCron, () => {
        new Promise<Date>((resolve, reject) => {
            if (!tasklasttime) {
                //读取数据库中的时间
                taskredis.HGet(taskrediskey, task.Name, false).then(a => {
                    //修改本程序中的上次执行时间
                    //tasklasttime = new Date(JSON.parse(a));
                    tasklasttime = a ? new Date(a) : new Date("2017-9-1");
                    resolve(tasklasttime);
                })
            } else
                resolve(tasklasttime);
        }).then(lasttime => {
            let time = new Date();
            return task.task.Excute({
                param: task.param,
                lasttime: lasttime
                , job: job
            }).then(result => {
                return { result: result, time: time };
            });
        }).then(result => {
            if (result && result.result) {
                //job.emit("compeleted", result.time);//执行事件---不需要了
                //修改文件或者数据库上次执行时间
                return taskredis.HSet(taskrediskey, task.Name, result.time.toJSON(), false).then(a => {
                    //修改本程序中的上次执行时间
                    tasklasttime = result.time;
                })
            }
        }).then(() => {
            loghelper.debug(job.name + "--执行完毕", job.name)
        }).catch(err => {
            loghelper.error(err, job.name)
        })
    });

    //job.addListener("compeleted", (time: Date) => {
    //    //修改文件或者数据库上次执行时间
    //    //job.

    //    //修改本程序中的上次执行时间
    //    tasklasttime = time;
    //});
})
console.log('启动定时任务完毕.........');
