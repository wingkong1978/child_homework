module.exports = {
	//@ref DbService
	db_conf:{
		db_app:{
			db_type:'mysql',
			db_host: 'saeacedemo.mysql.rds.aliyuncs.com',
			db_user: 'stockapidev',
			db_pass: 'Stock1234',
			db_name:'stockapidev',
			db_port: 3306
		}
		//db_app:{
		//	db_type:'sqlite3',//DbSqlite3
		//	db_host:'127.0.0.1',
		//	db_port:3456,
		//	db_file:'dev_stock.db',
		//	db_name:'dev_stock',
		//},
		//db_app_ro:{
		//	db_type:'mysql',
		//	db_host:'127.0.0.1',
		//	db_port:3306,
		//	db_user:'root',
		//	db_pass:'',
		//	db_name:'test',
		//	timezone:"UTC +8"//TODO
		//}
	},

	//TODO 旧的准备不用！！！:
	db: {
		mysql: {
			host: 'gz-cdb-bd5w58q3.sql.tencentcdb.com',
			user: 'wingkong',
			password: 'qazWSX12',
			database:'assign_homework',
			port: 62337,
			timezone:"UTC +8"
		}
	},
	wss: {
		url: "ws://127.0.0.1:3333"
	},
	session_store:{
		type:'MemcachedStore',
		hosts:['127.0.0.1:11211'],
		//secret: '123, easy as ABC. ABC, easy as 123' // Optionally use transparent encryption for memcache session data 
	},
	security: {
		algorithm: "rc4",
		encode_key: "abcd0000",
		decode_key: "abcd0000"
	},
	ssl: {
    private_key_file: "./_cert/dev_svr.key",
    certificate_file: "./_cert/dev_svr.pem"
	},
	threshold: {
		refresh_time: 24 * 60 * 60,
		inactive_time: 10 * 60          // task token失活时间
	}
};
