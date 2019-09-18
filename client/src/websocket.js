import { Vector3 } from 'three'

import { players } from './players'
import player1 from './player1'
import { scene } from './scene'
import { addOtherPlayerArrow, stopOtherPlayerArrow } from './arrow'
import { newChatMessage } from './chat'
import { setKillCount } from './game'

var serverAddress
if (process.env.NODE_ENV == 'production') {
    serverAddress = 'ws://ec2-18-191-136-250.us-east-2.compute.amazonaws.com:18181'
} else {
    serverAddress = 'ws://localhost:18181'
}

const ws = new WebSocket(serverAddress);

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
            } else if (!players.get(player)) {
                players.add(player, message.position, message.race)
            } else if (players.get(player).gltf && message.position && message.rotation!=null) {
                players.move(player, message.position, message.rotation)
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
    }
}

function sendMessage(message) {
    if (ws.readyState == 1) {
        ws.send(JSON.stringify(message))
    } else {
        console.error("error connecting to server")
    }
}

export { ws, sendMessage }