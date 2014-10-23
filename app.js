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

function createGaze(directions) {
  var body;
  if (directions) {
    body = 'どの方向に進む？<ul>';
    if (directions.up) {
      body += '<li><a href="/maze?id=' + directions.up + '">↑</a>'
    }
    if (directions.right) {
      body += '<li><a href="/maze?id=' + directions.right + '">→</a>'
    }
    if (directions.down) {
      body += '<li><a href="/maze?id=' + directions.down + '">↓</a>'
    }
    if (directions.left) {
      body += '<li><a href="/maze?id=' + directions.left + '">←</a>'
    }
    body += '</ul>';
  } else {
    body = 'ゴール！<br /><a href="/">トップページへ</a>'
  }
  return createPage('迷路ゲーム', body);
}

var pages = {
  '/': createPage('My Web Apps',
    '<a href="/maze?id=1">迷路ゲーム</a>'),
  '1': createGaze({
    down: '2'
  }),
  '2': createGaze({
    up: '1',
    right: '3',
    down: '4',
    left: '5'
  }),
  '3': createGaze({
    right: '6',
    left: '2'
  }),
  '4': createGaze({
    up: '2',
  }),
  '5': createGaze({
    right: '2',
  }),
  '6': createGaze()
}

app.get('/', function(req, res) {
  res.set('Content-Type', 'text/html');
  res.send(pages['/']);
});

app.get('/maze', function(req, res) {
  res.set('Content-Type', 'text/html');
  res.send(pages[req.query.id]);
});

var server = app.listen(3000, function() {
  var host = server.address().address;
  var port = server.address().port;
  console.log('Server running at http://%s:%s', host, port);
});
