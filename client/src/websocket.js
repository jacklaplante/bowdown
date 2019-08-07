import { Vector3 } from 'three'

import { players, addPlayer, movePlayer, initPlayers } from './players'
import { playerUuid } from './player1'
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
        if (!players[player] && player != playerUuid) {
            addPlayer(player, message.x, message.y)
        } else if (message.status==='disconnected') {
            // player disconnected, remove
            scene.remove(players[player].scene)
            delete players[player]
        } else if (players[player].scene && message.x && message.y && message.z && message.rotation) {
            movePlayer(players[player], new Vector3(message.x, message.y, message.z), message.rotation)
            players[player].state = 'moving'
        }
    }
}

function sendMessage (message) {
    ws.send(JSON.stringify(message))
}

export { ws, sendMessage }