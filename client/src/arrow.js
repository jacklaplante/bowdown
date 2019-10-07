import {BoxGeometry, MeshBasicMaterial, Mesh, Vector3, Raycaster, Geometry, LineBasicMaterial, Line, PositionalAudio, AudioLoader} from 'three'

import {scene, collidableEnvironment} from './scene'
import {playerHitBoxes, killPlayer} from './players'
import player1 from './player1'
import {camera} from './camera'
import {sendMessage} from './websocket'
import {uuid} from './utils'

import arrowHitGroundAudio from '../audio/effects/Arrow to Ground.mp3'
import arrowHitPlayerAudio from '../audio/effects/Arrow to Player.mp3'

var player1Arrows = [] // these are arrows that were shot by player1
var otherPlayerArrows = [] // these are arrows that were shot by other players
var arrowWidth = 0.06
var arrowLength = 0.75
const localOffset = new Vector3(0, 1.5, 0)
const arrowTypes = {
    normal: {
        color: 0x00ff00
    },
    rope: {
        color: 0xff7b00
    }
}

var audioLoader = new AudioLoader();
var sounds = {}
sounds.arrowHitGround = new PositionalAudio(camera.listener);
sounds.arrowHitPlayer = new PositionalAudio(camera.listener);
audioLoader.load(arrowHitGroundAudio, function(buffer) {
    sounds.arrowHitGround.setBuffer(buffer);
    sounds.arrowHitGround.setRefDistance(5);
})
audioLoader.load(arrowHitPlayerAudio, function(buffer) {
    sounds.arrowHitPlayer.setBuffer(buffer);
    sounds.arrowHitPlayer.setRefDistance(5);
})

function createArrow(origin, rotation, type){
    if (!arrowTypes[type]) console.error("arrow type: " + type + " does not exist");
    var geometry = new BoxGeometry(arrowWidth, arrowWidth, arrowLength);
    var material = new MeshBasicMaterial({color: arrowTypes[type].color});
    var arrow = new Mesh( geometry, material );
    arrow.add(sounds.arrowHitGround)
    arrow.add(sounds.arrowHitPlayer)
    
    arrow.origin = origin
    arrow.position.copy(origin)
    arrow.rotation.copy(rotation)
    scene.add(arrow);

    arrow.type = type

    return arrow
}

function shootArrow(type){
    var origin = player1.getPosition().add(getGlobalOffset());
    var rotation = camera.rotation // this needs to be changed
    var arrow = createArrow(origin, rotation, type);
    arrow.uuid = uuid()
    arrow.playerUuid = player1.uuid

    // if the reticle (center of screen) is pointed at something, aim arrows there! otherwise estimate where the player is aiming 
    var raycaster = new Raycaster()
    raycaster.setFromCamera({x: 0, y: 0}, camera) // the {x: 0, y: 0} means the center of the screen; there may eventually be issues with this not actually lining up with the html reticle
    var collisions = raycaster.intersectObjects(collidableEnvironment.concat(playerHitBoxes), true)
    var direction;
    if (collisions.length > 0) {
        direction = collisions[0].point.sub(origin)
    } else {
        direction = new Vector3()
        camera.getWorldDirection(direction)
    }

    arrow.velocity = direction.normalize().multiplyScalar(60)
    player1Arrows.push(arrow)

    sendMessage({
        arrow: {
            type: type,
            origin: arrow.position,
            uuid: arrow.uuid,
            player: player1.uuid,
            rotation: arrow.rotation,
            velocity: arrow.velocity,
            timeOfShoot: Date.now()
        }
    })

    return arrow
}

function addOtherPlayerArrow(newArrow) {
    var arrow = createArrow(newArrow.origin, newArrow.rotation, newArrow.type)
    arrow.uuid = newArrow.uuid
    arrow.player = newArrow.player
    arrow.velocity = new Vector3(newArrow.velocity.x, newArrow.velocity.y, newArrow.velocity.z)
    otherPlayerArrows[arrow.uuid] = arrow
    moveArrow(arrow, (Date.now() - newArrow.timeOfShoot)/1000)
}

function moveArrow(arrow, delta) {
    arrow.velocity.sub(arrow.position.clone().normalize().multiplyScalar(9*delta))
    arrow.position.add(arrow.velocity.clone().multiplyScalar(delta))
}

function animateArrows(delta) {
    player1Arrows.forEach((arrow) => {
        if (arrow.type=="rope") {
            if (arrow.rope) {
                scene.remove(arrow.rope)
            }
            var geometry = new Geometry();
            var material = new LineBasicMaterial({color: 0xfffae8, linewidth: 10});
            geometry.vertices.push(player1.getPosition().add(getGlobalOffset()), arrow.position);
            var line = new Line(geometry, material)
            arrow.rope = line
            scene.add(line)
        }
        if(!arrow.stopped){
            stopArrowIfOutOfBounds(arrow)
            moveArrow(arrow, delta)
            // detect arrow collisions
            var direction = new Vector3(0,0,1)
            direction.applyEuler(arrow.rotation).normalize()
            var collisionTrail = arrow.position.clone().sub(arrow.origin).length()/2 // this is the length of the ray that will be used to detect collisions
            // right now it is the distance from the arrow to the point where the arrow was fired, divided by 2
            // dividing it by 2 is really just a hack. if you don't divide it by 2, the ray would collide with the ground at the players feet when the arrow is shot into the air because the arrow was falling slightly due to gravity
            var ray = new Raycaster(arrow.position, direction, 0, collisionTrail)
            // detect collisions with other players
            var collisions = ray.intersectObjects(playerHitBoxes)
            if (collisions.length > 0) {
                var collision = collisions.pop()
                arrow.position.copy(collision.point)
                sounds.arrowHitPlayer.play()
                arrow.stopped = true
                killPlayer(collision.object.playerUuid)
            }
            // detect collisions with the environment
            collisions = ray.intersectObjects(collidableEnvironment, true)
            if (collisions.length > 0) {
                arrow.position.copy(collisions.pop().point)
                sounds.arrowHitGround.play()
                arrow.stopped = true
                sendMessage({
                    arrow: {
                        stopped: true,
                        position: arrow.position,
                        uuid: arrow.uuid
                    }
                })
            }
        }
    })
    Object.keys(otherPlayerArrows).forEach((arrowUuid) => {
        if (!otherPlayerArrows[arrowUuid].stopped) {
            moveArrow(otherPlayerArrows[arrowUuid], delta)   
        }
    })
}

function retractRopeArrow() {
    player1Arrows.forEach((arrow) => {
        if (arrow.type == "rope") {
            arrow.type = null
            scene.remove(arrow.rope)
        }
    })
}

function getGlobalOffset() {
    return player1.globalVector(localOffset)
}

function stopOtherPlayerArrow(stoppedArrow) {
    otherPlayerArrows[stoppedArrow.uuid].position.copy(stoppedArrow.position)
    otherPlayerArrows[stoppedArrow.uuid].stopped = true
}

function stopArrowIfOutOfBounds(arrow) {
//     if (arrow.position.x > 500 ||  arrow.position.x < -500 || arrow.position.y > 500 ||  arrow.position.y < -500 || arrow.position.z > 500 ||  arrow.position.z < -500) {
//         arrow.stopped = true
//     }
}

export {shootArrow, animateArrows, addOtherPlayerArrow, stopOtherPlayerArrow, retractRopeArrow}