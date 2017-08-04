import { Router } from 'express';
var router: Router = Router();


/* GET users listing. */
router.get('/', function (req, res) {
    res.send('respond with a resource');
});

export = router;