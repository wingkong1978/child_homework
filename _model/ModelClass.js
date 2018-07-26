const OrmClass  = require("../_orm/OrmClass");
class ModelClass {
  checkParentRelationShipExists(classId,userId) {
    let ormClass = new OrmClass();
    let sql ="SELECT * FROM t_classes cla LEFT JOIN t_students stu ON cla.`id` = stu.`stu_class_id` LEFT JOIN t_map_student_user msu ON stu.`id` = msu.`msu_student_id`";
    let where = " where 1 = 1 ";
    where += " and msu_user_id =" + userId ;
    where += " and cla.id = " + classId;
    console.log("sql-->",sql);
    return ormClass.exec_q(sql + where)
      .then((rst) => {
        console.log("sql-result->",rst);
        let rows = rst.rows;
        let rtn = {};
        let student_name ="";
        let relationship ="";
        console.log(rows);
        if(rows.length>0){
          student_name  = rows[0]['stu_name'];
          relationship  = rows[0]['msu_relationship'];
          rtn={
            student_name:student_name,
            relationship:relationship,
            relationshipname:student_name +" " + relationship
          }
        }
        console.log("rtn-->",rtn);
        return rtn;
      })
  }
}
module.exports=ModelClass;