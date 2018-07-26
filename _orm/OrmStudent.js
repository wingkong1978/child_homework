const OrmBase = require("./OrmBase");
class OrmStudent extends OrmBase{
  constructor(){
    super();
    this.NAME_R = "t_students";
    this.field_a=[
      'stu_class_id',
      "stu_name",
      "stu_no",
      "create_time",
      "status",
      "lmt"
    ]
  }
}

module.exports=OrmStudent;