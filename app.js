var express = require('express'),
  bodyParser = require('body-parser'),
  MongoClient = require('mongodb').MongoClient,
  app = express();

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

  app.get('/', function(req, res) {
    messages.find({}).toArray(function(err, messages) {
      res.render('index', {
        msgs: messages,
        name: ''
      });
    });
  });

  app.post('/', function(req, res) {
    messages.insert({
        name: req.body.name,
        text: req.body.message
      },
      function(err, result) {
        messages.find({}).toArray(function(err, messages) {
          res.render('index', {
            msgs: messages,
            name: req.body.name
          });
        });
      });
  });

  var server = app.listen(3000, function() {
    var host = server.address().address;
    var port = server.address().port;
    console.log('Server running at http://%s:%s', host, port);
  });

});
