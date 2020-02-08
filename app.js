var express         = require("express"),
    app             = express(),
    bodyParser      = require("body-parser"),
    methodOverride  = require("method-override"),
    expressSan      = require("express-sanitizer"),
    mongoose        = require("mongoose");
    
//  title image body date 

// App Config

app.set("view engine", "ejs");   
app.use(express.static("public"));

app.use(bodyParser.urlencoded({extended:true}));
app.use(expressSan());
app.use(methodOverride("_method"));
mongoose.connect('mongodb://localhost:27017/restful_blog', { useNewUrlParser: true });

// Mongoose /model config schema making
var blogS = new mongoose.Schema({
    title : String,
    image : String,
    // image : String,default:"placeholderimage.jpg"
    body : String,
    created:{
        type: Date,
        default:Date.now
        
    }
});

var Blog = mongoose.model("Blog",blogS);
// Blog.create({
//     title :"Test Blog",
//     image:"https://images.unsplash.com/photo-1564149504817-d1378368526f?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=934&q=80.jpg",
//     body:"Hello it's me"
// });

// Routes                                                 

// Index route
app.get("/",function(req,res){
   res.redirect("/blogs");
});
app.get("/blogs",function(req,res){
    Blog.find({},function(err,blogs){
        if(err){
            console.log("Error");
        }else{
            res.render("index",{blogs:blogs});
        }
    })
    // res.render("index");
});

// New Route
app.get("/blogs/new",function(req, res) {
    res.render("new");
})

// Create Route 
app.post("/blogs",function(req,res){
    // create blog
    console.log(req.body);
    req.body.blog.body = req.sanitize(req.body.blog.body);
    console.log("*****************************************");
    console.log(req.body);
    Blog.create(req.body.blog,function(err,newBlog){
        if(err){
            res.send("something is wrong");
        }else{
            res.redirect("/blogs");
        }
    });
    // redirrect
});

// Show route
app.get("/blogs/:id",function(req, res) {
    
    Blog.findById(req.params.id,function(err,foundBlog){
        if(err){
            res.send("error found in show route");
        }else{
            res.render("show",{blog:foundBlog})
        }
    })
    // res.send("show page is here");
});

// Edit Route
app.get("/blogs/:id/edit",function(req, res) {
    // var getmeid = req.params.id;
    Blog.findById(req.params.id,function(err,foundBlog){
        if(err){
            res.send("error found in edit route");
        }else{
            res.render("edit",{blog:foundBlog});
        }
    });
    // res.send("show page is here");
});

// Update Route
app.put("/blogs/:id",function(req,res){
    req.body.blog.body = req.sanitize(req.body.blog.body)
    Blog.findByIdAndUpdate(req.params.id,req.body.blog,function(err,updateddata){
       if(err){
           res.send("You got me in Update Route");
       }else{
           res.redirect("/blogs/"+req.params.id);
       } 
    });
});

// Delete Route
app.delete("/blogs/:id",function(req,res){
    //1. Destroy blog
    //2. redirect
    Blog.findByIdAndRemove(req.params.id,function(err){
        if(err){
            res.send("Hi am error from delete route");
        }else{
            res.redirect("/blogs");
        }
    })
   
});

app.get("/*",function(req, res) {
    res.redirect("/blogs");
});

app.listen(process.env.PORT,process.env.IP,function(){
    console.log("Request accepted you may proceed");
});


