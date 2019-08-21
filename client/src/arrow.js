import {BoxGeometry, MeshBasicMaterial, Mesh, Vector3, Raycaster} from 'three'

import {scene, collidableEnvironment} from './scene'
import {playerHitBoxes, killPlayer} from './players'
import {player1} from './player1'
import {camera} from './camera'

var arrows = []
var arrowWidth = 0.06
var arrowLength = 0.75

function createArrow(){
    var geometry = new BoxGeometry(arrowWidth, arrowWidth, arrowLength);
    var material = new MeshBasicMaterial( {color: 0x00ff00} );
    var arrow = new Mesh( geometry, material );

    var origin = player1.scene.position.clone().add(new Vector3(0, 1.5, 0))
    arrow.origin = origin
    arrow.position.copy(origin)
    arrow.rotation.copy(camera.rotation) // this needs to be changed

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
    scene.add(arrow);
    arrows.push(arrow)
}

function shootArrow(){
    createArrow();
}

function animateArrows(delta) {
    arrows.forEach((arrow) => {
        if(!arrow.stopped){
            arrow.velocity.y -= delta*9
            arrow.position.add(arrow.velocity.clone().multiplyScalar(delta))
            // detect arrow collisions
            var direction = new Vector3(0,0,1)
            direction.applyEuler(arrow.rotation).normalize()
            var ray = new Raycaster(arrow.position, direction, 0, arrow.position.clone().sub(arrow.origin).length())
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
}

export {shootArrow, animateArrows}