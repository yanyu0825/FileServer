var dbs =
    {
        file: {
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


    };




module.exports = dbs;