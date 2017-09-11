import { Job } from "node-schedule";

export interface ITask<T> {
    Excute(content: JobContent<T>): Promise<boolean>
}

export interface JobContent<T> {
    param?: T;
    lasttime: Date;
    job: Job
}

export interface ITaskEntity {
    Name:string
    TimeCron: string;
    param?: any;
    task: ITask<any>
}