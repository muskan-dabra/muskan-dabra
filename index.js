//data come in vs terminal without email all undefine problem comes
var express=require("express");
var path=require("path");
var fileUpload=require("express-fileupload");
var mysql=require("mysql");
const {allowedNodeEnvironmentFlags,getMaxListeners}=require("process");
const e=require("express");
//var nodemailer=require("nodemailer");
const req=require("express/lib/request");
const { info } = require("console");
var app=express();
const port = process.env.PORT||6070;

app.listen(port,function(){
    console.log(`Server Started at ${port} and ready for listening requests from Client-chrome`);
});

app.use(express.static("public"));
const urlencodedparser= express.urlencoded({'extended':false});
app.use(express.json());

app.get("/",function(req,resp){

    resp.sendFile(__dirname+"/public/index.html");
});

var firstDbCon=
 {
     host:"localhost",
     user:"root",
     password:"",
     database:"realjava"
 }

 var dbcon=mysql.createConnection(firstDbCon);
 dbcon.connect(function(err){
        if(err)
            console.log(err);
            else
            console.log("congrats...");
 });
 app.use(express.urlencoded({'extended':true}));
 
    app.use(fileUpload());

app.get("/signup-process",(req,resp)=>{
     console.log(req.query);
        var dataAry=[req.query.email,req.query.pwd,req.query.contact,req.query.type];
        console.log(dataAry);
            dbcon.query("insert into users values(?,?,?,?,current_date())",dataAry,function(err)
            {
                    if(err)
                         resp.send(err);
                    else
                         resp.send("Record saved Successfully");
            });
 });
 
 app.get("/login",function(req,resp){
    console.log(req.query);
          dbcon.query("select * from users where email=? and pwd=?",[req.query.a,req.query.b],(err,result)=>{
          console.log(result);
                  if(err)
                  resp.send(err);
                  else
                 resp.send(result);
          });
});

app.post("/save",(req,resp)=>{
    
     var fileName="nopic.png";
    if(req.files!=null)
    {
    var destination=path.join(process.cwd(),"public","upload",req.files.pp.name);
    fileName=req.files.pp.name;
   
    req.files.pp.mv(destination,function(err){
        if(err)
            console.log(err);
            else
            console.log("File Uploaded Successfully");
    })
    }
    else
        console.log(req.body);
    var dataAry=[req.body.txtpceid,req.body.name,req.body.mob,req.body.address,req.body.city,req.body.state,fileName];
    console.log(dataAry);
        dbcon.query("insert into profile values(?,?,?,?,?,?,?)",dataAry,function(err)
        {
                if(err)
                     resp.send(err);
                else
                     resp.send("Record saved");
        });     
    }) 

 app.post("/update",(req,resp)=>
 {
     var fileName;
     if(req.files!=null)
     {
         var destination=path.join(process.cwd(),"public","upload",req.files.pp.name)
         fileName=req.files.pp.name;
         req.files.pp.mv(destination,function(err)
         {
             if(err)
             console.log(err);
             else
             console.log("Pic Uploaded Successfully")
         })
     }
     else
     fileName=req.body.jasoos;
      var dataAry=[req.body.name,req.body.mob,req.body.address,req.body.city,req.body.state,fileName,req.body.txtpceid];
     dbcon.query("update profile set name=?,mob=?,address=?,city=?,state=?,pp=? where txtpceid=?",dataAry,function(err)
     {
         if(err)
         resp.send(err);
         else
         resp.send("Record Updated Successfully");
     })
 })

 app.get("/fetchARecord",(req,resp)=>{
    // console.log(req.query.txtpceid);
    dbcon.query("select * from profile where txtpceid=?",[req.query.txtpceid],(err,result)=>
    {
        if(err)
            resp.send(err);
        else
            resp.send(result); //it send JSON Array
    })
 })


 app.get("/post-req",(req,resp)=>
 {
    //  console.log(req.body);
    var dataAry=[req.query.txtreid,req.query.cat,req.query.what,req.query.upto,req.query.location];
//    console.log(dataAry);
        dbcon.query("insert into request values(?,?,?,?,?,current_date())",dataAry,function(err)
        {
                if(err)
                     resp.send(err);
                else
                     resp.send("Record saved");
        });   
 })
 
 app.get("/btnchange",(req,resp)=>
 {
     dbcon.query("update users set pwd=? where email=?",[req.query.b],[req.query.a],(err,result)=>
     {
         if(err)
         resp.send(err);
         else
         resp.send(result);
     })
 })
 
app.post("/submit",(req,resp)=>{
    var fileName1="nopic.png";
    var fileName2="nopic.png"
    if(req.files!=null)
    {
        var destination=path.join(process.cwd(),"public","upload",req.files.profilepic.name)
        fileName1=req.files.profilepic.name;
        req.files.profilepic.mv(destination,function(err)
        {
            if(err)
            console.log(err);
            else
            console.log("Pic Uploaded Successfully")
        })
    }
    if(req.files!=null)
    {
        var destination=path.join(process.cwd(),"public","upload",req.files.idpic.name)
        fileName2=req.files.idpic.name;
        req.files.idpic.mv(destination,function(err)
        {
            if(err)
            console.log(err)
            else
            console.log("ID Uploaded Successfully")
        })
    }
    var dataAry=[req.body.txtwpeid,req.body.txtname,req.body.txtmob,req.body.city,req.body.txtaddress,req.body.cat,req.body.x,req.body.shop,req.body.work,fileName1,fileName2];
    dbcon.query("insert into workers values(?,?,?,?,?,?,?,?,?,?,?)",dataAry,function(err)
    {
        if(err)
        resp.send(err);
        else
        resp.send("Record Saved Successfully");
    })
})

app.get("/fetchCities",(req,resp)=>
{
    dbcon.query("select distinct city from profile",(err,result)=>
    {
        if(err)
        resp.send(err);
        else
        resp.send(result);
    })
})

app.get("/showAll",(req,resp)=>{
    dbcon.query("select * from profile",(err,result)=>{
        if(err)
        resp.send(err);
        else
        resp.send(result);
    })
})
///////////////angular //////////////////////////////////
app.get("/fetchCitiesw",(req,resp)=>
{
    dbcon.query("select distinct city from workers",(err,result)=>
    {
        if(err)
        resp.send(err);
        else
        resp.send(result);
    })
}) 

app.get("/fetchCategories",(req,resp)=>
{
    dbcon.query("select distinct cat from workers",(err,result)=>{
        if(err)
        resp.send(err);
        else
        resp.send(result);
    })
})
app.get("/cityandcate",(req,resp)=>{
    dbcon.query("select * from workers where city=? and cat=?",[req.query.x,req.query.y],(err,result)=>{
        if(err)
        resp.send(err);
        else
        resp.send(result);
    })
})

app.get("/fetchCitiespr",(req,resp)=>
{
    dbcon.query("select distinct location from request",(err,result)=>
    {
        if(err)
        resp.send(err);
        else
        resp.send(result);
    })
}) 

app.get("/fetchCategoriespr",(req,resp)=>
{
    dbcon.query("select distinct cat from request",(err,result)=>{
        if(err)
        resp.send(err);
        else
        resp.send(result);
    })
})

app.get("/cityandcatef",(req,resp)=>{
    dbcon.query("select * from request where location=? and cat=?",[req.query.x,req.query.y],(err,result)=>{
        if(err)
        resp.send(err);
        else
        resp.send(result);
    })
})
