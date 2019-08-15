import {BoxGeometry, MeshBasicMaterial, Mesh, Vector3} from 'three'

import {scene} from './scene'
import {player1} from './player1'

var arrows = []

function createArrow(){
    var geometry = new BoxGeometry(0.02, 0.02, 0.75);
    var material = new MeshBasicMaterial( {color: 0x00ff00} );
    var arrow = new Mesh( geometry, material );
    arrow.position.copy(player1.scene.position).add(new Vector3(0,1,0))
    arrow.rotation.copy(player1.scene.rotation)
    var direction = new Vector3()
    player1.scene.getWorldDirection(direction)
    arrow.velocity = direction.normalize()
    scene.add( arrow );
    arrows.push(arrow)
}

function shootArrow(){
    createArrow();
}

function animateArrows(delta) {
    arrows.forEach((arrow) => {
        arrow.position.add(arrow.velocity.clone().multiplyScalar(delta))
    })
}

export {shootArrow, animateArrows}