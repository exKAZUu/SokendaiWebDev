var express = require('express'),
  bodyParser = require('body-parser'),
  app = express();

// res.render で省略するデフォルトの拡張子を設定
app.set('view engine', 'ejs');

// POSTデータをパースするミドルウェアを設定
app.use(bodyParser.json({ extended: true }));
app.use(bodyParser.urlencoded({ extended: true }));

app.get('/', function(req, res) {
  res.render('index', {
    msg: "書き込みしよう！"
  });
});

app.post('/', function(req, res) {
  res.render('index', {
    msg: req.body.message
  });
});

var server = app.listen(3000, function() {
  var host = server.address().address;
  var port = server.address().port;
  console.log('Server running at http://%s:%s', host, port);
});
