var net = require('net');

function createData(params) {
  var delimiter = "", ret = "";
  for (var key in params) {
    ret += delimiter + key + "=" + params[key];
    delimiter = "&";
  }
  return ret;
}

function sendHttpRequest(host, port, request) {
  var socket = net.connect(port, host, function() {
    var rawResponse = "";

    // HTTPリクエストの送信
    socket.end(request);

    console.log("----------- Request -----------");
    console.log(request);

    // utf-8エンコーディングを設定
    socket.setEncoding('utf-8');

    // レスポンスの受信と表示
    socket.on('data', function(chunk) {
      rawResponse += chunk;
    });
    socket.on('end', function() {
      console.log("----------- Response -----------");
      console.log(rawResponse);
    });
  });
}

function createGetRequest(host, path, params) {
    return "GET " + path + "?" + createData(params) + " HTTP/1.1\r\n" +
            "Host: " + host + "\r\n\r\n";
}

function createPostRequest(host, path, params) {
    var data = createData(params);
    return "POST " + path + " HTTP/1.1\r\n" +
            "Host: " + host + "\r\n" +
            "Content-Type: application/x-www-form-urlencoded\r\n" +
            "Content-Length: " + Buffer.byteLength(data) + "\r\n\r\n" +
            data + "\r\n\r\n";
}

// sendHttpRequest を複数回書かないように
//req = createPostRequest("localhost", "/maze", { from: 3, dir: "right" });
//sendHttpRequest("localhost", 3000, req);

req = createGetRequest("localhost", "/maze", { from: 3, dir: "right" });
sendHttpRequest("localhost", 3000, req);
