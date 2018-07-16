const DBMysql = require("../_biz/DbMysql");

class teacher extends DBMysql{
 constructor(){
   super();
 }

 register_q(){

 }

 login_q(){
   console.log("login_q");
   return "teach login";
 }

}

module.exports = teacher;