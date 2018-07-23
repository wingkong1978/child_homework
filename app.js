
var express = require('express');//加载express模块
var path = require('path');//路径模块
var favicon = require('serve-favicon');//请求网页的logo
var logger = require('morgan');//在控制台中，显示req请求的信息
var cookieParser = require('cookie-parser');//这就是一个解析Cookie的工具。通过req.cookies可以取到传过来的cookie，并把它们转成对象。
var bodyParser = require('body-parser');//node.js 中间件，用于处理 JSON, Raw, Text 和 URL 编码的数据。

// 路由信息（接口地址），存放在routes的根目录
var index = require('./routes/index');
// var users = require('./routes/users');
// var add = require('./routes/add');
// var edit = require('./routes/edit');
// var del = require('./routes/del');
var fileupload = require('./routes/fileupload');
var teacher = require('./routes/teacher');
var users = require('./routes/users');
let openid = require('./routes/openid');
let test = require('./routes/test');
let schools = require('./routes/schools');
var app = express();

// 模板开始
app.set('views', path.join(__dirname, 'views'));//设置视图根目录
app.engine('html',require('ejs').__express);
app.set('view engine', 'html');
// app.set('view engine', 'jade');//设置视图格式（本人不太喜欢用jade，接下来会交大家使用html格式的文件）

// 载入中间件
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

//配置路由，（'自定义路径'，上面设置的接口地址）
app.use('/', index);
app.use('/testupload', (req,res)=>{
  res.render('testupload.html');
});
app.use('/upload', (req,res)=>{
  res.render('upload.html');
});
app.use('/fileupload', fileupload);
app.use('/teachers', teacher);
app.use('/schools', schools);
app.use('/users', users);
app.use('/openid', openid);
app.use('/test', test);
// app.use('/search', users);//查
// app.use('/add', add);//增
// app.use('/edit', edit);//改
// app.use('/del', del);//删
// app.use('/fileupload', views);//删

// 错误处理
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

var server = app.listen(3000, function () {
  var host = server.address().address;
  var port = server.address().port;

  console.log('Example app listening at http://%s:%s', host, port);
});

