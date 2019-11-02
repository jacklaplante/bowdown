const fs = require('fs');
const WebSocket = require('ws');

let maxCount = 0;

var server
if ( process.argv[2] == 'prod' ) {
    server = require('https').createServer({
        port: 18181,
        cert: fs.readFileSync('./certs/cert.pem'),
        key: fs.readFileSync('./certs/privkey.pem')
    });
} else {
    server = require('http').createServer();
}

const wss = new WebSocket.Server({ server });

var players = {}

var kingOfCrownMode = true
var kingOfCrown

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
                var playerCount = Object.keys(players).length;
                if (playerCount > maxCount) { // this will kepp track of the maximum amount of players the server has
                    maxCount = playerCount
                    var now = new Date();
                    fs.writeFile('numberOfPlayers.txt', maxCount + " - " + now, (err) => {
                        if (err) throw err
                        console.log("maxCount of " + maxCount + " saved to file at " + now)
                    })
                }
            }
            if (!ws.player) {
                ws.player = player
            }
            if (kingOfCrownMode && Object.keys(players).length == 2 && kingOfCrown == null && !players[player].kingOfCrown) {
                setKingOfCrown(player)
            }
            if (message.position) {
                players[player].position = message.position
            }
            if (message.race) {
                players[player].race = message.race
            }
            if (message.rotation) {
                players[player].rotation = message.rotation
            }
            if (message.damage) {
                players[player].hp -= message.damage
                if (players[player].hp <= 0) {
                    players[ws.player].kills += 1
                    sendMessage(ws, {
                        player: ws.player,
                        kills: players[ws.player].kills
                    });
                    if (players[player].kingOfCrown) {
                        setKingOfCrown(ws.player)
                    }
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
        var playerUuid = this.player
        console.log("player "+playerUuid+" disconnected");
        var player = players[playerUuid]
        delete players[playerUuid];
        if (player.kingOfCrown) {
            if(Object.keys(players).length > 0) {
                setKingOfCrown(Object.keys(players)[0])
            } else {
                kingOfCrown = null
            }
        }
        wss.clients.forEach(function each(client) {
            sendMessage(client, {
                player: playerUuid,
                status: 'disconnected'
            })
        })
    })
    // ws.send('something');
});

function setKingOfCrown(playerUuid) {
    kingOfCrown = playerUuid
    players[playerUuid].kingOfCrown = true
    console.log(playerUuid + " is the new king!")
    wss.clients.forEach(function each(client) {
        sendMessage(client, {
            newKing: playerUuid
        })
    })
}

wss.on('listening', _ => 
    console.log("ws server is up and listening")
)

server.listen(18181, function listening() {
    console.log("https server is up and listening on port: " + server.address().port)
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

