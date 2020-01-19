import {Clock} from 'three'

import player1 from './player1/player1'
import { players } from './players'
import { addOtherPlayerArrow, stopOtherPlayerArrow } from './arrow/arrow'
import { newChatMessage } from './chat'
import { setKillCount, setKingOfCrownStartTime } from './game'
import { newKing } from './kingOfCrown'
import entities from './entities/entities'
import birds from './entities/birds'
import killFeed from './killFeed'

var recordingBot = false
var log

var clock = new Clock()
var ws;
var status;
function connectToServer(serverAddress) {
    if (ws && ws.readyState == 1) {
        ws.close();
    }
    ws = new WebSocket(serverAddress);
    ws.onmessage = onMessage;
    ws.onopen = function() {
        status = "joining"
    };
}

function onMessage(message) {
    var message = JSON.parse(message.data)
    if (message.entities) {
        entities.update(message.entities)
    }
    if (message.players) {
        players.update(message.players);
    }
    if (status == "joining") {
        player1.respawn();
        status = "joined"
    }
    if (message.player) {
        var playerUuid = message.player;
        if (playerUuid == player1.uuid) {
            if (message.kills) {
                setKillCount(message.kills)
            }
        }
        if (message.chatMessage && message.player.uuid != player1.uuid) {
            newChatMessage(message.chatMessage, message.player.name)
        } else {
            let toPlayer = players.get(message.to)
            let newKillFeed
            if (message.damage && message.to) {
                if (message.to == player1.uuid) {
                    player1.takeDamage(message.damage)
                    newKillFeed = {
                        to: window.playerName,
                        from: players.get(playerUuid).name,
                        hp: player1.hp
                    }
                } else if (toPlayer) {
                    players.takeDamage(message.to, message.damage)
                    if (playerUuid == player1.uuid) {
                        newKillFeed = {
                            to: toPlayer.name,
                            from: window.playerName,
                            hp: toPlayer.hp
                        }
                    } else {
                        newKillFeed = {
                            to: toPlayer.name,
                            from: players.get(playerUuid).name,
                            hp: toPlayer.hp
                        }
                    }
                } else if (birds.get(message.to)) {
                    birds.die(message.to)
                }
                if (newKillFeed) {
                    if (newKillFeed.hp <= 0) {
                        killFeed(newKillFeed.from, newKillFeed.to)
                    }
                }
            } else if (message.status==='disconnected') {
                // player disconnected, remove
                players.remove(playerUuid)
            } else if (playerUuid != player1.uuid ) {
                let player = players.get(playerUuid)
                if (!player || message.status==='respawn') {
                    players.respawn(playerUuid, message.position, message.rotation, message.race, message.name)
                } else {
                    if (player.gltf && message.position && message.rotation!=null) {
                        players.move(playerUuid, message.position, message.rotation, message.kingOfCrown)
                    }
                    if (player.gltf && message.playAction) {
                        players.playAction(playerUuid, message.playAction)
                    } else if (player.gltf && message.stopAction) {
                        players.stopAction(playerUuid, message.stopAction)
                    }
                    if (player.gltf && message.playSound) {
                        players.playSound(playerUuid, message.playSound)
                    }
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
    if (!ws) return
    if (ws.readyState == 1) {
        if (recordingBot) {
            log.push({
                elapsedTime: clock.getDelta(),
                message: message
            })
        }
        ws.send(JSON.stringify(message))
    } else if (ws.readyState == 0) {
        console.warn("still connecting to server")
    } else {
        console.error("error connecting to server")
        var message = document.createElement("p")
        message.id = "disconnect-message"
        message.innerText = "Disconnected from server, please refresh the page"
        document.body.append(message)
    }
}

export {sendMessage, recordBot, connectToServer}