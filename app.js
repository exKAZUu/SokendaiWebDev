var express = require('express'),
  bodyParser = require('body-parser'),
  app = express();

function createPage(title, body) {
  return '\
<!DOCTYPE html>\n\
<html>\n\
  <head>\n\
    <title>' + title + '</title>\n\
  </head>\n\
  <body>' + body + '</body>\n\
</html>';
}

function createGaze(currentId, directions) {
  var body;
  if (directions) {
    body = 'どの方向に進む？';
    body += '<form action="/maze" method="post">';
    body += '<input type="hidden" name="from" value="' + currentId + '">';
    if (directions.up) {
      body += '<input type="submit" name="dir" value="up"><br />'
    }
    if (directions.right) {
      body += '<input type="submit" name="dir" value="right"><br />'
    }
    if (directions.down) {
      body += '<input type="submit" name="dir" value="down"><br />'
    }
    if (directions.left) {
      body += '<input type="submit" name="dir" value="left"><br />'
    }
    body += '</form>';
  } else {
    body = 'ゴール！<br /><a href="/">トップページへ</a>'
  }
  return createPage('迷路ゲーム', body);
}

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

// POSTデータをパースするミドルウェアを設定
app.use(bodyParser.json({ extended: true }));
app.use(bodyParser.urlencoded({ extended: true }));

app.get('/', function(req, res) {
  res.set('Content-Type', 'text/html');
  res.send(createPage('My Web Apps',
    '<form action="/maze" method="post">\
    <input type="hidden" name="from" value="1">\
    <input type="submit" name="dir" value="迷路ゲーム"></form>'));
});

app.post('/maze', function(req, res) {
  res.set('Content-Type', 'text/html');
  var dirs = maze[req.body.from];
  // 移動前の部屋が存在するかどうか確認
  if (dirs) {
    var nextId = req.body.from;
    // 移動前の部屋から見て、有効な移動先を指定しているか確認
    if (req.body.dir && dirs[req.body.dir]) {
      nextId = dirs[req.body.dir];
    }
    res.send(createGaze(nextId, maze[nextId]));
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
