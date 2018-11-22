var express = require('express');
var router = express.Router();

//编写执行函数
router.get('/', function(req, res, next) {
    res.render('login.html');
});

module.exports = router;