const OrmBase = require("./OrmBase");
class OrmSchool extends OrmBase{
  constructor(){
    super();
    this.NAME_R = "t_classes";
    this.field_a=[
      "cla_name",
      "cla_school_id",
      "status",
      "lmt"
    ]
  }
}

module.exports=OrmSchool;