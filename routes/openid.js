var express = require('express');
var router = express.Router();
const AppTools = require("../_biz/AppTools");
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

//  {web_host,method="POST",path="/",port="80",content_type='application/json; charset=UTF-8',timeout=4000} = config;
  let config = {

    web_host:"api.weixin.qq.com",
    path: "/sns/jscode2session?appid="+appid+"&secret="+secret+"&js_code="+code+"&grant_type=authorization_code"
  };

  console.log(config);
  let data = {

  };
  let decrypt = function (a, b, crypted){
    crypted = new Buffer(crypted, 'base64');
    let decipher = crypto.createDecipheriv('aes-128-cbc', a, b);
    let decoded = decipher.update(crypted,'base64','utf8');
    decoded += decipher.final('utf8');
    return decoded;
  };
  console.log(parms);
  AppTools.http_post_q(config,data,true).then((rst)=>{
    let iv = parms.iv;
    let encryptData = parms.encryptData;
    console.log("iv-->",iv)
    console.log("encryptdata-->",encryptData);
    let dec = decrypt(rst.session_key,iv,encryptData);
    console.log("rest-->",dec);
    let result = {};
    try{
      result = JSON.parse(dec);
    }catch(e){
      logger.error(e);
      result = {};
    }
    res.json({
      code: 1,
      data: result
    });
  });
});

router.put('/', function(req, res, next) {
  console.log("put token",req);

  res.send( req.params);
});

module.exports = router;
