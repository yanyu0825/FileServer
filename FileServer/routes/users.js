var express = require('express');
var router = express.Router();
var model = require("../Model/BaseModel.js");
var model2= require("../Model/GetUserInfoModel.js");
//var _testmodel = require("../Model/TestModel.js");

/* GET users listing. */
router.get('/', function (req, res) {
    res.send('respond with a resource');
});

router.get('/get', function (req, res) {
    var getparam = req.query;
    var postp = req.body;
    model.init(getparam, function (result) {
        if (result) {
            res.cookie('code', result.key);
            //res.clearCookie('name', { path: '/admin' });
            res.json(result);
        } else {
            res.clearCookie('code');
            res.json(null);
        }
    });
});

router.get('/getuserinfo', function (req, res) {
    var code = req.cookies["code"];
    if (!code) {
        res.clearCookie('code');
        res.json("cookies");
    } else {
        
        model2.init(code, function (result) {
            if (result == "account")
                res.clearCookie('code');
            res.json(result);
        });
    }
});


//router.get('/test', function (req, res) {
//    var getparam = req.query;
//    var postp = req.body;
//    console.log(getparam);
//    console.log(getparam);
//    var model = _testmodel.init(getparam);
//    try {
//        model.Execute(function (result) {
//            res.json(result);
//        })
//    } catch (e) {
//        throw e;
//    }
//});
//command.on("data", function (data) {
//        action(data[0][''] > 0?datas:null);
//});

module.exports = router;