import { Clock, Vector3 } from 'three'

import { scene } from './scene'
import { renderer } from './renderer'
import { camera, cameraTarget, updateCamera } from './camera'
import { player1, mixer } from './player1'

var clock = new Clock()
document.body.appendChild( renderer.domElement )
var theta = 0
var phi = 0
var input = {
    forward: false,
    backward: false,
    left: false,
    right: false,
    space: false
}

document.addEventListener('mousemove', onMouseMove);
document.addEventListener('keydown', onKeyDown);
document.addEventListener('keyup', onKeyUp);
document.addEventListener('click', onClick);
window.addEventListener('resize', resize);

animate();

function animate() {
    requestAnimationFrame( animate );
    var delta = clock.getDelta();
    if (player1 && mixer) {
        player1.animate(delta, input);
        // it might be inefficient to create this vector on every frame
        cameraTarget.copy(player1.scene.position.clone().add(new Vector3(0,1,0)))
        updateCamera(theta, phi)
        mixer.update( delta );
    }
    renderer.render( scene, camera );
}

function toggleKey(event, toggle) {
    switch(event.key) {
        case 'w':
            input.forward = toggle;
            break;
        case 'a':
            input.left = toggle;
            break;
        case 's':
            input.backward = toggle;
            break;
        case 'd':
            input.right = toggle;
            break;
        case ' ':
            input.space = toggle;
            break;
    }
}
function onKeyDown(event) {
    toggleKey(event, true);
}
function onKeyUp(event) {
    toggleKey(event, false);
}
function onClick() {
    document.body.requestPointerLock();
}

function onMouseMove( event ) {
    var movementX = event.movementX || event.mozMovementX || event.webkitMovementX || 0;
    var movementY = event.movementY || event.mozMovementY || event.webkitMovementY || 0;
    theta -= movementX * 0.2
    phi += movementY * 0.2
    updateCamera(theta, phi);
}
function resize() {
    renderer.setSize(window.innerWidth, window.innerHeight);
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
}