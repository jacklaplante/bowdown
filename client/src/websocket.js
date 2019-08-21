import { Vector3 } from 'three'

import { players, addPlayer, movePlayer, initPlayers, playerAction } from './players'
import { player1, playerUuid } from './player1'
import { scene } from './scene'

const ws = new WebSocket('ws://localhost:18181');

ws.onopen = function open() {
    sendMessage({message: "sup fucker"})
};

ws.onmessage = function onMessage(message) {
    var message = JSON.parse(message.data)
    if (message.players) {
        initPlayers(message.players);
    }
    if (message.player) {
        var player = message.player;
        if (player == playerUuid) {
            if (message.damage) {
                player1.takeDamage(message.damage)
            }
        } else {
            if (!players[player]) {
                addPlayer(player, message.x, message.y)
            } else if (message.status==='disconnected') {
                // player disconnected, remove
                scene.remove(players[player].scene)
                delete players[player]
            } else if (players[player].scene && message.x && message.y && message.z && message.rotation && message.action) {
                movePlayer(player, new Vector3(message.x, message.y, message.z), message.rotation, message.action)
                players[player].state = 'moving'
            } else if (message.action) {
                playerAction(player, message.action)
            }
        }
    }
}

function sendMessage(message) {
    ws.send(JSON.stringify(message))
}

export { ws, sendMessage }