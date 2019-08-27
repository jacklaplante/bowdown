import {AnimationMixer, Vector3, Mesh, BoxGeometry} from 'three'

import {loader} from './loader'
import {scene} from './scene'
import {initActions, archerAction} from './archer'
import playerX from '../models/benji.glb'
import {sendMessage} from './websocket';

var players = {};
var roster = {}
var playerHitBoxes = []

players.all = function() {
    return roster;
}

players.get = (uuid) => {
    return roster[uuid]
}

players.add = function(uuid, position) {
    // this is a hacky way to make sure the player model isn't loaded multiple times
    roster[uuid] = 'loading'
    loader.load(playerX, function(player) {
        roster[uuid] = player; // this needs to happen first, pretty sure
        initActions(new AnimationMixer(player.scene), player);
        if (position) {
            players.move(uuid, position, 0)
        }
        scene.add( player.scene );

        var hitBox = new Mesh(new BoxGeometry(0.5, 2, 0.5));
        hitBox.position.y += 1
        hitBox.material.visible = false
        player.scene.add(hitBox)
        hitBox.playerUuid = uuid
        playerHitBoxes.push(hitBox)
    });
}

players.init = function(newPlayers) {
    Object.keys(newPlayers).forEach(
        (playerUuid) => {
            players.add(playerUuid, new Vector3(
                newPlayers[playerUuid].x,
                newPlayers[playerUuid].y,
                newPlayers[playerUuid].z));
        })
}

players.move = function(playerUuid, pos, rotation, action, bowState) {
    var player = roster[playerUuid]
    player.scene.position.copy(pos)
    player.scene.rotation.y = rotation
    playerAction(player, action)
}

function animatePlayers(delta) {
    Object.keys(roster).forEach(
        (playerUuid) => {
            if (roster[playerUuid].mixer) {
                roster[playerUuid].mixer.update(delta)
            }
        })
}

function playerAction(player, action="idle", bowState="unequipped") {
    archerAction(player, action)
    player.activeAction = action
    player.bowState = bowState
}

function killPlayer(playerUuid) {
    sendMessage({
        player: playerUuid,
        damage: 100
    })
}

export { players, animatePlayers, playerHitBoxes, killPlayer }