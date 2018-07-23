const OrmBase = require("./OrmBase");
class OrmAnnouncement extends OrmBase{
  constructor(){
    super();
    this.NAME_R = "t_announcement";
    this.field_a=[
      "ann_class_id",
      "ann_title",
      "ann_details",
      "ann_create_user",
      "create_time",
      "status",
      "lmt"
    ]
  }
}

module.exports=OrmAnnouncement;