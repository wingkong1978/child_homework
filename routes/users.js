var express = require('express');
var router = express.Router();
const users = require("../_model/users");
//编写执行函数
router.get('/', function(req, res, next) {

  console.log("get user");
  // res.send( (new teacher()).login_q());
});
router.post('/', function(req, res, next) {
  console.log("post user",req);

  res.send( req.params);
});

module.exports = router;
