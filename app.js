var express = require('express'),
  params = require('express-params'),
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
      body += '<li><a href="' + directions.up + '">↑</a>'
    }
    if (directions.right) {
      body += '<li><a href="' + directions.right + '">→</a>'
    }
    if (directions.down) {
      body += '<li><a href="' + directions.down + '">↓</a>'
    }
    if (directions.left) {
      body += '<li><a href="' + directions.left + '">←</a>'
    }
    body += '</ul>';
  } else {
    body = 'ゴール！<br /><a href="/">トップページへ</a>'
  }
  return createPage('迷路ゲーム', body);
}

var pages = {
  '/': createPage('My Web Apps',
    '<a href="maze1">迷路ゲーム</a>'),
  '/maze1': createGaze({
    down: 'maze2'
  }),
  '/maze2': createGaze({
    up: 'maze1',
    right: 'maze3',
    down: 'maze4',
    left: 'maze5'
  }),
  '/maze3': createGaze({
    right: 'maze6',
    left: 'maze2'
  }),
  '/maze4': createGaze({
    up: 'maze2',
  }),
  '/maze5': createGaze({
    right: 'maze2',
  }),
  '/maze6': createGaze()
}

params.extend(app);

app.get('/', function(req, res) {
  res.set('Content-Type', 'text/html');
  res.send(pages['/']);
});

app.param('mazeid', /^maze\d+$/)

app.get('/:mazeid', function(req, res) {
  res.set('Content-Type', 'text/html');
  res.send(pages['/' + req.params.mazeid]);
});

var server = app.listen(3000, function() {
  var host = server.address().address;
  var port = server.address().port;
  console.log('Server running at http://%s:%s', host, port);
});
