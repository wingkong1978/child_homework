const OrmAnnouncement  = require("../_orm/OrmAnnouncement");
class ModelAnnouncement {
  getAnnouncementDetail(id) {
    let ormAnnouncement = new OrmAnnouncement();
    let sql = "SELECT ann.*, imf.`imf_path` FROM t_announcement ann LEFT JOIN t_image_files imf ON ann.id = imf.`imf_annc_id`";
    let where = " where 1 = 1 ";
    where += " and ann.id=" + id;
    console.log("sql-->",sql);
    return ormAnnouncement.exec_q(sql + where)
      .then((rst) => {
        console.log("sql-result->",rst);
        return rst;
      })
  }
}
module.exports=ModelAnnouncement;
