var express = require('express');
var router = express.Router();

//载入第三方模块
var ObjectId=require('objectid');

//引入multiparty模块
const multiparty=require('multiparty');
const fs=require('fs');
//载入mongdob驱动,并且创建一个MongoClient对象
const MongoClient=require("mongodb").MongoClient;
//指定服务器的地址，且指定连接哪个库
const url="mongodb://localhost:27017/blog";
/* 访问后台文章显示页面 */
router.get('/', function(req, res, next) {
  //res.render('posts', { title: 'Express' });
  //res.send('显示文章');
  //res.render('admin/article_list');
  //需要连接数据库。获取数据，渲染到模板页面
  MongoClient.connect(url,(err,db)=>{
    if(err) throw err;
    let posts=db.collection('posts');
    posts.find().toArray((err,result)=>{
      if(err) throw err;
      res.render('admin/article_list',{data:result});
    })
  })
});

//后台分类文章添加页面
router.get('/add', function(req, res, next) {
  //res.render('posts', { title: 'Express' });
  //res.send('后台分类文章添加表单页面');
  //需要连接数据库。获取数据，渲染到模板页面
  MongoClient.connect(url,(err,db)=>{
    if(err) throw err;
    let cats=db.collection('cats');
    cats.find().toArray((err,result)=>{
      if(err) throw err;
      res.render('admin/article_add',{cats:result});
    })
  })
});

//完成后台添加分类添加动作
router.post('/insert', function(req, res, next) {
  //res.render('posts', { title: 'Express' });
  //res.send('后台分类文章添加表单页面<a href="/admin/posts/add">返回</a>');
  // let cat=req.body.cat;
  // let title=req.body.title;
  // let summary=req.body.summary;
  // let content=req.body.content;
      let time=new Date();
        time=time.toLocaleString();
      let count=Math.ceil(Math.random()*100);
  // //第二步，连接数据库，完成插入动作
  // MongoClient.connect(url,(err,db)=>{
  //   if(err) throw err;
  //   let posts=db.collection('posts');
  //   posts.insert({
  //     cat:cat,
  //     title:title,
  //     summary:summary,
  //     content:content,
  //     time:time,
  //     coint:count
  //   },(err,result)=>{
  //     if(err){
  //       //res.send('添加分类失败<a href="/admin/cats/add">返回</a>');
  //       res.render('admin/message',{message:'添加文章失败',luy:'posts'});
  //     }else{
  //       //res.send('添加分类成功<a href="/admin/cats/add">返回</a>');
  //       res.render('admin/message',{message:'添加文章成功',luy:'posts'})
  //     }
  //   })
  // })
  
  //实例化一个form对象
  let form=new multiparty.Form({uploadDir:'public/tmp'});
  //使用form对象parse方法
  form.parse(req,(err,feilds,files)=>{
    console.log(feilds);
    console.log(files);
    fs.renameSync(files.cover[0].path,'public/uploads/'+files.cover[0].originalFilename);
    //将其它信息保存到数据库中
    //实例化一个对象
    let article={
        cat:feilds.cat[0],
        title:feilds.title[0],
        summary:feilds.summary[0],
        content:feilds.content[0],
        time:time,
        coint:count,
        //还需要保存图片的相对路径
        cover:'uploads/'+files.cover[0].originalFilename
    }

    //第二步，连接数据库，完成插入动作
    MongoClient.connect(url,(err,db)=>{
      if(err) throw err;
      let posts=db.collection('posts');
      posts.insert(article,(err,result)=>{
        if(err){
          //res.send('添加分类失败<a href="/admin/cats/add">返回</a>');
          res.render('admin/message',{message:'添加文章失败',luy:'posts'});
        }else{
          //res.send('添加分类成功<a href="/admin/cats/add">返回</a>');
          res.render('admin/message',{message:'添加文章成功',luy:'posts'})
        }
      })
    })
  
  })
});

//显示编辑后边分类的表单页面
router.get('/edit', function(req, res, next) {
  //res.render('posts', { title: 'Express' });
  //res.send('显示编辑后边分类的表单页面');
  let id=req.query.id;
  MongoClient.connect(url,(err,db)=>{
    if(err) throw err;
    let posts=db.collection('posts');
    posts.find({_id:ObjectId(id)}).toArray((err,result)=>{
      if(err) throw err;
      res.render('admin/article_edit',{cat:result[0]});
    })
  })
});
router.post('/update',(req,res)=> {
  //第一步，获取表单提交的信息
  let id=req.body.id;
  let cat=req.body.cat;
  let title=req.body.title;
  let summary=req.body.summary;
  let content=req.body.content;
  let time=new Date();
      time=time.toLocaleString();
  MongoClient.connect(url,(err,db)=>{
    if(err) throw err;
    let posts=db.collection('posts'); 
    posts.update({_id:ObjectId(id)},{$set:{      
        cat:cat,
        title:title,
        summary:summary,
        content:content,
        time:time}},{multi:true},(err,result)=>{
           if(err){
            //res.send('添加分类失败<a href="/admin/cats/add">返回</a>');
            res.render('admin/message',{message:'编辑文章失败',luy:'posts'});
            }else{
            //res.send('添加分类成功<a href="/admin/cats/add">返回</a>');
            res.render('admin/message',{message:'编辑文章成功',luy:'posts'})
        }

     })
  })
})
router.get('/delete',function(req,res,next){
  let id=req.query.id;
  MongoClient.connect(url,(err,db)=>{
    if(err) throw err;
    let posts=db.collection('posts');
    posts.remove({_id:ObjectId(id)},(err,result)=>{
      if(err){
        //res.send('添加分类失败<a href="/admin/cats/add">返回</a>');
        res.render('admin/message',{message:'删除文章失败',luy:'posts'});
      }else{
        //res.send('添加分类成功<a href="/admin/cats/add">返回</a>');
        res.render('admin/message',{message:'删除文章成功',luy:'posts'})
      }
    });
  })
})
module.exports = router;