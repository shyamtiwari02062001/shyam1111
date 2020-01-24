var express=require('express');
var bodyParser = require('body-parser');
const { Pool,Client} =require('pg');
const multer =require("multer");
var path=require('path');


var pathObj;

/*  end      */



/* Configuration to connect to database */


const connectionString =(process.env.pg_URI ||"postgres://st:shyam02@localhost:5432")

const client = new Client({
    connectionString:connectionString
})

client.connect()
/*  end      */



//creating express object
app=express();



//seting view engine to ejs
app.set('view engine','ejs');


// using bodyparser middleware
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.static('./public'));

/// set storage engine
const storage =multer.diskStorage({
destination:'./public/upload/',
filename: function(req, file, cb){
cb(null,file.fieldname+ '-'+Date.now()
+ path.extname(file.originalname));
}
});

//init upload
const upload=multer({
    storage: storage,
    fileFilter: function(req, file, cb){
        checkFileType(file, cb);
    }
}).single('pdf');
//check file type
function checkFileType(file , cb){
//allowed extension
const filetypes = /jpeg|jpg|png|gif|pdf/;
//check extention
const extname =  filetypes.test(path.extname(file.originalname).toLowerCase());
//check mime
const mimetype =filetypes.test(file.mimetype)
if(mimetype && extname){
    return cb(null, true);
}
else{
   res.render("error images and pdf only");
}
}

//file handeling



  app.get('/add', function(req, res) {
  res.render("main");
});
app.get('/upload1',function(req,res){
    res.render("upload1");
})
app.get('/', function(req, res) {
    client.query("SELECT * FROM notice order by id desc",function(err,result){
        if(err){
            return console.error('error running query',err);
        }
        res.render('index',{notice:result.rows});
    });
  });

//file handeling

app.post('/add',function(req,res){

    
    console.log(req.body.form);
    console.log(req.body.date);
 client.query("INSERT INTO notice (form,date,reason,path) values ($1,$2,$3,$4)",[req.body.form,req.body.date,req.body.reason,req.body.path],function(err,result)
  {
    if(err)
    {
        res.status(500).send(err.toString());
    }
    else 
    
    res.redirect('/');
});
});

app.post('/upload',function(req,res){

    
upload( req, res, (err) => {
    if(err)
    {
        res.status(500).send(err.toString());
    }
    else 
    var pathObj=`upload/${req.file.filename}`;
    console.log(pathObj);
    res.render('main',{pathObj});  
});
});

//port
app.listen(8080); 
console.log('Server started at port 8080');