var express = require('express');
var router = express.Router();

//载入mongdob驱动,并且创建一个MongoClient对象
const MongoClient=require("mongodb").MongoClient;
//指定服务器的地址，且指定连接哪个库
const url="mongodb://localhost:27017/blog";

/* GET users listing. */
router.get('/login', function(req, res, next) {
	//判断，如果已经登陆，则直接返回上一个页面
	if(req.session.isLogin){
		res.render('/admin');
	}else{
		res.render('admin/login');
	}

});
router.post('/singin',function(req,res,next){
	//获取用户提交的用户名和密码
	let username=req.body.username;
	let password=req.body.password;
	//需要连接数据库，进行比较
	MongoClient.connect(url,(err,db)=>{
		if(err) throw err;
		let user=db.collection('user');
		user.find({username:username,password:password}).toArray((err,result)=>{
			//result肯定是一个数组，如果用户名和密码正确了，数组中有一对象
			//如果用户名和密码错了，就是空数组
			if(result.length){
				//ok,保存登陆标识，然后跳转到后台首页面
				req.session.isLogin=true;
				res.redirect('/admin');
			}else{
				//用户名和密码错误
				res.redirect('/user/login');
			}
		})
	})
})
//用户注销
router.get('/logout',function(req,res,next){
	//req.session.isLogin=0;
	req.session.destroy();
	res.redirect('/user/login');
})
module.exports = router;
