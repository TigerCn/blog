var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');

//载入session中间件
var session=require('express-session');

var index = require('./routes/home/index');
var user = require('./routes/admin/user');
var article=require('./routes/admin/posts.js');
var admin=require('./routes/admin/index.js');
//引入自定义模块posts.js
var posts=require('./routes/home/posts.js');
//引入自定义导航栏一级菜单模块
var second=require('./routes/home/second.js');
//引入自定义分页模块
var next=require('./routes/home/next.js');

//引入后台一级路由
var cats=require('./routes/admin/cats.js');

var app = express();

//使用session中间件
app.use(session({
	secret:'blog',
	resave:false,
	saveUninitialized:true,
	cookie:{}
}));
// view engine setup
app.set('views', path.join(__dirname, 'views'));
//app.set('view engine', 'ejs');

//设置将.hmlt文件作为模板
app.engine('html',require('ejs').__express);
app.set('view engine','html');
// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

//将后台的views/admin目录也进行静态托管
app.use(express.static(path.join(__dirname,'views/admin')));
app.use('/', index);
app.use('/user', user);

//针对/posts的请求，交给posts中间件来处理
app.use('/posts',posts);
app.use('/second',second);
app.use('/next',next);
//针对/cats的请求，交给cats的中间件处理
app.use('/admin/cats',cats);

//针对后台首页的请求
app.use('/admin',checkLogin);
//针对admin/posts的请求，交给article来处理
app.use('/admin/posts',article);

app.use('/admin',admin);

//针对admin/posts的请求，交给article来处理
app.use('/admin/posts',article);

//针对/admin/user/*的请求，交给user来处理，此处不要使用checkLogin
app.use('/admin/user',user);
// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

//自定义一个中间件，用于判断用户是否已经登陆
function checkLogin(req,res,next){
	//只要判断session中是否有登陆的标识
	if(!req.session.isLogin){
		//没有登陆，跳转到登陆页面
		res.redirect('/user/login');
		return;
	}
	//否则就是已经登陆，继续执行后续的代码
	next();
}
// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
