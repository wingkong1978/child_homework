var express = require('express');
var router = express.Router();
const OrmClass = require("../_orm/OrmClass");
const ModelClass = require("../_model/ModelClass");
const ModelStudent= require("../_model/ModelStudents");
const OrmStudent= require("../_orm/OrmStudent");
const OrmMapStudentUser = require("../_orm/OrmMapStudentUser");
const AppTools = require("../_biz/AppTools");
//编写执行函数
router.get('/', function(req, res, next) {
  let ormClass = new OrmClass();
  ormClass.searchList()
    .then((rst)=>{
      res.json(rst);
    });
});

router.get('/parentnicknames', function(req, res, next) {
  let ormClass = new OrmClass();
  ormClass.searchList()
    .then((rst)=>{
      res.json(rst);
    });
});

router.post('/:classno/relationship', function(req, res, next) {
  /*
  首先查一下t_students 表看看有没有这个学生存在，如果没有就新增一个，如果有就返回studentId
   */
  let ormStudent = new OrmStudent();
  let classno = req.params.classno;
  let userid = req.body.userid;
  // let childnames= req.body.childnames;
  let childidlist = req.body.childidlist;
  let relationship = req.body.relationshipname;
  let ormMapStudentUser = new OrmMapStudentUser();
  let mapParm = {};

  //循环小盆友student id 然后插入t_map_student_relationship
  let parmArr = [];
  for(let i=0,len=childidlist.length;i<len;i++) {
    let parm = [0, childidlist[i], userid, relationship, 0, AppTools.getTimeStr(),AppTools.getTimeStr()];
    parmArr.push(parm);
  }

  let sql = "insert into t_map_student_user_relationship values ?";

    //todo，下面还没有做好，循环直接插入就是了；
          ormMapStudentUser.exec_q(sql,parmArr)
            .then((rst)=>{
              res.json(rst) ;
            })

});
router.get('/:classno/:userid', function(req, res, next) {
  let modelClass = new ModelClass();
  let classno = req.params.classno;
  let userid = req.params.userid;
  modelClass.checkParentRelationShipExists(classno,userid)
    .then((rst)=>{
      res.json(rst) ;
    });
});
router.post('/', function(req, res, next) {

  let parms = req.body;

  let ormClass = new OrmClass();
  let classname = parms.classname;
  let schoolid =parms.schoolid;
  let parm={
    cla_name:classname,
    cla_school_id:schoolid
  };

  ormClass.upsert(parm,true)
    .then((rst)=>{
      console.log(rst);
      res.json(rst);
    })
});




module.exports = router;
