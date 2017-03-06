var express = require('express');
var router = express.Router();

const MongoClient=require('mongodb').MongoClient;
const url='mongodb://localhost:27017/blog';
const ObjectId=require('objectid');

//markdown的引入及实例化
const markdown=require('markdown').markdown;
/* 访问文章页面 */
router.get('/', function(req, res, next) {
	let id=req.query.id;
	//获取文章
	//MongoClient.connect(url,(err,db)=>{
	// 	if(err) throw err;
	// 	let posts=db.collection('posts');
	// 	posts.find({_id:ObjectId(id)}).toArray((err,result)=>{
	// 		if(err) throw err;
	// 		let article={
	// 			title:result[0].title,
	// 			time:result[0].time,
	// 			coint:result[0].coint,
	// 			summary:result[0].summary,
	// 			content:result[0].content
	// 		}
 //  			res.render('home/posts', { data:article});
	// 	})
	// })
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
			posts.find().toArray((err,result2)=>{
				if(err) throw err;
				//result2是我们要的文章数据
				//result3还要获取热门的文章
				posts.find().sort({count:-1}).limit(8).toArray((err,result3)=>{
					if(err) throw err;
					let posts=db.collection('posts');
					posts.find({_id:ObjectId(id)}).toArray((err,result)=>{
						if(err) throw err;
						//article是我们要跳转到的具体文章的页面
						let article={
							cat:result[0].cat,
							title:result[0].title,
							time:result[0].time,
							coint:result[0].coint,
							summary:result[0].summary,
							content:result[0].content
						}
						res.render('home/posts', { cats:result1,posts:result2,hot:result3,data:article});
					})
				})
			})
		})
	})
});
module.exports = router;
