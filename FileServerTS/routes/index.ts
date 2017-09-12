/*
 * GET home page.
 */
import { Router } from 'express';
import { PMSHelper } from "../Helper/PMSHelper";
import { LogHelper } from '../Helper/LogHelper';
var router: Router = Router();
var pmshelper = new PMSHelper();

/* GET home page. */
router.get('/', function (req, res) {
    pmshelper.Contains(req.body.userid, 7).then(result => {
        //内含上传，审核，无权限的只能上传
        res.render('index', { title: '文件服务器', hascheck: result });
    }).catch(err => {
        new LogHelper().error(err);
        res.status(err.status || 500).render("error", { message: err.message, error: err });
    });
});

export = router;