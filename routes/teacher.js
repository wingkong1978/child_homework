var express = require('express');
var router = express.Router();
const teacher = require("../_model/teacher");
//编写执行函数
router.get('/', function(req, res, next) {

  console.log("teacher");
  res.send( (new teacher()).login_q());
});

module.exports = router;
