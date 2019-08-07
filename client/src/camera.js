import {PerspectiveCamera, Vector3} from 'three'

var distance = 5;

var camera = new PerspectiveCamera( 75, window.innerWidth / window.innerHeight, 0.1, 1000 );
camera.position.z = 5;
var cameraTarget = new Vector3( 0, 1, 0 );
var theta = 0
var phi = 0

camera.updateCamera = function() {
    var target = cameraTarget.clone()
    camera.position.x = target.x + distance * Math.sin(theta * Math.PI / 360) * Math.cos(phi * Math.PI / 360);
    camera.position.y = target.y + distance * Math.sin(phi * Math.PI / 360);
    camera.position.z = target.z + distance * Math.cos(theta * Math.PI / 360) * Math.cos(phi * Math.PI / 360);
    camera.lookAt(cameraTarget);
    camera.updateMatrix();
}

camera.moveCamera = function(movementX, movementY) {
    theta -= movementX * 0.2
    var x = phi + movementY * 0.2
    // this simply ensures the camera cannot go over the top/bottom
    if (180 >= x && x >= -180) {
        phi = x
    }
    camera.updateCamera();
}

export { camera, cameraTarget };