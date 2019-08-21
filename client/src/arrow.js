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

    var origin = player1.scene.position.clone().add(new Vector3(0, 1.5, 0)) // you will want to change this to be more accurate to the bow
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
            var direction = new Vector3(0,0,-1) // this kinda works. I'm pretty sure it's a ray originating from the center of the arrow shaft and going towards the tip of the arrow. but as noted below this will miss collisions if it happens between frames (which is likely). A better solution would be to test for collision originating from the arrow tip and going backwards along the arrows path. Once a collision is detected move the arrow back to the point of collision
            direction.applyEuler(arrow.rotation).normalize()
            var ray = new Raycaster(arrow.position, direction)
            // detect collisions with the environment
            var collisions = ray.intersectObjects(collidableEnvironment, true)
            if (collisions.length > 0 && collisions[0].distance <= arrowLength) { // note: this will only work for detecting collisions with the front half of the arrow. Also this collision detection will fail if the collision happens in between frames
                arrow.stopped = true
            }
            // detect collisions with other players
            collisions = ray.intersectObjects(playerHitBoxes)
            if (collisions.length > 0 && collisions[0].distance <= arrowLength) {
                arrow.stopped = true
                killPlayer(collisions[0].object.playerUuid)
            }
        }
    })
}

export {shootArrow, animateArrows}