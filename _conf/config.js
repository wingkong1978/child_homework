//读入开关文件（注意：开关文件不放在REPO代码仓）:
var	config_name = require('../config.switch.js').config_name;
var conf = require('./conf.' + config_name + '.js');
if(!conf){
	throw new Error('not found config for '+config_name);
}

//暂时未用(后面要做到配置更新自动生效)
//if (!conf.threshold) {
//	conf.threshold = {refresh_time: 24 * 60 * 60};
//}

module.exports = conf;
