const fs = require('fs');
const WebSocket = require('ws');
const https = require('https');

const playerLimit = 20
const prod = process.argv[2] == 'prod'

let maxCount = 0;

var server, serverId, serverIp, apiKey
if (prod) {
    if (process.argv.length < 6) throw "INCLUDE SERVER ID, SERVER IP, and API KEY"
    serverId = process.argv[3]
    serverIp = process.argv[4]
    apiKey = process.argv[5]
    var cert
    if (process.argv[6]) {
        cert = process.argv[6]
    } else {
        cert = './certs/' + serverId + '/cert.pem'
    }
    var key
    if (process.argv[7]) {
        key = process.argv[7]
    } else {
        key = './certs/' + serverId + '/privkey.pem'
    }
    server = https.createServer({
        port: 18181,
        cert: fs.readFileSync(cert),
        key: fs.readFileSync(key)
    });
} else {
    server = require('http').createServer();
}

const wss = new WebSocket.Server({ server });
const games = {}
var defaultGame = initGame('default')
defaultGame.kingOfCrownMode = true
defaultGame.kingOfCrown
defaultGame.kingOfCrownStartTime

function initGame(game) {
    console.log("Starting game: " + game)
    games[game] = {}
    games[game].players = {}
    return games[game]
}

function getGame(url) {
    var gameName = alphaOnly(url)
    if (gameName) {
        if (games[gameName]) {
            return games[gameName]
        } else {
            return initGame(gameName)
        }
    } else {
        return games.default
    }
}

function stopGame(game) {
    delete game
    console.log("Stopping game: " + game)
}

wss.shouldHandle = function(request) {
    var game = getGame(request.url)
    if (Object.keys(game.players).length > playerLimit) {
        return false
    }
    return true
}

wss.on('connection', function connection(ws, req) {
    var game = getGame(req.url)
    var players = game.players
    ws.isAlive = true;
    ws.on('pong', heartbeat);
    sendMessage(ws, {players: players})
    if (game.kingOfCrownMode && game.kingOfCrownStartTime) {
        sendMessage(ws, {kingOfCrownStartTime: game.kingOfCrownStartTime})
    }
    ws.on('message', function incoming(message) {
        message = JSON.parse(message)
        ws.lastMessage = Date.now()
        if(message.player){
            var player = message.player
            if (!players[player]) {
                players[player] = {
                    hp: 100,
                    kills: 0,
                    ws: ws
                }
                var playerCount = Object.keys(players).length;
                updatePlayerCount(playerCount)
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
            if (game.kingOfCrownMode && Object.keys(players).length == 2 && game.kingOfCrown == null && !players[player].kingOfCrown) {
                setKingOfCrown(game, player)
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
            if (message.damage && message.to) {
                players[message.to].hp -= message.damage
                if (players[message.to].hp <= 0) {
                    players[player].kills += 1
                    sendMessage(ws, {
                        player: player,
                        kills: players[player].kills
                    });
                    if (game.kingOfCrownMode && players[message.to].kingOfCrown) {
                        setKingOfCrown(game, ws.player)
                    }
                }
            }
        }
        sendMessageToAll(game, message, player)
    });
    ws.on('close', function onClose(code, req){
        var playerUuid = this.player
        console.log("player "+playerUuid+" disconnected");
        var player = players[playerUuid]
        delete players[playerUuid];
        updatePlayerCount(Object.keys(players).length)
        if (player && player.kingOfCrown && game.kingOfCrownMode) {
            if(Object.keys(players).length > 1) {
                setKingOfCrown(game, Object.keys(players)[0])
            } else {
                game.kingOfCrown = null
            }
        }
        if (game != games.default && Object.keys(players).length == 0) {
            stopGame(game)
        } else {
            sendMessageToAll(game, {
                player: playerUuid,
                status: 'disconnected'
            })
        }
    })
    // ws.send('something');
});

function sendMessageToAll(game, message, except) {
    Object.keys(game.players).forEach((player) => {
        if (player !== except) {
            sendMessage(game.players[player].ws, message)
        }
    })
}

function sendMessage(client, message) {
    if (client.readyState === WebSocket.OPEN) {
        client.send(JSON.stringify(message));
        console.log('sending: %s', JSON.stringify(message));   
    }
}

function setKingOfCrown(game, playerUuid) {
    game.kingOfCrown = playerUuid
    game.kingOfCrownStartTime = Date.now()
    game.players[playerUuid].kingOfCrown = true
    game.players[playerUuid].kingOfCrownStartTime = game.kingOfCrownStartTime
    console.log(playerUuid + " is the new king!")
    sendMessageToAll(game, {
        newKing: playerUuid,
        kingOfCrownStartTime: game.kingOfCrownStartTime
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
    var timeSincelastMessage = Date.now()-ws.lastMessage
    if (ws.isAlive === false || timeSincelastMessage>300000) {
        console.log("connection terminated")
        return ws.terminate();
    }
    ws.isAlive = false;
    ws.ping(noop);
  });
}, 10000);

function heartbeat() {
    this.isAlive = true;
}

const options = {
    hostname: "rvcv9mh5l1.execute-api.us-east-1.amazonaws.com",
    path: "/test/pets",
    method: "POST",
    headers: {
        "Content-Type": "application/json",
        "x-api-key": apiKey
    }
}

function updatePlayerCount(count) {
    if (prod) {
        console.log("updating player count to " + count)
        var request = https.request(options)
        request.on('error', (error) => {
            console.error(error)
        })
        request.write(JSON.stringify({
            serverId: serverId,
            serverIp: serverIp,
            activePlayers: count
        }))
        request.end();
    }
}

function alphaOnly(a) {
    if (a) {
        return a.replace(/[^a-z]/gi, '');
    }
}

updatePlayerCount(0);
