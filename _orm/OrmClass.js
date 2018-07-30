const OrmBase = require("./OrmBase");
class OrmSchool extends OrmBase{
  constructor(){
    super();
    this.NAME_R = "t_classes";
    this.field_a=[
      "cla_name",
      "cla_school_id",
      "cla_teacher_pwd",
      "cla_parent_pwd",
      "create_time",
      "status",
      "lmt"
    ]
  }
}

module.exports=OrmSchool;