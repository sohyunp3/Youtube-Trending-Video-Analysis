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

app.get('/insert', function(req, res) {
  res.render('insert.ejs');
});

app.get('/search', function(req, res) {
  res.render('search.ejs');
});

app.get('/update', function(req, res) {
  res.render('update.ejs');
});

app.get('/delete', function(req, res) {
  res.render('delete.ejs');
});

app.get('/advanced_query', function(req, res) {
  res.render('advanced_query.ejs');
});
app.get('/stored_procedure', function(req,res) {
  res.render('stored_procedure.ejs');
});
// this code is executed when a user clicks the form submit button
app.post('/mark', function(req, res) {
  var videoid = req.body.videoid;
  var videotitle = req.body.videotitle;
  var channelid = req.body.channelid;
  var channelname = req.body.channelname;
  var views = req.body.views;
  var sql = `INSERT INTO Video VALUES ('${videoid}','${videotitle}',1,'${channelid}','${channelname}','${views}')`;

console.log(sql);
  actual_connection.query(sql, function(err, result) {
    if (err) {
      res.send(err)
      return;
    }
    res.render('insert.ejs');
  });
});

// this code is executed when a user clicks the form submit button
app.post('/mark2', function(req, res) {
  var channame = req.body.channame;
  var vidtitle = req.body.vidtitle;
  var sql2 = `DELETE FROM Video WHERE ChannelName = '${channame}' AND VideoTitle = '${vidtitle}'`;

console.log(sql2);
  actual_connection.query(sql2, function(err, result) {
    if (err) {
      res.send(err)
      return;
    }
    res.render('delete.ejs');
  });
});

// search
app.post('/search', function(req, res) {
  var channelname = req.body.channelname;

  actual_connection.query('SELECT * FROM Video WHERE ChannelName = ?', [channelname], function(err, result) {
    if (err) {
      res.send(err)
      return;
    }
    res.render('channel', { users: result });
  });
});

// advanced query 1
app.post('/aq1', function(req, res) {
  var categName = req.body.aq1name;
  actual_connection.query(`SELECT * FROM Video v JOIN Category c ON (c.CategoryId = v.CategoryId) JOIN Channel ch ON (ch.ChannelId = v.ChannelId) WHERE (SELECT TotalViews FROM Channel c2 WHERE (c2.ChannelId = ch.ChannelId)) > 1000000 AND c.CategoryName='${categName}' LIMIT 50`, function(err, result) {
    if (err) {
      res.send(err)
      return;
    }
    res.render('aq1', { aq1result: result });
  });
});

// advanced query 2
app.post('/aq2', function(req, res) {
  var limit = req.body.aq2name;
  var lit = parseInt(limit);
  actual_connection.query(`SELECT Channel.ChannelTitle, COUNT(*) AS NumOfVideos, SUM(TotalViews) AS TotalViews FROM Channel INNER JOIN Video ON Channel.ChannelId = Video.ChannelId GROUP BY Channel.ChannelTitle ORDER BY TotalViews DESC, NumOfVideos LIMIT ${lit};`, function(err, result) {
    if (err) {
      res.send(err)
      return;
    }
    res.render('aq2', { aq2result: result });
  });
});


// UPDATE CHANNEL NAME
// this code is executed when a user clicks the form submit button
app.post('/update', function(req, res) {
  var currChanID = req.body.videoid;
  var newChanID = req.body.newvideoname;
  var sql = `UPDATE Video SET VideoTitle = '${newChanID}' WHERE VideoId = '${currChanID}'`

console.log(sql);
  actual_connection.query(sql, function(err, result) {
    if (err) {
      res.send(err)
      return;
    }
    res.render('update.ejs');
  });
});
app.post('/stored_procedure', function(req, res) {
  var catid = req.body.catid;
  actual_connection.query(`CALL GetPopularVideosByCategory('${catid}')`, function(err, result) {
    if (err) {
      res.send(err)
      return;
    }
  });
  actual_connection.query('SELECT * FROM PopularVideos', function(err, result) {
    if (err) {
      res.send(err)
      return;
    }
    res.render('sp1', { sp1result: result });
  });
});
app.post('/stored_procedure1', function(req, res) {
  var views = req.body.views;
  actual_connection.query(`CALL GetTopChannelsByAverageVideoViews('${views}')`, function(err, result) {
    if (err) {
      res.send(err)
      return;
    }
  });
  actual_connection.query('SELECT * FROM TopChannels', function(err, result) {
    if (err) {
      res.send(err)
      return;
    }
    res.render('sp2', { sp2result: result });
  });
});

app.listen(80, function () {
    console.log('Node app is running on port 80');
});

