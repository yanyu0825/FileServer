
export class Config {

    public static rediscache = { host: "ydg1988825.gicp.net", port: 6379, db: "5" };
    public static account = { maxage: 3600, maxcount: 3 };
    public static ip = { maxage: 1800, maxcount: 10 };
    public static client = { maxage: 1200, maxcount: 3, regmaxcount: 3 };
    public static token = { "maxage": 1200, name: "token" };
    public static domain = "localhost";


    public static accountdb = { server: "ydg1988825.gicp.net", user: "sa", password: "Yanyu0825", database: "Account_New" };


}
