var express = require('express');
var router = express.Router();
const users = require("../_model/users");
const OrmUser = require("../_orm/OrmUser");
//编写执行函数
router.get('/', function(req, res, next) {

  console.log("get user");
  // res.send( (new teacher()).login_q());
});
router.post('/', function(req, res, next) {
  console.log("post user");

  let data = {
    id:1,
    avatarUrl:"avatarUrl" ,
  city:"city",
    country:"country",
    gender:"gender",
    language:"language",
    nickName:"nickName",
    openId:"openId",
    province:"province"
  };
  let parm = {
    id:1,
    use_avatarurl:data.avatarUrl,
    use_city:data.city,
    use_country:data.country,
    use_gender:data.gender,
    use_language:data.language,
    use_nickname:data.nickName,
    use_openid:data.openId,
    use_province:data.province
  };
  (new OrmUser()).upsert(parm, true)
    .then((rst)=>{
      res.send( rst);
    });
});

module.exports = router;
