import {BoxGeometry, MeshBasicMaterial, Mesh, Vector3, Raycaster, Geometry, LineBasicMaterial, Line, Quaternion, TextureLoader, SpriteMaterial, Sprite} from 'three'

import scene from '../scene/scene'
import {playerHitBoxes, broadcastDamage, players} from '../players'
import player1 from '../player1/player1'
import camera from '../camera'
import {sendMessage} from '../websocket'
import {uuid} from '../utils'
import birds from '../entities/birds'

import spriteMap from '../../sprites/circle.png'

var player1Arrows = [] // these are arrows that were shot by player1
var otherPlayerArrows = [] // these are arrows that were shot by other players
var arrowWidth = 0.03
var arrowLength = 0.75
var textureLoader = new TextureLoader();
var spriteTexture = textureLoader.load(spriteMap);
const localOffset = new Vector3(0, 1.5, 0)
const arrowTypes = {
    normal: {
        color: 0x211b15
    },
    rope: {
        color: 0xff7b00
    }
}

var initAudio
import(/* webpackMode: "lazy" */ './audio').then((audio) => {
    initAudio = audio.default
})

function createArrow(origin, rotation, type){
    if (!arrowTypes[type]) console.error("arrow type: " + type + " does not exist");
    var geometry = new BoxGeometry(arrowWidth, arrowWidth, arrowLength);
    var material = new MeshBasicMaterial({color: arrowTypes[type].color});
    var arrow = new Mesh( geometry, material );
    
    arrow.arrow = true
    arrow.origin = origin
    arrow.position.copy(origin)
    arrow.rotation.copy(rotation)
    arrow.type = type

    if (initAudio) initAudio(arrow)

    scene.add(arrow);

    var spriteMaterial = new SpriteMaterial({map: spriteTexture, color: 0xffffff});
    spriteMaterial.sizeAttenuation = false
    var sprite = new Sprite(spriteMaterial);
    sprite.name = "sprite"
    sprite.scale.set(0.03, 0.03, 0.03)
    arrow.add(sprite);

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
    var collisions = raycaster.intersectObjects(scene.getCollidableEnvironment().concat(playerHitBoxes), true)
    var direction;
    if (collisions.length > 0) {
        direction = collisions[0].point.sub(origin)
    } else {
        direction = new Vector3()
        camera.getWorldDirection(direction)
    }

    arrow.velocity = player1.getVelocity().add(direction.normalize().multiplyScalar(getArrowVelocity(type)))
    player1Arrows.push(arrow)

    sendMessage({
        player: player1.uuid,
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
    if (scene.gravityDirection=="down") {
        arrow.velocity.sub(new Vector3(0, 9*delta, 0))
    } else {
        arrow.velocity.sub(arrow.position.clone().normalize().multiplyScalar(9*delta))
        var nextPos = arrow.position.clone().add(arrow.velocity.clone().multiplyScalar(delta))
        var quat = new Quaternion().setFromUnitVectors(arrow.position.clone().normalize(), nextPos.clone().normalize())
        arrow.applyQuaternion(quat)
    }
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
            // detect collisions with other players and birds
            var collisions = ray.intersectObjects(playerHitBoxes.concat(birds.hitBoxes))
            if (collisions.length > 0) {
                var collision = collisions.pop()
                arrow.position.copy(collision.point)
                if (arrow.hitPlayerSound) arrow.hitPlayerSound.play()
                let targetUuid = collision.object.hitBoxFor
                stopPlayer1Arrow(arrow, targetUuid)
                let target
                if (players.get(targetUuid)) {
                    target = players.get(targetUuid).gltf.scene
                    let damage
                    if (collision.object.hitBoxType == "head") {
                        damage = 100
                    } else {
                        damage =  50
                    }
                    broadcastDamage(targetUuid, damage)
                } else {
                    target = birds.get(targetUuid).gltf.scene
                    birds.kill(targetUuid, player1.uuid)
                    birds.die(targetUuid)
                }
                addArrowToTarget(arrow, target)
            }
            // detect collisions with the environment
            var collidable = scene.getCollidableEnvironment([arrow.origin, arrow.position])
            if (collidable) {
                collisions = ray.intersectObjects(collidable, true)
                if (collisions.length > 0) {
                    arrow.position.copy(collisions.pop().point)
                    if (arrow.hitSound) arrow.hitSound.play()
                    stopPlayer1Arrow(arrow)
                }
            }
        }
    })
    Object.keys(otherPlayerArrows).forEach((arrowUuid) => {
        if (!otherPlayerArrows[arrowUuid].stopped) {
            moveArrow(otherPlayerArrows[arrowUuid], delta)   
        }
    })
}

function stopPlayer1Arrow(arrow, targetUuid) {
    arrow.stopped = true
    arrow.remove(arrow.getObjectByName("sprite"))
    sendMessage({
        player: player1.uuid,
        arrow: {
            stopped: true,
            position: arrow.position,
            arrowUuid: arrow.uuid,
            targetUuid: targetUuid
        }
    })
}

function addArrowToTarget(arrow, target) { // arrow and target must be Object3D's
    scene.remove(arrow)
    target.worldToLocal(arrow.position)
    target.add(arrow)
    if (target.arrows) {
        target.arrows.push(arrow)
    } else {
        target.arrows = [arrow]
    }
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

function getArrowVelocity(type) {
    if (type == 'rope') {
        return 30
    }
    return 60
}

function stopOtherPlayerArrow(stoppedArrow) {
    let arrow = otherPlayerArrows[stoppedArrow.arrowUuid]
    arrow.position.copy(stoppedArrow.position)
    if (stoppedArrow.targetUuid) {
        if (players.get(stoppedArrow.targetUuid)) {
            addArrowToTarget(arrow, players.get(stoppedArrow.targetUuid).gltf.scene)
        } else if (player1.uuid == stoppedArrow.targetUuid) {
            addArrowToTarget(arrow, player1.gltf.scene)
        } else if (birds.get(stoppedArrow.targetUuid)) {
            addArrowToTarget(arrow, birds.get(stoppedArrow.targetUuid).gltf.scene)
        }
    }
    arrow.stopped = true
    if (arrow.hitSound) arrow.hitSound.play()
}

function stopArrowIfOutOfBounds(arrow) {
//     if (arrow.position.x > 500 ||  arrow.position.x < -500 || arrow.position.y > 500 ||  arrow.position.y < -500 || arrow.position.z > 500 ||  arrow.position.z < -500) {
//         arrow.stopped = true
//     }
}

export {shootArrow, animateArrows, addOtherPlayerArrow, stopOtherPlayerArrow, retractRopeArrow}