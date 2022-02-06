var express=require("express");
var path=require("path");
var mysql=require("mysql");
var app=express();
app.listen(2001,function(){
    console.log("Server Started");
});
app.use(express.static("public"));
app.use(express.urlencoded({'extended':true}));

app.get("/",function(req,resp){
    var homepage=path.join(__dirname+"public","index.html");
    resp.sendFile(homepage);
})

var firstDbCon=
 {
     host:"localhost",
     user:"root",
     password:"",
     database:"project"
 }

 var dbcon=mysql.createConnection(firstDbCon);
 dbcon.connect(function(err){
        if(err)
            console.log(err);
            else
            console.log("congrats");
 });

app.get("/signup",(req,resp)=>{
     console.log(req.query);

     //resp.setHeader("content-Type","text/html");
        // console.log(req.body);
        var dataAry=[req.query.email,req.query.pwd,req.query.contact,req.query.type];
            dbcon.query("insert into profiles values(?,?,?,?,current_date())",dataAry,function(err)
            {
                    if(err)
                    resp.send(err);
                    else
                   resp.send("Record saved Successfully");
            });
 });

 app.post("/login",function(req,resp){
     resp.sendFile(__dirname+"/public/dashcitizen.html");
 })

 app.post("/profile",function(req,resp){
     resp.sendFile(__dirname+"/public/profile")
 })

 app.post("/requirement",function(req,resp){
    resp.sendFile(__dirname+"/public/postrequest.html")
})

app.post("/save-process",function(req,resp){
    console.log(req.body);
    var filename="nopic copy.jpg";
    if(req.files!=null)
    {
        var destination=path.join(process.cwd(),"public","uploard",req.files.profilepic.name);
        filename=req.files.profilepic.name;
        
        req.files.profilepic.mv(destination,function(err){
            if(err)
            console.log(err);
            else
            console.log("profile uploaded sucessfully");
        })
    }
    else{
        console.log(req.body);
        var dataAry=[req.body.txtUid,req.body.txtName,req.body.txtMob,req.body.txtAdd,req.body.txtCity,req.body.txtState,filename];
        dbcon.query("insert into profilesdata values(?,?,?,?,?,?,?)",dataAry,function(err){
            if(err)
            resp.send(err);
            else
            resp.send("record saved successfully");
        })
    }

})

app.post("/update-profile",(req,resp)=>
 {
    console.log(req.body);

    var fileName;
    if(req.files!=null)
     {
     var destination=path.join(process.cwd(),"public","uploads",req.files.profilePic.name);
    fileName=req.files.profilePic.name;

    req.files.profilePic.mv(destination,function(err){
        if(err)
            console.log(err);
        else
            console.log("File Uploaded Successfully");
    })
    }
    else
        fileName=req.body.jasoos;
        
       var dataAry=[req.body.txtName,req.body.txtMob,req.body.txtAdd,req.body.txtCity,req.body.txtState,
            fileName,req.body.txtUid];

            dbcon.query("update profiles set name=?,number=?,address=?,city=?,state=?,visited=?,propicpath=?,idpicpath=? where emailid=?",dataAry,function(err){
                    if(err)
                    resp.send(err);
                    else
                   resp.send("Record Updated Successfully");
            });
 })
