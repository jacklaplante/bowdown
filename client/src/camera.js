import {PerspectiveCamera, Vector3} from 'three'

var camera = new PerspectiveCamera( 75, window.innerWidth / window.innerHeight, 0.1, 1000 );
camera.position.z = 5;
var cameraTarget = new Vector3( 0, 1, 0 );

function updateCamera(theta, phi) {
    var distance = 5;
    camera.position.x = cameraTarget.x + distance * Math.sin(theta * Math.PI / 360) * Math.cos(phi * Math.PI / 360);
    camera.position.y = cameraTarget.y + distance * Math.sin(phi * Math.PI / 360);
    camera.position.z = cameraTarget.z + distance * Math.cos(theta * Math.PI / 360) * Math.cos(phi * Math.PI / 360);
    camera.lookAt(cameraTarget);
    camera.updateMatrix();
}

export { camera, cameraTarget, updateCamera };