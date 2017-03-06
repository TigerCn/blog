var express = require('express');
var router = express.Router();
//加入第三方模块
const ObjectId=require('objectid');
//载入mongdob驱动,并且创建一个MongoClient对象
const MongoClient=require("mongodb").MongoClient;
//指定服务器的地址，且指定连接哪个库
const url="mongodb://localhost:27017/blog";
//所有以/admin/cats/打头的路由，都会走这儿
//凡是cats后面的/的内容，可以再次进行路由处理
// /admin/cats/ 交给 / 
// /admin/cats/add 交给 /add 
// /admin/cats/edit 交给 /edit 
/* 访问后台分类显示页面 */
router.get('/', function(req, res, next) {
  //res.render('posts', { title: 'Express' });
  //res.send('显示分类');
  //res.render('admin/category_list');
  //需要连接数据库。获取数据，渲染到模板页面
  MongoClient.connect(url,(err,db)=>{
    if(err) throw err;
    let cats=db.collection('cats');
    cats.find().toArray((err,result)=>{
      if(err) throw err;
      res.render('admin/category_list',{data:result});
    });
  })
});

//后台分类添加页面
router.get('/add', function(req, res, next) {
  //res.render('posts', { title: 'Express' });
  //res.send('后台分类添加页面');
  res.render('admin/category_add');
});

//完成后台添加分类添加动作
router.post('/insert', function(req, res, next) {
  //res.render('posts', { title: 'Express' });
  //res.send('完成后台添加分类添加动作<a href="/admin/cats/add">返回</a>');
  //第一步，获取表单提交的内容title和sort
  console.log(req.body);
  let title=req.body.title;
  let sort=req.body.sort;
  //第二步，需要连接数据库，将这个数据形成集合插入到mongodb中
  MongoClient.connect(url,(err,db)=>{
    if(err) throw err;
    //获取集合
    let cats=db.collection('cats');
    cats.insert({title:title,sort:sort},(err,result)=>{
      //此处不要写res，会覆盖掉serverresponse对象
      if(err){
        //res.send('添加分类失败<a href="/admin/cats/add">返回</a>');
        res.render('admin/message',{message:'添加分类失败',luy:'cats'});
      }else{
        //res.send('添加分类成功<a href="/admin/cats/add">返回</a>');
        res.render('admin/message',{message:'添加分类成功',luy:'cats'})
      }
    })
  })
});

//删除分类
router.get('/delete', (req,res)=> {
  //需要获取id
  let id=req.query.id;
  MongoClient.connect(url,(err,db)=>{
    if(err) throw err;
    let cats=db.collection('cats');
    cats.remove({_id:ObjectId(id)},(err,result)=>{
      if(err){
        //res.send('添加分类失败<a href="/admin/cats/add">返回</a>');
        res.render('admin/message',{message:'删除分类失败',luy:'cats'});
      }else{
        //res.send('添加分类成功<a href="/admin/cats/add">返回</a>');
        res.render('admin/message',{message:'删除分类成功',luy:'cats'})
      }
    });
  })
})

//显示编辑后边分类的表单页面
router.get('/edit', function(req, res, next) {
  //res.render('posts', { title: 'Express' });
  //res.send('显示编辑后边分类的表单页面');
  //获取id
  let id=req.query.id;
  MongoClient.connect(url,(err,db)=>{
    if(err) throw err;
    let cats=db.collection('cats');
    cats.find({_id:ObjectId(id)}).toArray((err,result)=>{
      if(err) throw err;
      res.render('admin/category_edit',{cat:result[0]});
    })
  })
});

//更新分类
router.post('/update',(req,res)=> {
  //第一步，获取表单提交的信息
  let title=req.body.title;
  let sort=req.body.sort;
  let id=req.body.id;
  //第二步，连接数据库，完成更新操作
  MongoClient.connect(url,(err,db)=>{
    if(err) throw err;
    let cats=db.collection('cats');
    cats.update({_id:ObjectId(id)},{title:title,sort:sort},(err,result)=>{
       if(err){
          //res.send('添加分类失败<a href="/admin/cats/add">返回</a>');
          res.render('admin/message',{message:'更新分类失败',luy:'cats'});
        }else{
          //res.send('添加分类成功<a href="/admin/cats/add">返回</a>');
          res.render('admin/message',{message:'更新分类成功',luy:'cats'})
        }
    })
  })
})
module.exports = router;