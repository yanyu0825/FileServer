
//由于我使用的是windows服务器 做成随机启动的服务需要使用node-windows 

//import Service = require("node-windows");

let Service = require('node-windows').Service;

let svc = new Service({
    name: 'node定时任务',    //服务名称  
    description: 'node版的定时任务', //描述  
    script: './app.js' //nodejs项目要启动的文件路径  
});

svc.on('install', () => {
    console.log("install")
    svc.start();
});

svc.install();  