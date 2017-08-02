var dbs =
    {
        file: {
            command: "mssql", config: {
                server: 'Testdb-houtai'
                , database: 'File',
                user: "vanclsysuser",
                password: "sysuser@vancl",
                pool: {
                    max: 10,
                    min: 0,
                    idleTimeoutMillis: 30000
                }
            }
        }


    };




module.exports = dbs;