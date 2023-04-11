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
var actual_connection = mysql.createConnection({
                host: '34.30.226.249',
                user: 'root',
                password: 'SamMarvinSohyun',
                database: 'youtube'
});

connection.connect;
actual_connection.connect;

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
      res.send("it works");
});

// this code is executed when a user clicks the form submit button
app.post('/mark', function(req, res) {
  var chanid = req.body.chanid;
  var emid = req.body.emid;
  var passid = req.body.passid;
  var sql = `INSERT INTO User VALUES ('${chanid}','${emid}','${passid}')`;

console.log(sql);
  connection.query(sql, function(err, result) {
    if (err) {
      res.send(err)
      return;
    }
    res.redirect('/success');
  });
});

/* GET home page, respond by rendering index.ejs */
app.get('/', function(req, res) {
  res.render('index', { title: 'Mark Attendance' });
});

app.get('/success', function(req, res) {
      res.send("it works");
});

// this code is executed when a user clicks the form submit button
app.post('/mark2', function(req, res) {
  var chanid2 = req.body.chanid2;
  var emid2 = req.body.emid2;
  var passid2 = req.body.passid2;
  var sql2 = `DELETE FROM User WHERE ChannelName = '${chanid2}'`;

console.log(sql2);
  connection.query(sql2, function(err, result) {
    if (err) {
      res.send(err)
      return;
    }
    res.redirect('/success');
  });
});

// search
app.post('/search', function(req, res) {
  var channelname = req.body.channelname;

  actual_connection.query('SELECT * FROM Channel JOIN Video USING (ChannelId) WHERE Channel.ChannelTitle = ?', [channelname], function(err, result) {
    if (err) {
      res.send(err)
      return;
    }
    res.render('channel', { users: result });
  });
});

// advanced query 1
app.post('/aq1', function(req, res) {
  actual_connection.query('SELECT * FROM Video v JOIN Category c ON (c.CategoryId = v.CategoryId) JOIN Channel ch ON (ch.ChannelId = v.ChannelId) WHERE (SELECT TotalViews FROM Channel c2 WHERE (c2.ChannelId = ch.ChannelId)) > 1000000', function(err, result) {
    if (err) {
      res.send(err)
      return;
    }
    res.render('aq1', { aq1result: result });
  });
});

// advanced query 2
app.post('/aq2', function(req, res) {
  actual_connection.query('SELECT Channel.ChannelTitle, COUNT(*) AS NumOfVideos, SUM(TotalViews) AS TotalViews FROM Channel INNER JOIN Video ON Channel.ChannelId = Video.ChannelId GROUP BY Channel.ChannelTitle ORDER BY NumOfVideos DESC;', function(err, result) {
    if (err) {
      res.send(err)
      return;
    }
    res.render('aq2', { aq2result: result });
  });
});


// UPDATE CHANNEL NAME
/* GET home page, respond by rendering index.ejs */
app.get('/', function(req, res) {
  res.render('index', { title: 'Update Channel Name' });
});

app.get('/success', function(req, res) {
      res.send("Successfully updated the channel name!");
});

// this code is executed when a user clicks the form submit button
app.post('/update', function(req, res) {
  var currChanID = req.body.currChanName;
  var newChanID = req.body.newChanName;
  var sql = `UPDATE User SET ChannelName = '${newChanID}' WHERE ChannelName = '${currChanID}'`

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
