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
    // res.writeHead(200, {'content-type': 'text/plain'});
    // res.write('received fields:\n\n '+util.inspect(fields));
    // res.write('\n\n');

    console.log(files);
    let tmpFilePath = files.file[0].path;
    console.log("tmpFilePath-->",tmpFilePath);
    let tmpFilePatha= tmpFilePath.split("/").reverse();
    let imagePath = __dirname+ "/../_files/_images";
    let today = AppTools.getToday();
    let todayImagePath = imagePath+"/"+today +"/";
    let imgPath = "_images/"+today + "/"+tmpFilePatha[0];
    fs.access(todayImagePath,fs.constants.R_OK,(err)=>{
      if(err){
        fs.mkdir(todayImagePath,(err)=>{
          if(err)
            throw  err;
          fs.copyFile(tmpFilePath,todayImagePath+tmpFilePatha[0],(err)=>{
            if(err) console.log("copy file error=>",err);
            res.json({imgPath:imgPath});
          })
        })
      }else{
        fs.copyFile(tmpFilePath,todayImagePath+tmpFilePatha[0],(err)=>{
          if(err) console.log("copy file error=>",err);
          res.json({imgPath:imgPath});
        })
      }
    });


  });
});

module.exports = router;
