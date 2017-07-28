var dbs =
    {
        account: {
            command: "mysql", config: {
                host: '192.168.1.8'
                //, port: 3306
                , database: 'Account_New'
                , user: 'root'
                , password: '111111'
            }
        }
        , file: {
            command: "mssql", config: {
                server: 'ydg1988825.gicp.net'
                , database: 'File',
                user: "sa",
                password: "Yanyu0825",
                pool: {
                    max: 10,
                    min: 0,
                    idleTimeoutMillis: 30000
                }
            }
        }
        , redis: {
            command: "redis", config: {
                name: 'identity'
                , port: 6379
                , host: 'ydg1988825.gicp.net'
                , database: 5
                //,options: {
                //    autoretry: false
                //}
            }
        }
        , fileredis: {
            command: "redis", config: {
                name: 'filecache'
                , port: 6379
                , host: 'ydg1988825.gicp.net'
                , database: 4
                //,options: {
                //    autoretry: false
                //}
            }
        }




    };




module.exports = dbs;