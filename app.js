var express = require('express'),
  bodyParser = require('body-parser'),
  mongodb = require('mongodb'),
  MongoClient = mongodb.MongoClient,
  session = require('express-session'),
  MongoStore = require('connect-mongo')(session),
  app = express();

// 以下のディレクトリを手動で作成
// Windows: c:\data\db ディレクトリを事前に作成
// Mac OS / Linux: /data/db ディレクトリを事前に作成
// Windowsは C:\Program Files\MongoDB 2.6 Standard\bin にパスを通す
// 次のコマンドでMongoDBを起動 mongod --port 27017
var mongodbUrl = 'mongodb://localhost:27017/chat';
MongoClient.connect(mongodbUrl, function(err, db) {
  console.log("Connected correctly to server");
  var rooms = db.collection('rooms');

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
    rooms.find({}).toArray(function(err, rooms) {
      if (!req.session.name) {
        req.session.name = "anonymous";
      }
      res.render('index', {
        name: req.session.name,
        rooms: rooms
      });
    });
  });

  app.post('/name', function(req, res) {
    req.session.name = req.body.name;
    res.redirect('/');
  });

  app.post('/rooms', function(req, res) {
    rooms.insert({
        name: req.body.roomName,
        msgs: []
      },
      function(err, result) {
        res.redirect('/');
      });
  });

  app.get('/rooms/:id', function(req, res) {
    rooms.findOne({
      '_id': mongodb.ObjectID(req.params.id)
    }, function(err, room) {
      if (!req.session.name) {
        req.session.name = "anonymous";
      }
      res.render('room', {
        name: req.session.name,
        room: room
      });
    });
  });

  app.post('/rooms/:id', function(req, res) {
    rooms.findOne({
      '_id': mongodb.ObjectID(req.params.id)
    }, function(err, room) {
      room.msgs.push({
        name: req.body.name,
        text: req.body.message
      });
      rooms.update({
        '_id': mongodb.ObjectID(req.params.id)
      }, {
        $set: {
          msgs: room.msgs
        }
      }, function(err, result) {
        res.redirect('/rooms/' + req.params.id);
      });
    });
  });

  var server = app.listen(3000, function() {
    var host = server.address().address;
    var port = server.address().port;
    console.log('Server running at http://%s:%s', host, port);
  });

});
