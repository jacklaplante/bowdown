import { Vector3 } from 'three'

import { players, playerAction } from './players'
import { player1, playerUuid } from './player1'
import { scene } from './scene'

const ws = new WebSocket('ws://localhost:18181');

ws.onopen = function open() {
    sendMessage({message: "sup fucker"})
};

ws.onmessage = function onMessage(message) {
    var message = JSON.parse(message.data)
    if (message.players) {
        players.init(message.players);
    }
    if (message.player) {
        var player = message.player;
        if (player == playerUuid) {
            if (message.damage) {
                player1.takeDamage(message.damage)
            }
        } else {
            if (!players.get(player)) {
                players.add(player, new Vector3(message.x, message.y, message.z))
            } else if (message.status==='disconnected') {
                // player disconnected, remove
                scene.remove(players.get(player).scene)
                delete players.get(player)
            } else if (players.get(player).scene && message.x && message.y && message.z && message.rotation && message.action) {
                players.move(player, new Vector3(message.x, message.y, message.z), message.rotation, message.action)
                players.get(player).state = 'moving'
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