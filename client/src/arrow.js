import {BoxGeometry, MeshBasicMaterial, Mesh, Vector3, Raycaster} from 'three'

import {scene, collidableEnvironment} from './scene'
import {playerHitBoxes, killPlayer} from './players'
import {player1} from './player1'
import {camera} from './camera'
import {sendMessage} from './websocket';

var player1Arrows = [] // these are arrows that were shot by player1
var otherPlayerArrows = [] // these are arrows that were shot by other players
var arrowWidth = 0.06
var arrowLength = 0.75

function createArrow(origin, rotation){
    var geometry = new BoxGeometry(arrowWidth, arrowWidth, arrowLength);
    var material = new MeshBasicMaterial( {color: 0x00ff00} );
    var arrow = new Mesh( geometry, material );
    
    arrow.origin = origin
    arrow.position.copy(origin)
    arrow.rotation.copy(rotation)
    scene.add(arrow);

    return arrow
}

function shootArrow(){
    var origin = player1.scene.position.clone().add(new Vector3(0, 1.5, 0));
    var rotation = camera.rotation // this needs to be changed
    var arrow = createArrow(origin, rotation);

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
            origin: arrow.position,
            rotation: arrow.rotation,
            velocity: arrow.velocity,
            timeOfShoot: Date.now()
        }
    })
}

function addOtherPlayerArrow(newArrow) {
    var arrow = createArrow(newArrow.origin, newArrow.rotation)
    arrow.velocity = new Vector3(newArrow.velocity.x, newArrow.velocity.y, newArrow.velocity.z)
    otherPlayerArrows.push(arrow)
    moveArrow(arrow, (Date.now()-newArrow.timeOfShoot)/1000)
}

function moveArrow(arrow, delta) {
    arrow.velocity.y -= delta*9
    arrow.position.add(arrow.velocity.clone().multiplyScalar(delta))
}

function animateArrows(delta) {
    player1Arrows.forEach((arrow) => {
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
                arrow.stopped = true
                killPlayer(collision.object.playerUuid)
            }
            // detect collisions with the environment
            collisions = ray.intersectObjects(collidableEnvironment, true)
            if (collisions.length > 0) {
                arrow.position.copy(collisions.pop().point)
                arrow.stopped = true
            }
        }
    })
    otherPlayerArrows.forEach((arrow) => {
        moveArrow(arrow, delta)
    })
}

function stopArrowIfOutOfBounds(arrow) {
    if (arrow.position.x > 500 ||  arrow.position.x < -500 || arrow.position.y > 500 ||  arrow.position.y < -500 || arrow.position.z > 500 ||  arrow.position.z < -500) {
        arrow.stopped = true
    }
}

export {shootArrow, animateArrows, addOtherPlayerArrow}