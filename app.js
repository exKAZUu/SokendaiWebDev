var express = require('express'),
  bodyParser = require('body-parser'),
  mongoose = require('mongoose'),
  session = require('express-session'),
  MongoStore = require('connect-mongo')(session),
  moment = require('moment'),
  app = express(),
  http = require('http').Server(app),
  io = require('socket.io')(http);

var port = process.env.PORT || 3000;

// 以下のディレクトリを手動で作成
// Windows: c:\data\db ディレクトリを事前に作成
// Mac OS / Linux: /data/db ディレクトリを事前に作成
// Windowsは C:\Program Files\MongoDB 2.6 Standard\bin にパスを通す
// 次のコマンドでMongoDBを起動 mongod --port 27017
var mongodbUrl = process.env.MONGOLAB_URI || 'mongodb://localhost:27017/chat';
mongoose.connect(mongodbUrl);

var db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function() {
  console.log("Connected correctly to MongoDB server.");
  var Schema = mongoose.Schema;
  var roomSchema = new Schema({
    name: String,
    msgs: [{
      name: String,
      text: String,
      color: { type: String, default: 'black' },
      created_at: Date
    }]
  });
  var Room = mongoose.model('Room', roomSchema)

  // res.render で省略するデフォルトの拡張子を設定
  app.set('view engine', 'jade');

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
      mongooseConnection: db
    })
  }));

  app.get('/', function(req, res) {
    if (!req.session.name) {
      res.render('login', {});
    } else {
      res.redirect('/rooms');
    }
  });

  app.post('/login', function(req, res) {
    req.session.name = req.body.name;
    res.redirect('/rooms');
  });

  app.post('/logout', function(req, res) {
    req.session.destroy();
    res.redirect('/');
  });

  app.all('*', function(req, res, next) {
    if (!req.session.name) {
      res.redirect('/');
    } else {
      next();
    }
  });

  app.get('/rooms', function(req, res) {
    Room.find(function(err, rooms) {
      res.render('index', {
        name: req.session.name,
        rooms: rooms
      });
    });
  });

  app.post('/rooms', function(req, res) {
    var room = new Room({
      name: req.body.roomName,
      msgs: []
    });
    room.save(function(err, room) {
      res.redirect('/rooms');
    });
  });

  app.get('/rooms/:id', function(req, res) {
    Room.findOne({
      _id: req.params.id
    }, function(err, room) {
      res.render('room', {
        name: req.session.name,
        room: room
      });
    });
  });

  io.on('connection', function(socket) {
    var join;
    console.log('a user connected');
    socket.on('join', function(_join) {
      console.log('join: ', _join);
      socket.join(_join.roomId);
      join = _join;
    });
    socket.on('message', function(msgObj) {
      console.log('message: ', msgObj);
      Room.findOne({
        _id: join.roomId
      }, function(err, room) {
        msgObj.name = join.name;
        msgObj.created_at = Date.now();
        room.msgs.push(msgObj);
        room.save();
        io.to(join.roomId).emit('message', msgObj);
      });
    });
    socket.on('disconnect', function() {
      console.log('user disconnected');
    });
  });

  var server = http.listen(port, function() {
    var host = server.address().address;
    var port = server.address().port;
    console.log('Server running at http://%s:%s', host, port);
  });

});
