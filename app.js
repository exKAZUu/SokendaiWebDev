var express = require('express'),
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
    body = 'どの方向に進む？<ul>';
    if (directions.up) {
      body += '<li><a href="/maze?from=' + currentId + '&dir=up">↑</a>'
    }
    if (directions.right) {
      body += '<li><a href="/maze?from=' + currentId + '&dir=right">→</a>'
    }
    if (directions.down) {
      body += '<li><a href="/maze?from=' + currentId + '&dir=down">↓</a>'
    }
    if (directions.left) {
      body += '<li><a href="/maze?from=' + currentId + '&dir=left">←</a>'
    }
    body += '</ul>';
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

app.get('/', function(req, res) {
  res.set('Content-Type', 'text/html');
  res.send(createPage('My Web Apps',
    '<a href="/maze?from=1">迷路ゲーム</a>'));
});

app.get('/maze', function(req, res) {
  res.set('Content-Type', 'text/html');
  var dirs = maze[req.query.from];
  // 移動前の部屋が存在するかどうか確認
  if (dirs) {
    var nextId = req.query.from;
    // 移動前の部屋から見て、有効な移動先を指定しているか確認
    if (req.query.dir && dirs[req.query.dir]) {
      nextId = dirs[req.query.dir];
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
