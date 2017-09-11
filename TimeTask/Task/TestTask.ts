import { ITask, JobContent } from "./ITask";

export class TestTask implements ITask<string> {
    public Excute(content: JobContent<string>): Promise<boolean> {
        console.log(content.job.eventNames());
        return new Promise<boolean>((resolv, reject) => {
            console.log(new Date().toISOString() + ":testtask,参数：" + content.job.name);
            return resolv(true);
        }).catch(err => {
            console.log(err);
            return false;
        })
    }
}

