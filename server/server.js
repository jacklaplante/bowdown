const fs = require('fs');
const WebSocket = require('ws');
const https = require('https');

const entities = require('./entities')

const playerLimit = 20
const prod = process.argv[2] == 'prod'

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
const payloads = {}
const connections = {}
var defaultGame = initGame('default')
defaultGame.kingOfCrownMode = true
defaultGame.kingOfCrown
defaultGame.kingOfCrownStartTime

function initGame(gameName) {
    console.log("Starting game: " + gameName)
    games[gameName] = {}
    payloads[gameName] = {}
    let game = games[gameName]
    game.players = {}
    game.entities = {}
    entities.init(games, payloads, gameName)
    return game
}

function getGame(gameName) {
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

function getGameName(url) {
    var name = alphaOnly(url)
    if (name) return name
    return 'default'
}

function stopGame(game) {
    delete game
    console.log("Stopping game: " + game)
}

wss.shouldHandle = function(request) {
    var game = getGame(alphaOnly(request.url))
    if (Object.keys(game.players).length > playerLimit) {
        return false
    }
    return true
}

wss.on('connection', function connection(ws, req) {
    let gameName = getGameName(req.url)
    var game = getGame(gameName)
    var players = game.players
    ws.isAlive = true;
    ws.on('pong', heartbeat);
    broadcastGameState(game)
    ws.on('message', function incoming(message) {
        message = JSON.parse(message)
        ws.lastMessage = Date.now()
        if(message.player){
            var playerUuid = message.player
            if (!players[playerUuid]) {
                // init player in server
                players[playerUuid] = {
                    hp: 100,
                    kills: 0
                }
                connections[playerUuid] = {ws: ws}
                updatePlayerCount(Object.keys(players).length)
            }
            if (!ws.player) {
                ws.player = playerUuid
            }
            if (getGame(gameName).kingOfCrownMode && Object.keys(players).length == 2 && game.kingOfCrown == null && !players[playerUuid].kingOfCrown) {
                setKingOfCrown(getGame(gameName), playerUuid)
            }
            if (message.position) {
                updatePlayer(gameName, playerUuid, 'position', message.position)
            }
            if (message.velocity) {
                updatePlayer(gameName, playerUuid, 'velocity', message.velocity)
            }
            if (message.race) {
                updatePlayer(gameName, playerUuid, 'race', message.race)
            }
            if (message.rotation) {
                updatePlayer(gameName, playerUuid, 'rotation', message.rotation)
            }
            if (message.damage && message.to) {
                var newHp = players[message.to].hp - message.damage
                updatePlayer(gameName, playerUuid, 'hp', newHp)
                if (players[message.to].hp <= 0) {
                    var kills = players[playerUuid].kills + 1
                    updatePlayer(gameName, playerUuid, 'kills', kills)
                    if (getGame(gameName).kingOfCrownMode && players[message.to].kingOfCrown) {
                        setKingOfCrown(getGame(gameName), ws.player)
                    }
                }
            }
        }
    });
    ws.on('close', function onClose(code, req){
        removeConnection(this.player)
        removePlayer(game, this.player)
        if (this.player && this.player.kingOfCrown && game.kingOfCrownMode) {
            if(Object.keys(players).length > 1) {
                setKingOfCrown(game, Object.keys(players)[0])
            } else {
                game.kingOfCrown = null
            }
        }
        if (game != games.default && Object.keys(players).length == 0) {
            stopGame(game)
        }
    })
});

setInterval( () => {
    Object.keys(games).forEach((gameName) => {
        dumpPayload(gameName)  
    })
}, 50);

function removeConnection(playerUuid) {
    delete connections[playerUuid]
}

function updatePlayer(gameName, playerUuid, key, value) {
    if (!payloads[gameName].players) payloads[gameName].players = {}
    if (!payloads[gameName].players[playerUuid]) payloads[gameName].players[playerUuid] = {}
    payloads[gameName].players[playerUuid][key] = value
    getGame(gameName).players[playerUuid][key] = value
}

function removePlayer(game, playerUuid) {
    console.log("player "+playerUuid+" disconnected");
    delete game.players[playerUuid];
    updatePlayerCount(Object.keys(game.players).length)
}

function dumpPayload(gameName) {
    if (payloads[gameName] && Object.entries(payloads[gameName]).length == 0) return;
    Object.keys(getGame(gameName).players).forEach((playerUuid) => {
        let connection = connections[playerUuid]
        if (connection.ws.readyState === WebSocket.OPEN) {
            var message = JSON.stringify(payloads[gameName])
            console.log('sending: %s', message);
            connection.ws.send(message);
        }
    })
    payloads[gameName] = {}
}

function broadcastGameState(game) {
    Object.keys(game.players).forEach((playerUuid) => {
        let connection = connections[playerUuid]
        if (connection.ws.readyState === WebSocket.OPEN) {
            var message = JSON.stringify(game)
            console.log('sending: %s', message);
            connection.ws.send(message);
        }
    })
}

function setKingOfCrown(game, playerUuid) {
    game.kingOfCrown = playerUuid
    game.kingOfCrownStartTime = Date.now()
    game.players[playerUuid].kingOfCrown = true
    game.players[playerUuid].kingOfCrownStartTime = game.kingOfCrownStartTime
    console.log(playerUuid + " is the new king!")
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
