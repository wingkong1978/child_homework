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
        let rows = rst.rows;
        let rtn = {};
        for(let i=0,len=rows.length;i<len;i++){
          rtn['id']=rows[i]['id'];
          rtn['ann_class_id']=rows[i]['ann_class_id'];
          rtn['ann_title']=rows[i]['ann_title'];
          rtn['ann_details']=rows[i]['ann_details'];
          rtn['ann_create_user']=rows[i]['ann_create_user'];
          rtn['create_time']=rows[i]['create_time'];
          rtn['iamgefiles'][i]={
            imgPath:rows[i].imf_path
          }
        }

        return rtn;
      })
  }
}
module.exports=ModelAnnouncement;
