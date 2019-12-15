import {Clock} from 'three'

import player1 from './player1/player1'
import { players } from './players'
import { addOtherPlayerArrow, stopOtherPlayerArrow } from './arrow'
import { newChatMessage } from './chat'
import { setKillCount, setKingOfCrownStartTime } from './game'
import { newKing } from './kingOfCrown'
import entities from './entities/entities'
import birds from './entities/birds'

var recordingBot = false
var log

var clock = new Clock()
var ws;
function connectToServer(serverAddress) {
    if (ws && (ws.readyState == 0 || ws.readyState == 1)) {
        ws.close();
    }
    ws = new WebSocket(serverAddress);
    ws.onmessage = onMessage;
    ws.onopen = onConnect;
}

function onConnect(){
    player1.init()
    player1.respawn()
}

function onMessage(message) {
    var message = JSON.parse(message.data)
    if (message.entities) {
        entities.update(message.entities)
    }
    if (message.players) {
        players.update(message.players);
    }
    if (message.player) {
        var playerUuid = message.player;
        if (playerUuid == player1.uuid) {
            if (message.kills) {
                setKillCount(message.kills)
            }
        }
        if (message.chatMessage) {
            newChatMessage(message.chatMessage)
        } else {
            if (message.damage && message.to) {
                if (message.to == player1.uuid) {
                    player1.takeDamage(message.damage)
                } else if (players.get(message.to)) {
                    players.takeDamage(message.to, message.damage)
                } else if (birds.get(message.to)) {
                    birds.die(message.to)
                }
            } else if (message.status==='disconnected') {
                // player disconnected, remove
                players.remove(playerUuid)
            } else if (playerUuid != player1.uuid ) {
                let player = players.get(playerUuid)
                if (!player || message.status==='respawn') {
                    players.respawn(playerUuid, message.position, message.rotation, message.race)
                } else if (player.gltf && message.position && message.rotation!=null) {
                    players.move(playerUuid, message.position, message.rotation, message.kingOfCrown)
                } else if (player.gltf && message.playAction) {
                    players.playAction(playerUuid, message.playAction)
                } else if (player.gltf && message.stopAction) {
                    players.stopAction(playerUuid, message.stopAction)
                }   
            }
        }
    }
    if (message.arrow) {
        if (message.arrow.stopped) {
            stopOtherPlayerArrow(message.arrow)
        } else {
            addOtherPlayerArrow(message.arrow)   
        }
    } else if (message.newKing) {
        var king
        if (message.newKing == player1.uuid) {
            player1.kingOfCrown = true
            king = player1
        } else {
            player1.kingOfCrown = false
            king = players.get(message.newKing)
        }
        if (king) {
            newKing(king)
        } else {
            console.warn("newKing: " + message.newKing + " does not exist")
        }
    }
    if (message.kingOfCrownStartTime) {
        setKingOfCrownStartTime(message.kingOfCrownStartTime)
    }
}

function recordBot() {
    if (process.env.NODE_ENV != 'production' && recordingBot != true) {
        recordingBot = true
        log = []
    } else if (recordingBot) {
        recordingBot = false
        console.log(JSON.stringify(log))
    }
    return recordingBot
}

function sendMessage(message) {
    if (ws.readyState == 1) {
        if (recordingBot) {
            log.push({
                elapsedTime: clock.getDelta(),
                message: message
            })
        }
        ws.send(JSON.stringify(message))
    } else {
        console.error("error connecting to server")
        var message = document.createElement("p")
        message.id = "disconnect-message"
        message.innerText = "Disconnected from server, please refresh the page"
        document.body.append(message)
    }
}

export {sendMessage, recordBot, connectToServer}