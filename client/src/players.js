import {AnimationMixer} from 'three'

import {loader} from './loader'
import {scene} from './scene'
import {init} from './archer'
import playerX from '../models/benji.glb'

var players = { }

function initPlayers(newPlayers) {
    Object.keys(newPlayers).forEach(
        (playerUuid) => {
            addPlayer(playerUuid, newPlayers[playerUuid].x, newPlayers[playerUuid].z);
        })
}

function playAction(player, action) {
    player.actions[action].reset().play()
    player.activeAction = action
}

function addPlayer(uuid, x, z) {
    // this is a hacky way to make sure the player model isn't loaded multiple times
    players[uuid] = 'loading'

    loader.load(playerX, function(player) {
        var mixer = new AnimationMixer(player.scene);
        init(mixer, player);
        if (x&&z) {
            movePlayer(player, x, z, 0)
        }
        scene.add( player.scene );
        playAction(player, "idle")
        players[uuid] = player;
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

function movePlayer(player, nextPos, rotation, action) {
    player.scene.position.copy(nextPos)
    player.scene.rotation.y = rotation
    if (player.activeAction && player.activeAction != action) {
        player.actions[player.activeAction].stop()
        playAction(player, action)
    }
}

export { players, addPlayer, movePlayer, initPlayers, animatePlayers }