var connect = require('connect')
var serveStatic = require('serve-static')

var app = connect()
app.use(serveStatic('static'))
app.listen(3000)
