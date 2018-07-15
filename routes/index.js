var express = require('express');
var router = express.Router();

//编写执行函数
router.get('/', function(req, res, next) {
 let rnd = Math.floor(Math.random()*10+1);
  if(rnd%2===1){
    res.send('我系宝宝猪！！！！');
  }
  else{
    res.send('我系猪头仔！！！！');
  }
});

module.exports = router;