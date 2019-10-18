import { Vector3, Clock } from 'three'

import { players } from './players'
import player1 from './player1'
import { scene } from './scene'
import { addOtherPlayerArrow, stopOtherPlayerArrow } from './arrow'
import { newChatMessage } from './chat'
import { setKillCount } from './game'

var serverAddress
var recordingBot = false
var log
if (process.env.NODE_ENV == 'production') {
    serverAddress = 'wss://ws.bowdown.io:18181'
} else {
    serverAddress = 'ws://localhost:18181'
}

const ws = new WebSocket(serverAddress);

var clock = new Clock()

ws.onmessage = function onMessage(message) {
    var message = JSON.parse(message.data)
    if (message.players) {
        players.init(message.players);
    }
    if (message.player) {
        var player = message.player;
        if (player == player1.uuid) {
            if (message.damage) {
                player1.takeDamage(message.damage)
            } else if (message.kills) {
                setKillCount(message.kills)
            }
        } else if (message.chatMessage) {
            newChatMessage(message.chatMessage)
        } else {
            if (message.status==='disconnected') {
                // player disconnected, remove
                scene.remove(players.get(player).gltf.scene)
                delete players.get(player)
                if (message.newKing == player1.uuid) {
                    player1.kingOfCrown == true
                }
            } else if (!players.get(player)) {
                players.add(player, message.position, message.race, message.rotation)
            } else if (players.get(player).gltf && message.position && message.rotation!=null) {
                players.move(player, message.position, message.rotation, message.kingOfCrown)
            } else if (players.get(player).gltf && message.playAction) {
                players.playAction(player, message.playAction)
            } else if (players.get(player).gltf && message.stopAction) {
                players.stopAction(player, message.stopAction)
            }
        }
    } else if (message.arrow) {
        if (message.arrow.stopped) {
            stopOtherPlayerArrow(message.arrow)
        } else {
            addOtherPlayerArrow(message.arrow)   
        }
    } else if (message.newKing == player1.uuid) {
        player1.kingOfCrown = true
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
}

function sendMessage(message) {
    if (ws.readyState == 1) {
        if (recordingBot) {
            log[Math.round(clock.getElapsedTime()*100)] = message
        }
        ws.send(JSON.stringify(message))
    } else {
        console.error("error connecting to server")
    }
}

export { ws, sendMessage, recordBot }