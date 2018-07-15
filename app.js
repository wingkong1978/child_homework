var express = require('express');
var app = express();

app.get('/', function (req, res) {
  let rnd = Math.floor(Math.random()*10+1);
  if(rnd%2===1){
    res.send('我系宝宝猪！！！！');
  }
  else{
    res.send('我系猪头仔！！！！');
  }
});

var server = app.listen(3000, function () {
  var host = server.address().address;
  var port = server.address().port;

  console.log('Example app listening at http://%s:%s', host, port);
});