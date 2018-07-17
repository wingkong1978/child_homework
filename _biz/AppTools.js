module.exports = function(Application) {
	const {
		Q,fs,os,logger,stackInfo,server_id,log4js
		,o2s,s2o,devlog,isEmpty,isOK,getTimeStr,quicklog
		,loadLgc,loadBiz,loadBizCls,
	}=Application;
	
	function writeOperLog(oper_id,oper_type,oper_ip,oper_content){
		let ormInfo = {
			'opl_oper_id':oper_id,
			'opl_type':oper_type,
			'opl_ip':oper_ip,
			'opl_content':oper_content,
		};

		return loadBiz('BizOperLog').insert(ormInfo,true);
	}

	function writeAppLog(message,level){
		let Applog = new (require('./_api/ApiLog'))(Application);
		Applog.info = stackInfo();
		Applog.filename = 'DateTime';
		Applog.write(message,level);
	}

	function checkVerify(_val, _role_str) {
		if (_role_str.indexOf('require') == -1 && !_val)
			return true;
		var _roles = _role_str.split(',');
		var _sts = true;
		for (var i in _roles) {
			var _role = _roles[i];
			switch (_role) {
				case 'require':
					if (!_val)
						_sts = false;
					break;
				case 'name':
					if (!/^([\w]|[\u4e00-\u9fa5])+$/.test(_val))
						_sts = false;
					break;
				case 'char':
					if (!/^[a-zA-Z0-9\-_\.]+$/.test(_val))
						_sts = false;
					break;
				case 'email':
					if (!/^([a-zA-Z0-9]+[_|\_|\.]?)*[a-zA-Z0-9]+@([a-zA-Z0-9]+[_|\_|\.]?)*[a-zA-Z0-9]+\.[a-zA-Z]{2,3}$/.test(_val))
						_sts = false;
					break;
				case 'phone':
					if (!/^1[0-9]{10}$/.test(_val))
						_sts = false;
					break;
				case 'int':
					if (!/^[0-9]*$/.test(_val))
						_sts = false;
					break;
				case 'number':
					if (isNaN(_val))
						return false;
					break;
				case 'date':
					if (!/^(^(\d{4}|\d{2})(\-|\/|\.)\d{1,2}\3\d{1,2}$)|(^\d{4}年\d{1,2}月\d{1,2}日$)$/.test(_val))
						_sts = false;
					break;
				case 'array':
					//console.log('isArray',!Object.prototype.toString.call(_val) === '[object Array]');
					if(!(Object.prototype.toString.call(_val) === '[object Array]'))
						_sts = false;
					break;
				case 'object':
					//console.log('isObject',!Object.prototype.toString.call(_val) === '[object Object]');
					if(!(Object.prototype.toString.call(_val) === '[object Object]'))
						_sts = false;
					break;
					break;
				case 'datetime':
					//console.log('isDatetime',/^[1-9]\d{3}-(0[1-9]|1[0-2])-(0[1-9]|[1-2][0-9]|3[0-1])\s+(20|21|22|23|[0-1]\d):[0-5]\d:[0-5]\d$/.test(_val));
					if (!/^[1-9]\d{3}-(0[1-9]|1[0-2])-(0[1-9]|[1-2][0-9]|3[0-1])\s+(20|21|22|23|[0-1]\d):[0-5]\d:[0-5]\d$/.test(_val))
						_sts = false;
					break;
				default:
					_role;
					_sts = false;
				break;
			}
			if (!_sts) break;
		}
		return _sts;
	}

	function getTimeStrExt(time, format = "YYYY-MM-DD HH:mm:ss.SSS") {
		if (!time || time=='NULL' || time=='null' || time=='undefined' || time=="0000-00-00 00:00:00") return "";
		return getTimeStr(time, format);
	}

	function qstr(s) {
		if (s == null) return "''";
		return "'" + ("" + s).replace(/'/g, "''") + "'";
	}

	function sprintf() {
		var arg = arguments,
			str = arg[0] || '',
			i, n;
		for (i = 1, n = arg.length; i < n; i++) {
			str = str.replace(/%s/, arg[i]);
		}
		return str;
	}
	function contains(arr,obj){
		var i = arr.length;
		while (i--) {
			if (arr[i] === obj) {
				return true;
			}
		}
		return false;
	}

	function generateFilter(obj,colConfig,type="AND"){
		let _a = [];
		let	_rt = "";
		for(let k in obj){
			let _v = obj[k];
			let _str = "";
			let {key,value,OR,AND} = _v;
			if(OR){
				_str = generateFilter(OR,colConfig,"OR");
			}else if(AND){
				_str = generateFilter(AND,colConfig,"AND")
			}else{
				let _conf = colConfig[key] || {col:key};
				let operator = _conf.operator?_conf.operator:"=";
				let _col = _conf.col;
				if(value === '' || value === undefined || value === false) continue;
				if(operator.toLowerCase()  == "like")
					_str = _col + " LIKE '%"+value+"%'";
				else
					_str = _col+" "+operator+" " +qstr(value);
			}
			if(!_str || _str == " " || _str == "()") continue;
			_a.push(_str);
		}
		if(_a.length>1)
			_rt = "("+_a.join(" "+type+" ")+")";
		else if (_a.length==1)
			_rt = _a[0];
		return _rt;
	}
	
	function generateSort(sort,colConfig){
		let orderBy = "";
		for(let k in sort){
			if (!colConfig[k]) continue;
			let _col = colConfig[k]['col'];
			let _type = sort[k] == "ASC"?"ASC":"DESC";
			if(!_col) continue;
			orderBy += ","+_col+" "+_type;
		}
		orderBy = orderBy.substr(1);
		return orderBy;
	}

	function http_post_q(config, data) {
		let {web_host,method="POST",path="/",port="80",content_type='application/json; charset=UTF-8',timeout=4000} = config;
		// console.log("config",config);
		// console.log("web_host",web_host);
		let dfe = Q.defer();
		let http = require('http');
		//发送 http Post 请求  
		var postData = o2s(data);
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
					dfe.resolve(s2o(res_data));
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

	return {
		__filename,
		writeOperLog,
		writeAppLog,
		checkVerify,
		getTimeStrExt,
		qstr,
		sprintf,
		contains,
		generateFilter,
		generateSort,
		http_post_q
	}
}