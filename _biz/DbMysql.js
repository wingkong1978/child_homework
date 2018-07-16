const mysql=require('mysql');
const tools = require("./tools");
const Q = require("q");
const config = require('../_conf/config');
var _pool=null;
var debug=null;
function qstr(s){ if(s==null) return "''"; return "'"+(""+s).replace(/'/g,"''")+"'"; }
function qstr_arr(a){ var rt_a=[]; for(var k in a){ rt_a.push(qstr(a[k])); } return rt_a.join(',') }
class DbMysql 
{
	constructor(db_app_name){
		let conf = tools.getConf();
		let db_conf = conf.db_conf;
		if(!db_app_name) db_app_name='db_app';
		let db_app = db_conf[db_app_name];

		console.log("_poool-<",_pool);
		if(!_pool){
			let {db_host,db_user,db_pass,db_port,db_name,db_timezone}=db_app;
			//TODO 稍后在 DbMysql里面重构下面相关代码.
			_pool = mysql.createPool({
				host: db_host,
				user: db_user,
				password: db_pass,
				database: db_name,
				port:db_port,
				timezone:db_timezone||""//TODO 稍后测试...
			});
		}
	}

	//@USAGE exec_q(sql,binding) or exec_q({sql,binding})
	// binding 是一个数组，sql用问号作为参数，
	// Sample: exec_q("select * from t_users where user_name = ? and user_password=?;",["zhangsan","xxx"]);
	exec_q(sql,binding){
		if(typeof(sql)=='object'){
			var {sql,binding}=sql;
		}
		//TODO 还要补超时的处理...
		var dfr = Q.defer();
		_pool.getConnection((err,conn)=>{
			if (!!err) {
				if(!!err){dfr.reject(err)}
				return;
			}
			logger.log('TMP DBG sql=',sql);
			conn.query(sql, binding, function(err, rst) {
				logger.log("main process?==",process.mainFlag);
				if(process.mainFlag===undefined)
          conn.destroy();
				else{
          conn.release();
				}
				if(!!err){dfr.reject(err)}
				else{dfr.resolve({STS:'OK',rows:rst.rsa||rst,lastID:rst.insertId,af:rst.affectedRows})}
			});
		});
		return dfr.promise;
	}

	select_q(sql,binding){
		return this.exec_q(sql,binding);
	}

	//p=>{table,toUpdate,toFind,insert_first,db}
	findAndUpsert_q(q){
		var {Q,logger,s2o,isOK,debug}=Application;
		var {table,toUpdate,toFind,insert_first,db}=q;
		var s_kv="",a_kv=[],
			s_w="",a_w=[],
			s_v="",a_v=[],
			s_k="",a_k=[];
		for(var k in toFind){
			var v=toFind[k];
			a_w.push(""+k+"="+qstr(v));
		}
		var where="WHERE "+a_w.join(" AND ");
		for(var k in toUpdate){
			var v=toUpdate[k];
			a_v.push(qstr(v)+" AS "+k);
			//a_k.push(qstr(k));//mysql 不支付字段名用 ' ??
			a_k.push(k);
			a_kv.push(""+k+"="+qstr(v));
		}
		s_k=a_k.join(",");
		s_v=a_v.join(",");
		s_kv=a_kv.join(",");

		var tmp_table='TMP_'+(new Date()).getTime();

		var sql_1 = `INSERT INTO ${table} (${s_k})
SELECT * FROM (SELECT ${s_v}) AS ${tmp_table}
WHERE NOT EXISTS (SELECT 'Y' FROM ${table} ${where} LIMIT 1)`;

		var sql_2=`UPDATE ${table} SET ${s_kv} ${where}`;

		var lastID=-1;
		var af=-1;

		var exec_q = this.exec_q;
		//TODO .af 和 .lastID 未得，待FIX!!!
		if(insert_first){
			//try insert first
			return exec_q(sql_1)
				.then(rst=>{
					lastID=rst.lastID;
					return exec_q(sql_2)
						.then(rst=>{
							af=rst.af;
							return Q({STS:af>0?'OK':'KO',lastID,af})
						})
				})
				.fail(err=>{
					if(debug>0)
						logger.log('DEBUG findAndUpsert_q.err=',err,sql_1,sql_2);
					return Q.reject(err)
				})
		}else{
			//try update first (default)
			return exec_q(sql_2)
				.then(rst=>{
					af=rst.af;
					if(af>0){
						return Q({STS:"OK",lastID,af})
					}else{
						return exec_q(sql_1)
							.then(rst=>{
								lastID=rst.lastID;
								return Q({STS:lastID>0?'OK':'KO',lastID,af})
							})
					}
				})
				.fail(err=>{
					if(debug>0)
						logger.log('DEBUG findAndUpsert_q.err=',err,sql_1,sql_2);
					return Q.reject(err)
				})
		}
	}
}
module.exports=DbMysql;
