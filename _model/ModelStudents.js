const OrmStudent  = require("../_orm/OrmStudent");
class ModelStudents{
  GetStudentsByClassId(classId) {
    let ormStudent= new OrmStudent();
    let sql ="select * from t_students";
    let where = " status = 0 ";
    where += " and stu_class_id = " + classId;
    sql = sql + " where " + where
    console.log("sql-->",sql);
    return ormStudent.exec_q(sql)
      .then((rst) => {
        console.log("sql-result->",rst);
        let rows = rst.rows;
        let rtn = {};
        rtn.STS = "OK";
        rtn.data = rows;
        console.log("rtn-->",rtn);
        return rtn;
      })
  }
}
module.exports=ModelStudents;