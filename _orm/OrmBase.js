var DbMysql = require(__dirname + "/../_biz/DbMysql");
const AppTools = require("../_biz/AppTools");
const Q = require("q");
function qstr(s){ if(s==null) return "''"; return "'"+(""+s).replace(/'/g,"''")+"'"; }
function qstr_arr(a){ var rt_a=[]; for(var k in a){ rt_a.push(qstr(a[k])); } return rt_a.join(","); }
class OrmBase extends DbMysql
{
	constructor(){
		super();
	}
	searchList(filter,field_s){
		var table=this.NAME_R;//by Children
		if(!table) throw new Error("OrmBase.searchList() needs this.NAME_R");

		var field_a = [];
		var where_a = ["1"];
		for(var k in filter){
			var v = filter[k];
			field_a.push(k);
			where_a.push(""+k+"="+qstr(v));
		}
		var where_s = where_a.join(" AND ");
		if(!field_s)field_s="*";
		var sql=`SELECT ${field_s} FROM ${table} WHERE ${where_s}`;
		return this.select_q({sql});
	}

	//慢慢完善:
	//PageExecute({
	//	'SELECT':'*',
	//	'FROM':'test',
	//	'WHERE':'id=?',
	//	'ORDER':'XXX asc/desc',
	//	'LIMIT':6,//当pageNumber和pageSize不同时有但有它时，会生效....
	//	'pageNumber':2,
	//	'pageSize':3,
	//	'binding':[$id]
	//});
	//NOTES: 第二参数还有个作用，就是如果 有 pageNumber和pageSize时，max非正数的话还会跳过计算记录总数，这样能让翻页计算快很多（和少了一个 sql）.
	pageExecute(param, max=999){
		let _this = this;

		let select_s = "SELECT *";
		select_s = param["SELECT"]?"SELECT "+param["SELECT"] : select_s;

		let from_s = "";
		from_s = param["FROM"]?"FROM "+param["FROM"] : from_s;

		let where_s = "WHERE 1=1";
		where_s = param["WHERE"]?"WHERE "+param["WHERE"] : where_s;

		let order_s = "";
		let order = param["ORDERBY"]?param["ORDERBY"]:param["ORDER"];
		order_s = order?"ORDER BY "+order : order_s;

		let group_s = "";
		let group = param["GROUPBY"]?param["GROUPBY"]:param["GROUP"];
		group_s = group?"GROUP BY "+group : group_s;

		let paramageNumber=param["pageNumber"];
		let paramageSize=param["pageSize"];
		let binding=param["binding"];

		let limit_s ="";
		if (paramageNumber > 0 && paramageSize > 0){
			let limit_start = (paramageNumber - 1) * paramageSize;
			limit_s =` LIMIT ${limit_start},${paramageSize}`;
		}else{
			let limit=param["LIMIT"];
			if(limit>0){
				limit_s =` LIMIT ${limit}`;
			}else{
				//SafeNet
				limit_s =` LIMIT ${max}`;
			}
		}
		let sql=`${select_s} ${from_s} ${where_s} ${group_s} ${order_s} ${limit_s}`;
		let rst = {};
		rst["sql"]=sql;
		if(binding){
			rst["binding"]=binding;
		}
		
		return _this.select_q(sql,binding).then(rst=>{
			if(!AppTools.isOK(rst)) return rst;
			let rt = {"STS":"OK"};
			rt["rows"] = rst.rows;

			if (paramageNumber > 0 && paramageSize > 0 && max>0){
				let sql = `SELECT COUNT(*) AS total ${from_s} ${where_s} ${group_s}`;
				return _this.select_q(sql,binding).then(rst=>{
					if(!AppTools.isOK(rst)) return rst;
					let total = rst.rows[0]["total"];
					rt["maxRowCount"]=total;
					rt["total"]=total;
					return rt;
				});
			}else{
				//约定如果第二参数为负数，跳过取总这一步.
			}
			return rt;
		});
	}

	loadOne(id,field_s = "*"){
		var table=this.NAME_R;//by Children
		let _this = this;

		if(!table) throw new Error("OrmBase.loadOne() needs this.NAME_R");
		if(!id) throw new Error("OrmBase.loadOne() needs ID");

		let sql = `SELECT ${field_s} FROM ${table} WHERE id = ` + qstr(id);
		return  _this.select_q(sql);
	}
	upsert(param,flag_new = true){
		console.log("1")

		var table=this.NAME_R;//by Children
		var field_a = this.field_a;
		let _this = this;

		if(!table) throw new Error("OrmBase.upsert() needs this.NAME_R");

		let id = param["id"];
		let dfe = Q.defer();

		if(flag_new){
			param["status"] || (param["status"] = 0);
			param["create_time"] = getTimeStr();
		}

		param["lmt"] = getTimeStr();
		if(id){
			let sql = `SELECT id FROM ${table} WHERE id = ` + qstr(id);
			_this.select_q(sql)
				.then(function(rst){
					if(!AppTools.isOK(rst)) dfe.reject(rst);
					let rows = rst.rows;
					if(rows.length>0){
						let update_str = [];
						for(var k in param){
							if(field_a.indexOf(k) == "-1") continue;
							var v = param[k];
							update_str.push(""+k+"="+qstr(v));
						}

						let sql = `UPDATE ${table} SET ` + update_str.join(",") + " WHERE id = " + qstr(id);
						 _this.exec_q(sql).then(function(rst){
							if(!AppTools.isOK(rst)) dfe.reject(rst);
							if(rst.af > 0)
								dfe.resolve({"STS":"OK","lastID":id});
							else
								dfe.reject("Update Error!No affectedRows!");
						},function(err){
							dfe.reject(err);
						});
					}else{
						if(flag_new){
							dfe.resolve();
						}else{
							dfe.reject("Row Not Found!Table:"+table+" ID:"+id);
						}
					}
				},function(err){
					dfe.reject(err);
				});
		}else{
			setTimeout(function(){
				if(flag_new)
					dfe.resolve();
				else
					dfe.reject("Need ID");
			},10);
		}

		return dfe.promise.then(function(rst){
			if(AppTools.isOK(rst))
				return rst;

			let insert_str = [];
			let field_s = [];
			let value_s = [];
			for(var k in param){
				if(field_a.indexOf(k) == "-1") continue;
				let v = param[k];
				field_s.push(k);
				value_s.push(qstr(v));
			}
			let sql = `INSERT INTO ${table} (` + field_s.join(",") + ") VALUE (" + value_s.join(",") + ")";
			return  _this.exec_q(sql).then(function(rst){
				if(!AppTools.isOK(rst)) return rst;
				return {"STS":"OK","lastID":rst.lastID};
			});
		},function(err){
			return {"STS":"KO","errmsg":AppTools.o2s(err)};
		});
	}

	insert(param, flag_just_id = false){
		let _this = this;
		return _this.upsert(param, true).then(function(rst){
			if(!AppTools.isOK(rst))
				return rst;
			if(flag_just_id) return {"STS":"OK","id":rst.lastID};

			return _this.loadOne(rst.lastID).then(rst=>{
				if(!AppTools.isOK(rst))
					return rst;
				return {"STS":"OK","row":rst.rows[0]};
			});
		},function(err){
			return {"STS":"KO","errmsg":AppTools.o2s(err)};
		});
	}

	update(param, flag_just_id = true){
		let _this = this;
		return _this.upsert(param, false).then(function(rst){
			if(!AppTools.isOK(rst))
				return rst;
			if(flag_just_id) return {"STS":"OK","id":rst.lastID};

			return _this.loadOne(rst.lastID).then(rst=>{
				if(!AppTools.isOK(rst))
					return rst;
				return {"STS":"OK","row":rst.rows[0]};
			});
		},function(err){
			return {"STS":"KO","errmsg":AppTools.o2s(err)};
		});
	}

	markDelete(id){
		let table=this.NAME_R;//by Children
		let _this = this;

		if(!id) throw new Error("needs ID");
		let sql = `UPDATE ${table} SET status = -1,lmt=NOW() WHERE `;
		if(typeof(id) == "string" || typeof(id) == "number")
			sql += " id = "+qstr(id);
		else if(id.toString() == "Array"){
			let value_a = [];
			for(let v of id){
				value_a.push(qstr(v));
			}
			sql += " id IN ("+value_a.join(",")+")";
		}
		return _this.exec_q(sql).then(function(rst){
			return rst;
		},function(err){
			return {"STS":"KO","errmsg":AppTools.o2s(err)};
		});
	}
	//	select(){
	//TODO 用父类的 select_q 来拼凑?
	//	}
	//	是select的 alias
	//	select_q(){
	//	}
	//	upsert(){
	//	}
	//	insert(){
	//	}
	//	update(){
	//	}
	//	markDelete(){
	//	}


	/////////////////////////////////////////////////////////////////////////////
	//	//这个应该在DbService那里实现了所以应该是不需要的
	//	//findAndUpsert(){}
	//
	//	//下面几个完全不急实现.
	//	realDelete(){
	//	}
	//	markDeleteAll(){
	//	}
	//	realDeleteAll(){
	//	}
}
module.exports=OrmBase;
