const fs = require('fs');
const https = require('https');
const WebSocket = require('ws');

var players = {}

const server = https.createServer({
    // cert: fs.readFileSync('./certs/cert.pem'),
    cert: fs.readFileSync('./certs/localhost.crt'),
    // key: fs.readFileSync('./certs/privkey.pem')
    key: fs.readFileSync('./certs/localhost.key')
});
const wss = new WebSocket.Server({ server });

wss.on('connection', function connection(ws, req) {
    ws.isAlive = true;
    ws.on('pong', heartbeat);
    sendMessage(ws, {players: players})
    ws.on('message', function incoming(message) {
        message = JSON.parse(message)
        if(message.player){
            var player = message.player
            if (!players[player]) {
                players[player] = {
                    hp: 100,
                    kills: 0
                }
            }
            if (!ws.player) {
                ws.player = player
            }
            if (message.position) {
                players[player].position = message.position
            }
            if (message.race) {
                players[player].race = message.race
            }
            if (message.damage) {
                players[player].hp -= message.damage
                if (players[player].hp <= 0) {
                    players[ws.player].kills += 1
                    sendMessage(ws, {
                        player: ws.player,
                        kills: players[ws.player].kills
                    });
                }
            }
        }
        wss.clients.forEach(function each(client) {
            if (client !== ws && client.readyState === WebSocket.OPEN) {
                sendMessage(client, message);
            }
          });
    });
    ws.on('close', function onClose(code, req){
        var player = this.player
        console.log("player "+player+" disconnected");
        delete players[this.player];
        wss.clients.forEach(function each(client) {
            sendMessage(client, {player: player,
            status: 'disconnected'})
        })
    })
    // ws.send('something');
});

wss.on('listening', _ => 
    console.log("ws server is up and listening")
)

server.listen(function listening() {
    console.log("http server is up and listening on port: " + server.address().port)
})

function noop() {}

const interval = setInterval(function ping() {
  wss.clients.forEach(function each(ws) {
    if (ws.isAlive === false) {
        return ws.terminate();
    }
    ws.isAlive = false;
    ws.ping(noop);
  });
}, 10000);

function sendMessage(client, message) {
    client.send(JSON.stringify(message));
    console.log('sending: %s', JSON.stringify(message));
}

function heartbeat() {
    this.isAlive = true;
}

