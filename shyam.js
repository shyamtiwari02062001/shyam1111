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

//file handeling



 
app.get('/', function(req, res) {
    client.query("SELECT * FROM notice order by id desc",function(err,result){
        if(err){
            return console.error('error running query',err);
        }
        res.render('student',{notice:result.rows});
    });
  });

//file handeling


//port
app.listen(3000); 
console.log('Server started at port 3000');