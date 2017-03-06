var express = require('express');
var router = express.Router();

const MongoClient=require('mongodb').MongoClient;
const url='mongodb://localhost:27017/blog';
const ObjectId=require('objectid');
//规定在首页上每个页面最多的文章数
const pagesize=5;
/* 访问博客首页 */
router.get('/', function(req, res, next) {
	//连接数据库，取出分类，文章信息
	MongoClient.connect(url,(err,db)=>{
		if(err) throw err;
		//获取分类信息
		let cats=db.collection('cats');
		cats.find().toArray((err,result1)=>{
			if(err) throw err;
			//result1是我们要的数据分类
			//还要获取文章信息
			let posts=db.collection('posts');
			posts.find().sort({time:-1}).limit(5).toArray((err,result2)=>{
				if(err) throw err;
				//result2是我们要的文章数据，并且规定一个页面最多显示5篇文章
				//还要获取热门的文章
				posts.find().sort({count:-1}).limit(8).toArray((err,result3)=>{
					//result3是我们要获取的前8个热门的文章
					if(err) throw err;
					let posts=db.collection('posts');
					posts.find().toArray((err,result4)=>{
						const total=Math.ceil(result4.length/pagesize);//总共的页数
						res.render('home/index', { cats: result1,posts:result2,hot:result3,total:total});
					})
				});
			})
		})
	})
});
module.exports = router;
