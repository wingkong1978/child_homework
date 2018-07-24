const multiparty = require("multiparty");

const express = require('express');
const router = express.Router();
const util = require('util');
const fs = require("fs");
const AppTools = require("../_biz/AppTools");
//编写执行函数
router.post('/', function(req, res, next) {
  var form = new multiparty.Form({

  });

  form.parse(req, function(err, fields, files) {
    if (err) {
      res.writeHead(400, {'content-type': 'text/plain'});
      res.end("invalid request: " + err.message);
      return;
    }
    res.writeHead(200, {'content-type': 'text/plain'});
    res.write('received fields:\n\n '+util.inspect(fields));
    res.write('\n\n');

    let tmpFilePath = files.path;
    let tmpFilePatha= tmpFilePath.split("/").reverse();
    let imagePath = "../_files/images";
    let today = AppTools.getToday();
    let todayImagePath = imagePath+"/"+today +"/";
    fs.access(todayImagePath,fs.constants.R_OK,(err)=>{
      if(err){
        fs.mkdir(todayImagePath,(rst)=>{
          if(err)
            throw  err;
          fs.copy(tmpFilePath,todayImagePath+tmpFilePatha[0],(err)=>{
            if(err) console.log("copy file error=>",err);
            res.end('received files:\n\n '+todayImagePath+tmpFilePatha[0]);
          })
        })
      }else{
        fs.copy(tmpFilePath,todayImagePath+tmpFilePatha[0],(err)=>{
          if(err) console.log("copy file error=>",err);
          res.end('received files:\n\n '+todayImagePath+tmpFilePatha[0]);
        })
      }
    });


  });
});

module.exports = router;
