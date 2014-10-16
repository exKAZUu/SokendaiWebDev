var http = require('http');
var port = process.env.PORT || 3000;
http.createServer(function (req, res) {
  res.writeHead(200, {'Content-Type': 'text/html'});
  res.end('\
<!DOCTYPE html>\n\
<html>\n\
  <head>\n\
    <title>Hello</title>\n\
  </head>\n\
  <body>\n\
    <h1>Hello</h1> World!\n\
  </body>\n\
</html>\
  ');
}).listen(port);
console.log('Server running at http://127.0.0.1:' + port + '/');