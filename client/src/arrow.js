import {BoxGeometry, MeshBasicMaterial, Mesh, Vector3, Raycaster} from 'three'

import {scene, collidableEnvironment} from './scene'
import {player1} from './player1'
import {camera} from './camera'

var arrows = []

function createArrow(){
    var geometry = new BoxGeometry(0.02, 0.02, 0.75);
    var material = new MeshBasicMaterial( {color: 0x00ff00} );
    var arrow = new Mesh( geometry, material );

    var origin = player1.scene.position.clone().add(new Vector3(0,1,0)) // you will want to change this to be more accurate to the bow
    arrow.position.copy(origin)
    arrow.rotation.copy(camera.rotation) // this needs to be changed

    // if the reticle (center of screen) is pointed at something, aim arrows there! otherwise estimate where the player is aiming 
    var raycaster = new Raycaster()
    raycaster.setFromCamera({x: 0, y: 0}, camera) // the {x: 0, y: 0} means the center of the screen; there may eventually be issues with this not actually lining up with the html reticle
    var collisions = raycaster.intersectObjects(collidableEnvironment, true)
    var direction;
    if (collisions.length > 0) {
        direction = collisions[0].point.sub(origin)
    } else {
        direction = new Vector3()
        camera.getWorldDirection(direction)
    }

    arrow.velocity = direction.normalize().multiplyScalar(30)
    scene.add(arrow);
    arrows.push(arrow)
}

function shootArrow(){
    createArrow();
}

function animateArrows(delta) {
    arrows.forEach((arrow) => {
        arrow.velocity.y -= delta*9
        arrow.position.add(arrow.velocity.clone().multiplyScalar(delta))
    })
}

export {shootArrow, animateArrows}