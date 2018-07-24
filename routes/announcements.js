const express = require('express');
const router = express.Router();
const OrmAnnouncement = require("../_orm/OrmAnnouncement");
const OrmImageFile = require("../_orm/OrmImageFile");
//编写执行函数
router.get('/', function(req, res, next) {
  let ormAnnouncement= new OrmAnnouncement();
  ormAnnouncement.searchList()
    .then((rst)=>{
      res.json(rst);
    });
});
router.get('/classes/:classid', function(req, res, next) {
  let classid = req.params.classid;
  let ormAnnouncement= new OrmAnnouncement();
  ormAnnouncement.searchList({ann_class_id:classid})
    .then((rst)=>{
      res.json(rst);
    });
});
router.post('/', function(req, res, next) {

  let parms = req.body;

  let ormAnnouncement = new OrmAnnouncement();
  let ormImageFile = new OrmImageFile();
  let classId = parms.classid;
  let anncTitle =parms.anncTitle;
  let anncDetails= parms.anncDetails;
  let anncCreateUser = parms.anncCreateUser;
  let imageFiles = params.imagefiles;
  console.log(imageFiles);
  let parm={
    ann_class_id:classId,
    ann_title:anncTitle,
    ann_details:anncDetails,
    ann_create_user:anncCreateUser
  };



  ormAnnouncement.upsert(parm,true)
    .then((rst)=>{
      console.log(rst);
     let id  = rst.lastId;
      let promiseA = [];
      let imgParm = {
        imf_annc_id:id
      };
      for(let i = 0,len = imageFiles.length;i<len;i++){
        imgParm.imf_path = imageFiles[i];
        promiseA.push(ormImageFile.upsert(imageParm,true));
      }
      Q.all(promiseA)
        .then((rst)=>{
          res.json(rst);
        });
    })
});

module.exports = router;
