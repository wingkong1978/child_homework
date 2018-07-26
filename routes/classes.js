var express = require('express');
var router = express.Router();
const OrmClass = require("../_orm/OrmClass");
const ModelClass = require("../_model/ModelClass");
const OrmStudent= require("../_orm/OrmStudent");
const OrmMapStudentUser = require("../_orm/OrmMapStudentUser");
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
  let studentname = req.body.studentname;
  let relationship = req.body.relationshipname;
  let parm = {
    stu_class_id :classno,
    stu_name:studentname,
    stu_no:0//todo 学生学号
  };
  let ormMapStudentUser = new OrmMapStudentUser();
  let mapParm = {};

  ormStudent.searchList(parm)
    .then((rst)=>{
      console.log("search_student",rst);
      let studentId = 0;
      if(rst.rows.length>0){
       studentId = rst.rows[0].id;
        mapParm = {
          msu_student_id:studentId,
          msu_user_id:userid,
          msu_relationship:relationship
        };
       ormMapStudentUser.upsert(mapParm)
         .then((rst)=>{
           res.json(rst) ;
         })
      }else{
        ormStudent.upsert(parm)
          .then((rst)=>{
          console.log("student upsert result",rst);
            studentId = rst.lastID;
            mapParm = {
              msu_student_id:studentId,
              msu_user_id:userid,
              msu_relationship:relationship
            };
            ormMapStudentUser.upsert(mapParm)
              .then((rst)=>{
                res.json(rst) ;
              })
          })
      }
    });
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
