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

var index = createPage('My Web Apps',
    '<a href="maze1.html">迷路ゲーム</a>');
var maze1 = createPage('迷路ゲーム',
    'どの方向に進む？\n\
    <ul>\n\
      <li><a href="maze2.html">↓</a>\n\
    </ul>');
var maze2 = createPage('迷路ゲーム',
    'どの方向に進む？\n\
    <ul>\n\
      <li><a href="maze1.html">↑</a>\n\
      <li><a href="maze3.html">→</a>\n\
      <li><a href="maze4.html">↓</a>\n\
      <li><a href="maze5.html">←</a>\n\
    </ul>');
var maze3 = createPage('迷路ゲーム',
    'どの方向に進む？\n\
    <ul>\n\
      <li><a href="maze6.html">→</a>\n\
      <li><a href="maze2.html">←</a>\n\
    </ul>');
var maze4 = createPage('迷路ゲーム',
    'どの方向に進む？\n\
    <ul>\n\
      <li><a href="maze2.html">↑</a>\n\
    </ul>');
var maze5 = createPage('迷路ゲーム',
    'どの方向に進む？\n\
    <ul>\n\
      <li><a href="maze2.html">→</a>\n\
    </ul>');
var maze6 = createPage('迷路ゲーム',
    'ゴール！<br />\n\
    <a href="index.html">トップページへ</a>');

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