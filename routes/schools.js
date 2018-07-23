var express = require('express');
var router = express.Router();
const OrmSchool = require("../_orm/OrmSchool");
const OrmClass = require("../_orm/OrmClass");
//编写执行函数
router.get('/', function(req, res, next) {
  console.log("get schools");
  let ormSchool = new OrmSchool();
  ormSchool.searchList()
    .then((rst)=>{
      res.json(rst);
    });
});

router.get('/:schoolid', function(req, res, next) {
  console.log("get schools");
  let schoolid = req.params.schoolid;
  let ormClass = new OrmClass();
  ormClass.searchList({cla_school_id:schoolid})
    .then((rst)=>{
      res.json(rst);
    });
});

module.exports = router;
