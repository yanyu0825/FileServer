import { ITaskEntity } from "../Task/ITask";
import { TestTask } from "../Task/TestTask";
import { FileMinTask } from "../Task/FileMinTask";

export class Config {

    public static rediscache = { host: "ydg1988825.gicp.net", port: 6379, db: "0", connect_timeout: 5000 };
    public static opendebug: boolean = true; //是否启用debug





    public static GetTasks(): ITaskEntity[] {
        return new Array(
            //{
            //    Name: "test",
            //    TimeCron: "*/5 * * * * *",
            //    task: TestTask
            //},
            {
                Name: "压缩图片文件",
                TimeCron: "*/5 * * * * *",
                task: new FileMinTask()
            });
    };


    public static filesdb = {
        server: "ydg1988825.gicp.net",
        user: "sa",
        password: "Yanyu0825",
        database: "File",
        pool: {
            max: 10,
            min: 0,
            idleTimeoutMillis: 30000
        }
    };

    public static fileconfig = {
        sourcefile: '../FileServer/uploads/',
        distfile: '../FileServer/realfiles/'
    }

}
