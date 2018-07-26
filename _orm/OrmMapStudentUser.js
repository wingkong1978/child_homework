const OrmBase = require("./OrmBase");
class OrmMapStudentUser extends OrmBase{
  constructor(){
    super();
    this.NAME_R = "t_map_student_user";
    this.field_a=[
      "msu_student_id",
      "msu_user_id",
      "msu_relationship",
      "create_time",
      "status",
      "lmt"
    ]
  }
}

module.exports=OrmMapStudentUser;