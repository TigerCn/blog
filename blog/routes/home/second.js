var express = require('express');
var router = express.Router();

const MongoClient=require('mongodb').MongoClient;
const url='mongodb://localhost:27017/blog';
const ObjectId=require('objectid');

//markdown的引入及实例化
const markdown=require('markdown').markdown;

//规定在二级页上每个页面最多的文章数
const pagesize=2;

/* 访问二级文章页面 */
router.get('/',function(req,res,next){
	let title=req.query.title;
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
			posts.find({cat:title}).toArray((err,result2)=>{
				if(err) throw err;
				//result2是我们要的导航栏连接的文章数据
				//还要获取热门的文章
				posts.find().sort({count:-1}).limit(8).toArray((err,result3)=>{
					if(err) throw err;
					res.render('home/fenlei', {cats:result1,posts:result2,hot:result3});
				})
			})
		})
	})
});
module.exports = router;