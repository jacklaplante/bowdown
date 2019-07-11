// WebSocket server
const WebSocket = require('ws');

const wss = new WebSocket.Server({ port: 18181 });

wss.on('connection', function connection(ws) {
    ws.on('message', function incoming(message) {
        console.log('received: %s', message);
        message = JSON.parse(message)
        wss.clients.forEach(function each(client) {
            if (client !== ws && client.readyState === WebSocket.OPEN) {
              client.send(JSON.stringify(message));
            }
          });
    });
    // ws.send('something');
});


// static client server
var static = require('node-static');
var file = new static.Server('../client');
require('http').createServer(function (request, response) {
    request.addListener('end', function () {
        file.serve(request, response);
    }).resume();
}).listen(8080);