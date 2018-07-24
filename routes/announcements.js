const express = require('express');
const router = express.Router();
const OrmAnnouncement = require("../_orm/OrmAnnouncement");
const OrmImageFile = require("../_orm/OrmImageFile");
const ModelAnnouncement = require("../_model/ModelAnnouncement");
const Q = require("q");
//编写执行函数
router.get('/', function(req, res, next) {
  let ormAnnouncement= new OrmAnnouncement();
  ormAnnouncement.searchList()
    .then((rst)=>{
      res.json(rst);
    });
});
router.get('/:annc_id', function(req, res, next) {
  let anncId = req.params.annc_id;
  let modelAnnouncement= new ModelAnnouncement();
  modelAnnouncement.getAnnouncementDetail(anncId)
    .then((rst)=>{
    console.log("rrrr->",rst);
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
  let imageFiles = parms.imagefiles;
  console.log(imageFiles);
  let parm={
    ann_class_id:classId,
    ann_title:anncTitle,
    ann_details:anncDetails,
    ann_create_user:anncCreateUser
  };



  try{

  ormAnnouncement.upsert(parm,true)
    .then((rst)=>{
      console.log(rst);
     let id  = rst.lastID;
      let promiseA = [];
      for(let i = 0,len = imageFiles.length;i<len;i++){
        let imgParm = {
          imf_annc_id:id,
          imf_path : imageFiles[i]
        };
        promiseA.push(ormImageFile.upsert(imgParm,true));
      }
      Q.all(promiseA)
        .then((rst)=>{
          res.json(rst);
        });
    })
  }catch (e){
    console.log("errrrrrr",e);
  }
});

module.exports = router;
