const express = require('express');
const router = express.Router();
const OrmAnnouncement = require("../_orm/OrmAnnouncement");
//编写执行函数
router.get('/', function(req, res, next) {
  let ormAnnouncement= new OrmAnnouncement();
  ormAnnouncement.searchList()
    .then((rst)=>{
      res.json(rst);
    });
});

router.post('/', function(req, res, next) {

  let parms = req.body;

  let ormAnnouncement = new OrmAnnouncement();
  let classId = parms.classid;
  let anncTitle =parms.anncTitle;
  let anncDetails= parms.anncDetails;
  let anncCreateUser = parms.anncCreateUser;
  let parm={
    ann_class_id:classId,
    ann_title:anncTitle,
    ann_details:anncDetails,
    ann_create_user:anncCreateUser
  };

  ormAnnouncement.upsert(parm,true)
    .then((rst)=>{
      console.log(rst);
      res.json(rst);
    })
});

module.exports = router;
