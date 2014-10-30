var express = require('express'),
  bodyParser = require('body-parser'),
  app = express();

var maze = {
  '1': {
    down: '2'
  },
  '2': {
    up: '1',
    right: '3',
    down: '4',
    left: '5'
  },
  '3': {
    right: '6',
    left: '2'
  },
  '4': {
    up: '2',
  },
  '5': {
    right: '2',
  },
  '6': null
}

// res.render で省略するデフォルトの拡張子を設定
app.set('view engine', 'ejs');

// POSTデータをパースするミドルウェアを設定
app.use(bodyParser.json({ extended: true }));
app.use(bodyParser.urlencoded({ extended: true }));

app.get('/', function(req, res) {
  res.render('index');
});

app.post('/maze', function(req, res) {
  var dirs = maze[req.body.from];
  // 移動前の部屋が存在するかどうか確認
  if (dirs) {
    var nextId = req.body.from;
    // 移動前の部屋から見て、有効な移動先を指定しているか確認
    if (req.body.dir && dirs[req.body.dir]) {
      nextId = dirs[req.body.dir];
    }
    res.render('maze', {
      currentId: nextId,
      directions: maze[nextId]
    });
  } else {
    // 不正なコマンド入力を受け取った場合の対応
    res.status(404).send('Wrong Maze ID.');
  }
});

var server = app.listen(3000, function() {
  var host = server.address().address;
  var port = server.address().port;
  console.log('Server running at http://%s:%s', host, port);
});
