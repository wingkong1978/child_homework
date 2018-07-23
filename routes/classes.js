var express = require('express');
var router = express.Router();
const OrmClass = require("../_orm/OrmClass");
//编写执行函数
router.get('/', function(req, res, next) {
  let ormClass = new OrmClass();
  ormClass.searchList()
    .then((rst)=>{
      res.json(rst);
    });
});

router.post('/', function(req, res, next) {

  let parms = req.body;


  let ormClass = new OrmClass();
  let parm={
    cla_name:params.classname,
  };

  ormClass.upsert(parm,true)
    .then((rst)=>{
      console.log(rst);
      res.json(rst);
    })
});

module.exports = router;
