// inspector for debugging
const util = require('util')

// WebSocket server
const WebSocket = require('ws');

const wss = new WebSocket.Server({ port: 18181 });


wss.on('connection', function connection(ws, req) {
    ws.on('message', function incoming(message) {
        message = JSON.parse(message)
        wss.clients.forEach(function each(client) {
            if (client !== ws && client.readyState === WebSocket.OPEN) {
                client.send(JSON.stringify(message));
            }
            console.log('sending: %s', JSON.stringify(message));
          });
    });
    // ws.send('something');
});


// static client server
var static = require('node-static');
var file = new static.Server('../client');
var port = 8080
require('http').createServer(function (request, response) {
    request.addListener('end', function () {
        file.serve(request, response);
    }).resume();
}).listen(port);
console.log("serving index.html at: http://localhost:"+8080);