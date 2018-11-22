const OrmBase = require("./OrmBase");
class OrmTest extends OrmBase{
  constructor(){
    super();
    this.NAME_R = "t_test";
    this.field_a=[
      "t1",
      "t2"
    ]
  }
}

module.exports=OrmTest;
