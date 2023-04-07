var express = require('express');
var bodyParser = require('body-parser');
var mysql = require('mysql2');
var path = require('path');
var connection = mysql.createConnection({
                host: '34.30.226.249',
                user: 'root',
                password: 'SamMarvinSohyun',
                database: 'test_crud'
});

connection.connect;


var app = express();

// set up ejs view engine
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(express.static(__dirname + '../public'));

/* GET home page, respond by rendering index.ejs */
app.get('/', function(req, res) {
  res.render('index', { title: 'Mark Attendance' });
});

app.get('/success', function(req, res) {
      res.send("it wokr");
});

// this code is executed when a user clicks the form submit button
app.post('/mark', function(req, res) {
  var vidid = req.body.vidid;
  var sql = `INSERT INTO test1 VALUES ('${vidid}',1)`;



console.log(sql);
  connection.query(sql, function(err, result) {
    if (err) {
      res.send(err)
      return;
    }
    res.redirect('/success');
  });
});



app.listen(80, function () {
    console.log('Node app is running on port 80');
});
