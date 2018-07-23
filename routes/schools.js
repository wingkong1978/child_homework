var express = require('express');
var router = express.Router();
const OrmSchool = require("../_orm/OrmSchool");
//编写执行函数
router.get('/', function(req, res, next) {
  console.log("get schools");
  let ormSchool = new OrmSchool();
  ormSchool.searchList()
    .then((rst)=>{
      res.json(rst);
    });
});

module.exports = router;
