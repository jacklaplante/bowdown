import {PerspectiveCamera, Vector3, Raycaster} from 'three'
import {collidableEnvironment} from './scene'
import {player1} from './player1'

var distance = 5;

var camera = new PerspectiveCamera( 75, window.innerWidth / window.innerHeight, 0.1, 1000 );
camera.position.z = 5;
var cameraTarget = new Vector3( 0, 1, 0 );
var theta = 0
var phi = 0

camera.updatePosition = function(dist) {
    if (player1.scene!=null) {
        var target = player1.scene.position.clone()
        camera.position.x = target.x + dist * Math.sin(theta * Math.PI / 360) * Math.cos(phi * Math.PI / 360);
        camera.position.y = target.y + dist * Math.sin(phi * Math.PI / 360);
        camera.position.z = target.z + dist * Math.cos(theta * Math.PI / 360) * Math.cos(phi * Math.PI / 360);
    }
}

camera.updateCamera = function() {
    var target = cameraTarget.clone()
    camera.updatePosition(distance);
    camera.lookAt(cameraTarget);

    // this ensures the camera doesn't go behind any meshes
    var ray = new Raycaster(target, camera.position.clone().sub(target).normalize(), 0, 5);
    var collisions = ray.intersectObjects(collidableEnvironment, true);
    if(collisions.length>0){
        // 0.15 is a bit hacky, may need to change
        camera.updatePosition(collisions[0].distance-0.15)
    }

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