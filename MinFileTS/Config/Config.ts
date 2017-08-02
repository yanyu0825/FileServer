
export class Config {

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
    public static filesredis = { host: "ydg1988825.gicp.net", port: 6379, db: "5" };


}
