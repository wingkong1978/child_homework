const OrmAnnouncement  = require("../_orm/OrmAnnouncement");
class modelAnnouncement {
  getAnnouncementDetail(id) {
    let ormAnnouncement = new OrmAnnouncement();
    let sql = "SELECT ann.*, imf.`imf_path` FROM t_announcement ann LEFT JOIN t_image_files imf ON ann.id = imf.`imf_annc_id`";
    let where = " where 1 = 1 ";
    where += " and ann.id=" + id;
    ormAnnouncement.exec_q(sql + where)
      .then((rst) => {
        return rst;
      })
  }
}
