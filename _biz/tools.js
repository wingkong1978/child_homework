
const config = require('../_conf/config')||{};
 class tools{
  static getConf (pathOrKey) {
    //var pathOrKey=arguments[0]||"";
    if(!pathOrKey) pathOrKey = "";
    let r=config;
    let c=pathOrKey.split('.');
    for(let i=0;i<c.length;i++){let k=c[i];if(!k)break;r[k]||(r[k]={});r=r[k];}
    //return r;
    return tools.isEmpty( r ) ? null:r;
  }
   static isOK(rst){return(rst&&rst.STS==='OK')}
   static isEmpty(o,i){for(let i in o){return!1}return!0}
   static isAllOK(ra){ let b=false; for(let k in ra){ if(!isOK(ra[k]))return false; b=true; } return b; }
}

module.exports = tools;