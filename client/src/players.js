import {AnimationMixer, Vector3, Mesh, BoxGeometry} from 'three'

import {loader} from './loader'
import {scene} from './scene'
import {initActions} from './archer'
import playerX from '../models/benji.glb'
import {sendMessage} from './websocket';

var players = { }
var playerHitBoxes = []

function initPlayers(newPlayers) {
    Object.keys(newPlayers).forEach(
        (playerUuid) => {
            addPlayer(playerUuid, newPlayers[playerUuid].x, newPlayers[playerUuid].z);
        })
}

function playAction(player, action) {
    if (player.actions && player.actions[action]) {
        if (player.activeAction) {
            if (player.activeAction != action) {
                player.actions[player.activeAction].stop()
            } else  {
                return
            }
        }
        player.actions[action].reset().play()
        player.activeAction = action
    }
}

function addPlayer(uuid, x, y, z) {
    // this is a hacky way to make sure the player model isn't loaded multiple times
    players[uuid] = 'loading'

    loader.load(playerX, function(player) {
        players[uuid] = player; // this needs to happen first, pretty sure
        initActions(new AnimationMixer(player.scene), player);
        if (x&&y&&z) {
            movePlayer(uuid, new Vector3(x, y, z), 0)
        }
        scene.add( player.scene );
        playAction(player, "idle")

        var hitBox = new Mesh(new BoxGeometry(0.5, 2, 0.5));
        hitBox.material.visible = false
        hitBox.position.y+=1
        player.scene.add(hitBox)
        hitBox.playerUuid = uuid
        playerHitBoxes.push(hitBox)
    });
}

function animatePlayers(delta) {
    Object.keys(players).forEach(
        (playerUuid) => {
            if (players[playerUuid].mixer) {
                players[playerUuid].mixer.update(delta)
            }
        })
}

function movePlayer(playerUuid, nextPos, rotation, action) {
    var player = players[playerUuid]
    player.scene.position.copy(nextPos)
    player.scene.rotation.y = rotation
    playAction(player, action)
}

function playerAction(playerUuid, action) {
    var player = players[playerUuid]
    if (player) {
        playAction(player, action)
    }
}

function killPlayer(playerUuid) {
    sendMessage({
        player: playerUuid,
        damage: 100
    })
}

export { players, addPlayer, movePlayer, initPlayers, animatePlayers, playerAction, playerHitBoxes, killPlayer }