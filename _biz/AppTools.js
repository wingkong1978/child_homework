
const Q = require("q");
const moment = require('moment-timezone');//for datetime
moment.tz.setDefault("Asia/Hong_Kong");
class AppTools {


  static o2s(o){try{return JSON.stringify(o);}catch(ex){}};
  static s2o(s){try{return(new Function('return '+s))()}catch(ex){}};

  static getTimeStr(dt,fmt){
    if(!dt)dt=new Date();
    if(!fmt)fmt='YYYY-MM-DD HH:mm:ss.SSS';
    return moment(dt).format(fmt);
  };
  static getToday(dt,fmt){
    if(!dt)dt=new Date();
    if(!fmt)fmt='YYYY-MM-DD';
    return moment(dt).format(fmt);
  };
  static isOK(rst){return(rst&&rst.STS=='OK')}
	static http_post_q(config, data,https=false) {
		let {web_host,method="POST",path="/",port="80",content_type='application/json; charset=UTF-8',timeout=4000} = config;
		// console.log("config",config);
		// console.log("web_host",web_host);
		let dfe = Q.defer();
		let http = null;
		if(https){
		 http=require("https")
    }else{
      http = require('http');
    }
		//发送 http Post 请求
		var postData = AppTools.o2s(data);
		var options = {
			hostname: web_host,
			method: method,
			path:path,
			headers: {
				'Content-Type': content_type,
				'Content-Length': Buffer.byteLength(postData)
			}
		}
		let res_data = "";
		var req = http.request(options, function(res) {
			res.setEncoding('utf-8');
			res.on('data', function(chun) {
				res_data += chun;
			});
			res.on('end', function() {
				if(!res_data)
					res_data = '{"STS":"KO","errmsg":"Connect '+path+' error!"}';
				if(content_type == "application/xml; charset=UTF-8")
					dfe.resolve(res_data);
				else
					dfe.resolve(AppTools.s2o(res_data));
			});
		});
		req.on('error', function(err) {
			dfe.resolve({"STS":"KO","err":err});
		});
		req.write(postData);
		req.end();

		setTimeout(function(){
			dfe.resolve({"STS":"KO","errmsg":"ThirdReqTimeout"});
      req.abort();
    },timeout);

		return dfe.promise;
	}
}

module.exports = AppTools;