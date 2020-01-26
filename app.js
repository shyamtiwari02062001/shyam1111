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
//Time and Date
let date_ob = new Date();

// current date
// adjust 0 before single digit date
let date = ("0" + date_ob.getDate()).slice(-2);

// current month
let month = ("0" + (date_ob.getMonth() + 1)).slice(-2);

// current year
let year = date_ob.getFullYear();

// current hours
let hours = date_ob.getHours();

// current minutes
let minutes = date_ob.getMinutes();

// current seconds
let seconds = date_ob.getSeconds();





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
 client.query("INSERT INTO notice (form,date,reason,time,path) values ($1,$2,$3,$4,$5)",[req.body.form,req.body.date,req.body.reason,req.body.time,req.body.path],function(err,result)
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
    // prints date & time in YYYY-MM-DD HH:MM:SS format
    var DATE=(year + "-" + month + "-" + date );
    console.log(DATE);

    // prints time in HH:MM format
    var TIME=(hours + ":" + minutes + ":" +seconds);
    console.log(TIME);
    var pathObj=`upload/${req.file.filename}`;
    console.log(pathObj);
    res.render('main',{pathObj,DATE,TIME});  
});
});

//port
app.listen(8000); 
console.log('Server started at port 8000');