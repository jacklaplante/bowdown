// inspector for debugging
const util = require('util')

var players = {}

// WebSocket server
const WebSocket = require('ws');
const wss = new WebSocket.Server({ port: 18181 });
wss.on('connection', function connection(ws, req) {
    sendMessage(ws, {players: players})
    ws.on('message', function incoming(message) {
        message = JSON.parse(message)
        if(message.player){
            var player = message.player
            if (!ws.player) {
                ws.player = player
            }
            if (message.x && message.z) {
                players[player] = {
                    x: message.x,
                    z: message.z
                }
            }
        }
        wss.clients.forEach(function each(client) {
            if (client !== ws && client.readyState === WebSocket.OPEN) {
                sendMessage(client, message);
            }
            console.log('sending: %s', JSON.stringify(message));
          });
    });
    ws.on('close', function onClose(code, req){
        console.log("player "+this.player+" disconnected");
        delete players[this.player];
    })
    // ws.send('something');
});

function sendMessage(client, message) {
    client.send(JSON.stringify(message));
    console.log('sending: %s', JSON.stringify(message));
}


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