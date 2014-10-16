var http = require('http');
var url = require('url');

var index = '\
<!DOCTYPE html>\n\
<html>\n\
  <head>\n\
    <title>My Web Apps</title>\n\
  </head>\n\
  <body>\n\
    <a href="maze1.html">迷路ゲーム</a>\n\
  </body>\n\
</html>';

var maze1 = '\
<!DOCTYPE html>\n\
<html>\n\
  <head>\n\
    <title>迷路ゲーム</title>\n\
  </head>\n\
  <body>\n\
    どの方向に進む？\n\
  　　<ul>\n\
      <li><a href="maze2.html">↓</a>\n\
    </ul>\n\
  </body>\n\
</html>';

var maze2 = '\
<!DOCTYPE html>\n\
<html>\n\
  <head>\n\
    <title>迷路ゲーム</title>\n\
  </head>\n\
  <body>\n\
  	どの方向に進む？\n\
  　　<ul>\n\
      <li><a href="maze1.html">↑</a>\n\
      <li><a href="maze3.html">→</a>\n\
      <li><a href="maze4.html">↓</a>\n\
      <li><a href="maze5.html">←</a>\n\
    </ul>\n\
  </body>\n\
</html>';

var maze3 = '\
<!DOCTYPE html>\n\
<html>\n\
  <head>\n\
    <title>迷路ゲーム</title>\n\
  </head>\n\
  <body>\n\
    どの方向に進む？\n\
  　　<ul>\n\
      <li><a href="maze6.html">→</a>\n\
      <li><a href="maze2.html">←</a>\n\
    </ul>\n\
  </body>\n\
</html>';

var maze4 = '\
<!DOCTYPE html>\n\
<html>\n\
  <head>\n\
    <title>迷路ゲーム</title>\n\
  </head>\n\
  <body>\n\
    どの方向に進む？\n\
  　　<ul>\n\
      <li><a href="maze2.html">↑</a>\n\
    </ul>\n\
  </body>\n\
</html>';

var maze5 = '\
<!DOCTYPE html>\n\
<html>\n\
  <head>\n\
    <title>迷路ゲーム</title>\n\
  </head>\n\
  <body>\n\
    どの方向に進む？\n\
  　　<ul>\n\
      <li><a href="maze2.html">→</a>\n\
    </ul>\n\
  </body>\n\
</html>';

var maze6 = '\
<!DOCTYPE html>\n\
<html>\n\
  <head>\n\
    <title>迷路ゲーム</title>\n\
  </head>\n\
  <body>\n\
    ゴール！<br />\n\
    <a href="index.html">トップページへ</a>\n\
  </body>\n\
</html>';

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