var express = require('express'),
  bodyParser = require('body-parser'),
  MongoClient = require('mongodb').MongoClient,
  app = express(),
  session = require('express-session'),
  MongoStore = require('connect-mongo')(session);

// 以下のディレクトリを手動で作成
// Windows: c:\data\db ディレクトリを事前に作成
// Mac OS / Linux: /data/db ディレクトリを事前に作成
// Windowsは C:\Program Files\MongoDB 2.6 Standard\bin にパスを通す
// 次のコマンドでMongoDBを起動 mongod --port 27017
var mongodbUrl = 'mongodb://localhost:27017/chat';
MongoClient.connect(mongodbUrl, function(err, db) {
  console.log("Connected correctly to server");
  var messages = db.collection('messages');

  // res.render で省略するデフォルトの拡張子を設定
  app.set('view engine', 'ejs');

  // POSTデータをパースするミドルウェアを設定
  app.use(bodyParser.json({
    extended: true
  }));
  app.use(bodyParser.urlencoded({
    extended: true
  }));
  // セッションを利用するための設定
  app.use(session({
    secret: 'please_change_this_secret',
    store: new MongoStore({
      db: 'chat',
    })
  }));

  app.get('/', function(req, res) {
    messages.find({}).toArray(function(err, messages) {
      if (!req.session.name) {
        req.session.name = "anonymous";
      }
      res.render('index', {
        msgs: messages,
        name: req.session.name
      });
    });
  });

  app.post('/', function(req, res) {
    messages.insert({
        name: req.body.name,
        text: req.body.message
      },
      function(err, result) {
        res.redirect('/');
      });
  });

  app.post('/name', function(req, res) {
    req.session.name = req.body.name;
    res.redirect('/');
  });

  var server = app.listen(3000, function() {
    var host = server.address().address;
    var port = server.address().port;
    console.log('Server running at http://%s:%s', host, port);
  });

});
