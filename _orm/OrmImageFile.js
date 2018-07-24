const OrmBase = require("./OrmBase");
class OrmImageFile extends OrmBase{
  constructor(){
    super();
    this.NAME_R = "t_image_files";
    this.field_a=[
      "imf_path",
      "imf_annc_id",
      "imf_homework_id",
      "imf_punch_id",
      "create_time",
      "status",
      "lmt"
    ]
  }
}

module.exports=OrmImageFile;