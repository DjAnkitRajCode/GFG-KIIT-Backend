var express         = require('express'),
    app             = express(),
    bodyParser      = require('body-parser'),
    mongoose        = require('mongoose'),
    multer          = require('multer'),
    path            = require('path'),
    methodeOverride = require("method-override"),
    Details         = require("./models/details"),
    Events         = require("./models/events");

//SETUPs
mongoose.connect("mongodb://localhost/GFG",{useUnifiedTopology:true, useNewUrlParser: true, useFindAndModify:false});
app.use(express.static(__dirname + "/public/"));
app.use(bodyParser.urlencoded({extended:true}));
app.use(methodeOverride("_method"));
app.set("view engine","ejs");

//fILE UPLOAD
var Storage = multer.diskStorage({
    destination:"./public/uploads/",
    filename:(req,file,cb)=>{
        cb(null,file.filename+"_"+Date.now()+path.extname(file.originalname));
    }
});
var upload = multer({
    storage:Storage
}).single('file');

//landing
app.get("/",function(req,res){
    Events.find({},function(err,event){
        if(err){
            console.log(err);
        }else{
          Details.find({},function(err,member){
            if(err){
               console.log(err);
            }else{
               res.render("landing",{event:event, member:member});
            }
          });
        }
    });
});

//Admin
app.get("/admin",(req,res)=>{
    //get all members form DB
    Details.find({},function(err, allmembers){
        if(err){
            console.log(err);
        }else{
            res.render("admin",{members: allmembers});
        }
    });
});

//Events
app.get("/events",(req,res)=>{
    //get all events form DB
    Events.find({},function(err, allevents){
        if(err){
            console.log(err);
        }else{
            res.render("events",{events: allevents});
        }
    });
});


// Admin control events
// CREATE
app.get("/admin/event/create",(req,res)=>{
    res.render("events_create");
});

app.post("/admin/event/create",upload,function(req,res){
    var newEvent = {
        title : req.body.title,
        text : req.body.text,
        image: req.file.filename
    }
    //create a new member and save to data base
    Events.create(newEvent ,function(err ,newlycreated){
        if(err){
            console.log(err);
        }
        else{
            //redirect back to member page
            res.redirect("/events");
        }
    });
});

// EDIT
app.get("/admin/event/:id/edit", function(req,res){
    Events.findById(req.params.id, function(err, allevents){
        if(err){
            console.log(err);
        }else{
            res.render("events_edit",{events: allevents});
        }
    });
});

//update
app.put("/admin/event/:id",upload,function(req,res){
    if(req.file){
        var updateEvent = {
            title:req.body.title,
            text:req.body.text,
            image:req.file.filename,
        }
    }
    else{
        var updateEvent = {
            title:req.body.title,
            text:req.body.text,
        }
    }
    Events.findByIdAndUpdate(req.params.id,updateEvent,function(err,updatedevent){
        if(err){
            console.log(err);
        }else{
            res.redirect("/events");
        }
    });
});
//delete
app.delete("/delete/:id",function(req,res){
    Events.findByIdAndRemove(req.params.id, function(err){
        if(err){
            console.log(err);
        }
        res.redirect("/events");
    });
});

//Admin control Member details
//CREATE
app.get("/admin/member/create",(req,res)=>{
    res.render("member_create");
});

app.post("/admin/member/create",upload,function(req,res){
    var newMember = {
            name : req.body.name,
            email : req.body.email,
            git : req.body.git,
            insta : req.body.insta,
            twitter : req.body.twitter,
            linkedin : req.body.linkedin,
            image: req.file.filename
        }
    //create a new member and save to data base
    Details.create(newMember ,function(err ,newlycreated){
        if(err){
            console.log(err);
        }
        else{
            //redirect back to member page
            res.redirect("/admin");
        }
    });
});

// EDIT
app.get("/admin/member/:id/edit", function(req,res){
    Details.findById(req.params.id, function(err, allmembers){
        if(err){
            console.log(err);
        }else{
            res.render("member_edit",{member: allmembers});
        }
    });
});

//update
app.put("/admin/member/:id",upload,function(req,res){
    if(req.file){
        var updateMember = {
            name : req.body.name,
            email : req.body.email,
            git : req.body.git,
            insta : req.body.insta,
            twitter : req.body.twitter,
            linkedin : req.body.linkedin,
            image: req.file.filename
        }
    }
    else{
        var updateMember = {
            name : req.body.name,
            email : req.body.email,
            git : req.body.git,
            insta : req.body.insta,
            twitter : req.body.twitter,
            linkedin : req.body.linkedin,
        }
    }
    Details.findByIdAndUpdate(req.params.id,updateMember,function(err,updatedmember){
        if(err){
            console.log(err);
        }else{
            res.redirect("/admin");
        }
    });
});
//delete
app.delete("/delete/member/:id",function(req,res){
    Details.findByIdAndRemove(req.params.id, function(err){
        if(err){
            console.log(err);
        }
        res.redirect("/admin");
    });
});

//PORT
app.listen(3000,()=>{
    console.log("GFG server has started! by port 3000");
});