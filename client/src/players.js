import {AnimationMixer, Mesh, BoxGeometry, Euler, Vector3} from 'three'

import {loader} from './loader'
import scene from './scene/scene'
import {init} from './archer/archer'
import {sendMessage} from './websocket';
import {updateCrown} from './kingOfCrown'
import player1 from './player1/player1';

const benji = require.context("../models/benji");

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
    let player = roster[uuid]
    if (playerState.race==null) {
        console.error("race is undefined")
        playerState.race = 'brown'
    }
    loader.load(benji("./benji_" + playerState.race + ".gltf"), function(gltf) {
        player.gltf = gltf;
        init(player);
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
        hitBox.hitBoxFor = uuid
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
    let player = roster[playerUuid]
    if (player.gltf) {
        player.gltf.scene.position.copy(playerState.position)
        player.gltf.scene.rotation.copy(playerState.rotation)
        player.velocity = playerState.velocity
        if (playerState.hp != null) player.hp = playerState.hp
        if (!player.gltf.scene.visible && player.hp > 100) player.gltf.scene.visible = true
    } else {
        console.warn("players.move called on a player that hasn't been loaded yet")
    }
    if (playerState.kingOfCrown != null) { player.kingOfCrown = playerState.kingOfCrown }
    if (player.kingOfCrown) {
        updateCrown(player)
    }
}

players.playAction = function(playerUuid, action) {
    var player = roster[playerUuid]
    if (action.includes("run")) {
        player.running = true
    } else if (action.includes("idle")) {
        player.running = false
    }
    player.anim[action].reset().play()
}

players.stopAction = function(playerUuid, action) {
    var player = roster[playerUuid]
    player.anim[action].stop()
}

players.playSound = function(playerUuid, sound) {
    let player = roster[playerUuid]
    if (player.sounds) player.playSound(sound)
}

players.takeDamage = function(playerUuid, damage) {
    var player = roster[playerUuid]
    player.hp -= damage
}

function animatePlayers(delta) {
    Object.keys(roster).forEach(
        (playerUuid) => {
            let player = roster[playerUuid]
            if (player.velocity) {
                let velocity = new Vector3(player.velocity.x, player.velocity.y, player.velocity.z)
                if (velocity.length() > 0) {
                    player.gltf.scene.position.add(velocity.multiplyScalar(delta))
                }   
            }
            if (player.mixer) {
                player.mixer.update(delta)
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