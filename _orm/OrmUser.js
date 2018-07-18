const OrmBase = require("./OrmBase");
class OrmUser extends OrmBase{
  constructor(){
    super();
    this.NAME_R = "t_users";
    this.field_a=[
      "use_nickname   ",
      "use_country    ",
      "use_avatarurl  ",
      "use_city       ",
      "use_gender     ",
      "use_language   ",
      "use_openid     ",
      "use_province   "
    ]
  }
}

module.exports=OrmUser;