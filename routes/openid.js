var express = require('express');
var router = express.Router();
const AppTools = require("../_biz/AppTools");
const WXBizDataCrypt = require("../_biz/WXBizDataCrypt");

const OrmUser = require("../_orm/OrmUser");
//编写执行函数
router.get('/', function(req, res, next) {

  console.log("get user");
  // res.send( (new teacher()).login_q());
});
router.post('/', function(req, res, next) {
  let parms = req.body;

  let code = parms.code;

  let appid = "wx5a6711ff1b8896b9";
  let secret = "a21794d4670f247ab5215a30f6b2092b";
//"https://api.weixin.qq.com/sns/jscode2session?appid=$appid&secret=$secret&js_code=$code&grant_type=authorization_code";


  let { encryptedData, iv  } = req.body;
//  {web_host,method="POST",path="/",port="80",content_type='application/json; charset=UTF-8',timeout=4000} = config;
  let config = {

    web_host:"api.weixin.qq.com",
    path: "/sns/jscode2session?appid="+appid+"&secret="+secret+"&js_code="+code+"&grant_type=authorization_code"
  };

  console.log(config);
  let data = {

  };
  AppTools.http_post_q(config,data,true).then((rst)=>{
    let session_key = rst.session_key;
    let pc = new WXBizDataCrypt(appid, session_key);

    let data = pc.decryptData(encryptedData, iv);

    let parm = {
      use_avatarurl:data.avatarUrl,
      use_city:data.city,
      use_country:data.country,
      use_gender:gender,
      use_language:language,
      use_nickname:nickName,
      use_openid:openId,
      use_province:province
    };

    (new OrmUser()).upsert(parm,true)
      .then((rst)=>{
      console.log("rst-->",rst);
      res.json(
        data
      );
    })
  });
});

router.put('/', function(req, res, next) {
  console.log("put token",req);

  res.send( req.params);
});

module.exports = router;
