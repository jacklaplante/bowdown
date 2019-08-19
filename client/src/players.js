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
        players[uuid] = player;
    });
}

function movePlayer(player, nextPos, rotation) {
    player.scene.position.copy(nextPos)
    if (rotation!=null) {
        player.scene.rotation.y = rotation;
    }
}

export { players, addPlayer, movePlayer, initPlayers }