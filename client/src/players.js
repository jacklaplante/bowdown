import {AnimationMixer, Mesh, BoxGeometry, Euler, Geometry, LineBasicMaterial, Line, Vector3} from 'three'

import {loader} from './loader'
import scene from './scene'
import {init} from './archer'
import {sendMessage} from './websocket';
import {updateCrown} from './kingOfCrown'
import player1 from './player1';

var players = {};
var roster = {}
var playerHitBoxes = []

players.all = function() {
    return roster;
}

players.get = (uuid) => {
    return roster[uuid]
}

players.respawn = function(uuid, position, rotation, race) {
    if (roster[uuid]) {
        roster[uuid].hp = 100
        roster[uuid].gltf.scene.visible = true
        if (!rotation) {
            rotation = new Euler()
        }
        if (position) {
            players.move(uuid, position, rotation)
        }
    } else {
        players.add(uuid, {
            position: position,
            rotation: rotation,
            race: race
        })
    }
}

players.add = function(uuid, playerState) {
    // this is a hacky way to make sure the player model isn't loaded multiple times
    roster[uuid] = {hp: 100}
    if (playerState.race==null) {
        console.error("race is undefined")
        playerState.race = 'brown'
    }
    loader.load('./models/benji_'+playerState.race+'.gltf', function(gltf) {
        roster[uuid].gltf = gltf;
        init(new AnimationMixer(gltf.scene), roster[uuid]);
        if (!playerState.rotation) {
            playerState.rotation = new Euler()
        }
        if (playerState.position) {
            players.move(uuid, playerState)
        }
        scene.add( gltf.scene );

        var hitBox = new Mesh(new BoxGeometry(0.5, 2, 0.5));
        hitBox.position.y += 1
        hitBox.material.visible = false
        gltf.scene.add(hitBox)
        hitBox.playerUuid = uuid
        playerHitBoxes.push(hitBox)
    });
}

players.remove = function(uuid) {
    scene.remove(players.get(uuid).gltf.scene)
    delete roster[uuid]
}

players.update = function(playerState) {
    Object.keys(playerState).forEach(
        (playerUuid) => {
            if (playerUuid == player1.uuid) {return;}
            if (!players.get(playerUuid)) {
                players.add(playerUuid, playerState[playerUuid]);
            } else {
                players.move(playerUuid, playerState[playerUuid])
            }
        }
    )
}

players.move = function(playerUuid, playerState) {
    var player = roster[playerUuid]
    if (player.gltf) {
        player.gltf.scene.position.copy(playerState.position)
        player.gltf.scene.rotation.copy(playerState.rotation)   
    } else {
        console.warn("players.move called on a player that hasn't been loaded yet")
    }
    player.kingOfCrown = playerState.kingOfCrown
    if (player.kingOfCrown) {
        updateCrown(player)
    }
}

players.playAction = function(playerUuid, action) {
    var player = roster[playerUuid]
    player.anim[action].reset().play()
}

players.stopAction = function(playerUuid, action) {
    var player = roster[playerUuid]
    player.anim[action].stop()
}

players.takeDamage = function(playerUuid, damage) {
    var player = roster[playerUuid]
    player.hp -= damage
}

function animatePlayers(delta) {
    Object.keys(roster).forEach(
        (playerUuid) => {
            if (roster[playerUuid].mixer) {
                roster[playerUuid].mixer.update(delta)
            }
        })
}

function killPlayer(playerUuid) {
    var damage = 100
    players.takeDamage(playerUuid, damage)
    sendMessage({
        player: player1.uuid,
        damage: damage,
        to: playerUuid
    })
}

export { players, animatePlayers, playerHitBoxes, killPlayer }