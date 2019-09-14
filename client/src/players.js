import {AnimationMixer, Vector3, Mesh, BoxGeometry} from 'three'

import {loader} from './loader'
import {scene} from './scene'
import {init} from './archer'
import {sendMessage} from './websocket';
const models = require.context('../models/');

var players = {};
var roster = {}
var playerHitBoxes = []

players.all = function() {
    return roster;
}

players.get = (uuid) => {
    return roster[uuid]
}

players.add = function(uuid, position, race) {
    // this is a hacky way to make sure the player model isn't loaded multiple times
    roster[uuid] = {}
    if (race==null) {
        console.error("race is undefined")
        race = 'brown'
    }
    loader.load('./models/benji_'+race+'.gltf', function(gltf) {
        roster[uuid].gltf = gltf;
        init(new AnimationMixer(gltf.scene), roster[uuid]);
        if (position) {
            players.move(uuid, position, 0)
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

players.init = function(newPlayers) {
    Object.keys(newPlayers).forEach(
        (playerUuid) => {
            players.add(playerUuid,
                newPlayers[playerUuid].position,
                newPlayers[playerUuid].race);
        })
}

players.move = function(playerUuid, pos, rotation) {
    var player = roster[playerUuid]
    player.gltf.scene.position.copy(pos)
    player.gltf.scene.rotation.y = rotation
}

players.playAction = function(playerUuid, action) {
    var player = roster[playerUuid]
    player.anim[action].reset().play()
}

players.stopAction = function(playerUuid, action) {
    var player = roster[playerUuid]
    player.anim[action].stop()
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
    sendMessage({
        player: playerUuid,
        damage: 100
    })
}

export { players, animatePlayers, playerHitBoxes, killPlayer }