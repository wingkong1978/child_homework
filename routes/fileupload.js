const multiparty = require("multiparty");

const express = require('express');
const router = express.Router();
const util = require('util');
//编写执行函数
router.post('/', function(req, res, next) {
  var form = new multiparty.Form({

  });

  form.parse(req, function(err, fields, files) {
    if (err) {
      res.writeHead(400, {'content-type': 'text/plain'});
      res.end("invalid request: " + err.message);
      return;
    }
    res.writeHead(200, {'content-type': 'text/plain'});
    res.write('received fields:\n\n '+util.inspect(fields));
    res.write('\n\n');
    res.end('received files:\n\n '+util.inspect(files));
  });
});

module.exports = router;
