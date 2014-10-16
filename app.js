var http = require('http');
var url = require('url');

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
    body = 'ゴール！<br /><a href="index.html">トップページへ</a>'
  }
  return createPage('迷路ゲーム', body);
}

var index = createPage('My Web Apps',
    '<a href="maze1.html">迷路ゲーム</a>');
var maze1 = createGaze({
  down: 'maze2.html'
});
var maze2 = createGaze({
  up: 'maze1.html',
  right: 'maze3.html',
  down: 'maze4.html',
  left: 'maze5.html'
});
var maze3 = createGaze({
  right: 'maze6.html',
  left: 'maze2.html'
});
var maze4 = createGaze({
  up: 'maze2.html',
});
var maze5 = createGaze({
  right: 'maze2.html',
});
var maze6 = createGaze();

http.createServer(function (req, res) {
  var pathname = url.parse(req.url).pathname;
  res.writeHead(200, {'Content-Type': 'text/html'});
  switch (pathname) {
    case '/maze1.html':
      res.end(maze1);
      break;
    case '/maze2.html':
      res.end(maze2);
      break;
    case '/maze3.html':
      res.end(maze3);
      break;
    case '/maze4.html':
      res.end(maze4);
      break;
    case '/maze5.html':
      res.end(maze5);
      break;
    case '/maze6.html':
      res.end(maze6);
      break;
    default:
      res.end(index);
      break;
  }
}).listen(3000, '127.0.0.1');
console.log('Server running at http://127.0.0.1:3000/');