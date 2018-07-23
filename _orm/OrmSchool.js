const OrmBase = require("./OrmBase");
class OrmSchool extends OrmBase{
  constructor(){
    super();
    this.NAME_R = "t_schools";
    this.field_a=[
      "sch_name",
      "status",
      "lmt"
    ]
  }
}

module.exports=OrmSchool;