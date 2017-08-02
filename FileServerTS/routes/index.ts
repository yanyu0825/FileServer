/*
 * GET home page.
 */
import { Router } from 'express';
var router: Router = Router();

/* GET home page. */
router.get('/', function (req, res) {
    res.render('index', { title: 'Express' });
});


export = router;