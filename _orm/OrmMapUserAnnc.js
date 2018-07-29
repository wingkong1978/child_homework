const OrmBase = require("./OrmBase");
class OrmMapUserAnnc extends OrmBase{
  constructor(){
    super();
    this.NAME_R = "t_map_user_annc";
    this.field_a=[
      "mua_user_id",
      "mua_annc_id",
      "create_time",
      "status",
      "lmt"
    ]
  }
}

module.exports=OrmMapUserAnnc;