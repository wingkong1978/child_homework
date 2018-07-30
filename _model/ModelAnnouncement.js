const OrmAnnouncement  = require("../_orm/OrmAnnouncement");
const OrmMapUserAnnc = require("../_orm/OrmMapUserAnnc");
const AppTools = require("../_biz/AppTools");
class ModelAnnouncement {
  constructor(){
    this.ormAnnouncement = new OrmAnnouncement();
  }
  getAnnouncementDetail(id) {
    // let ormAnnouncement = new OrmAnnouncement();
    let sql = "SELECT ann.*, imf.`imf_path` FROM t_announcement ann LEFT JOIN t_image_files imf ON ann.id = imf.`imf_annc_id`";
    let where = " where 1 = 1 ";
    where += " and ann.id=" + id;
    console.log("sql-->",sql);
    return this.ormAnnouncement.exec_q(sql + where)
      .then((rst) => {
        console.log("sql-result->",rst);
        let rows = rst.rows;
        let rtn = {};
        let imgFiles = [];
        for(let i=0,len=rows.length;i<len;i++){
          console.log("rowss-->",rows[i]);
          rtn['id']=rows[i]['id'];
          rtn['ann_class_id']=rows[i]['ann_class_id'];
          rtn['ann_title']=rows[i]['ann_title'];
          rtn['ann_details']=rows[i]['ann_details'];
          rtn['ann_create_user']=rows[i]['ann_create_user'];
          rtn['create_time']=AppTools.getTimeStr(rows[i]['create_time'],'YYYY-MM-DD HH:mm:ss');
          imgFiles.push(rows[i]['imf_path']);
        }
        rtn['imgFiles']=imgFiles;

        console.log("rtn-->",rtn);
        return rtn;
      })
  }

  updateAnnouncementUserRead(anncid,userid){
    let ormMapUserAnnc = new OrmMapUserAnnc();

    let parm ={
      mua_user_id:userid,
      mua_annc_id : anncid,
    };
    console.log("update announcement read-->",parm);
    return ormMapUserAnnc.upsert(parm,true);
  }

  getAnnouncementReadList(anncid){
    console.log("read list-->",anncid);
    let sql = ["SELECT * FROM t_map_student_user msu JOIN t_students stu ON msu.`msu_student_id` = stu.`id`  WHERE (stu.`stu_class_id`,msu.`msu_user_id`)",
      "IN ( SELECT ann_class_id,mua_user_id FROM t_announcement annc JOIN t_map_user_annc mua ON annc.id = mua.`mua_annc_id` JOIN t_users usr ON mua.`mua_user_id` = usr.`id` where annc.id=" +anncid,
      ");"].join("");
    console.log("read list-->",sql);
    return this.ormAnnouncement.exec_q(sql);
  }
}
module.exports=ModelAnnouncement;
