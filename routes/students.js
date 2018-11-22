var express = require('express');
var router = express.Router();
const ModelStudents = require("../_model/ModelStudents");
//编写执行函数
router.get('/:classno', function(req, res, next) {

  console.log("get students");
  let modelStudents = new ModelStudents();
  let classid = req.params.classno;
  modelStudents.GetStudentsByClassId(classid)
    .then((rst)=>{
      res.json(rst) ;
    });
  // res.send( (new teacher()).login_q());
});
router.post('/', function(req, res, next) {
  console.log("post user");

  res.send( req.params);
});

module.exports = router;
