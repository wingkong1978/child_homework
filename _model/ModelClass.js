const OrmClass  = require("../_orm/OrmClass");
class ModelClass {
  checkParentRelationShipExists(classId,userId) {
    let ormClass = new OrmClass();
    let sql ="SELECT * FROM t_classes cla LEFT JOIN t_students stu ON cla.`id` = stu.`stu_class_id` LEFT JOIN t_map_student_user_relationship msu ON stu.`id` = msu.`msu_student_id`";
    let where = " where 1 = 1 ";
    where += " and msu_user_id =" + userId ;
    where += " and cla.id = " + classId;
    sql = sql + where;
    console.log("sql-->",sql);
    return ormClass.exec_q(sql )
      .then((rst) => {
        console.log("sql-result->",rst);
        let rows = rst.rows;
        let rtn = {};
        let student_name ="";
        let relationship ="";
        console.log(rows);
        rtn.STS= "OK";
        if(rows.length>0){
          student_name  = rows[0]['stu_name'];
          relationship  = rows[0]['msu_relationship'];

          rtn.data={
            length:rows.length,
            student_name:student_name,
            relationship:relationship,
            relationshipname:student_name +" " + relationship
          }
        }else{
          rtn.data={lenth:rows.length};
        }
        console.log("rtn-->",rtn);
        return rtn;
      })
  }
}
module.exports=ModelClass;