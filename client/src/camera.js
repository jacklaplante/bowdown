import {PerspectiveCamera, Vector3, Raycaster, Quaternion, AudioListener} from 'three'
import scene from './scene'
import player1 from './player1'

var distance = 3.5;
var width, height;
// if (window.innerWidth < window.innerHeight) {
//     width = window.innerHeight
//     height = window.innerWidth
// } else {
    width = window.innerWidth
    height = window.innerHeight
// }
var camera = new PerspectiveCamera( 75, width / height, 0.1, 10000 );
camera.listener = new AudioListener();
camera.add( camera.listener );
camera.zoomState = "out"
var focalLengthOut = camera.getFocalLength()
var focalLengthIn = camera.getFocalLength()+16
const zoomSpeed = 60
camera.position.z = 5;
var cameraTarget = new Vector3();
var theta = 0
var phi = 0

var onTop = 1 // for some reason, without this things get real fucky when the player is on the south pole
function updateOnTop() { // this is essentially a hack, and it's not even a good one
    if (scene.gravityDirection == "down") {
        return 1
    }
    if (cameraTarget.y < -20 ) {
        onTop = -1
    } else if (cameraTarget.y > 20) {
        onTop = 1
    }
}

camera.nextPosition = function(dist) {
    if (player1!=null) {
        updateOnTop()
        var nextPos = new Vector3();
        nextPos.x = dist * Math.sin(theta * Math.PI / 360) * Math.cos(phi * Math.PI / 360);
        nextPos.y = onTop * dist * Math.sin(phi * Math.PI / 360);
        nextPos.z = onTop * dist * Math.cos(theta * Math.PI / 360) * Math.cos(phi * Math.PI / 360);
        if (scene.gravityDirection == "down") {
            return cameraTarget.clone().add(nextPos)
        }
        return cameraTarget.clone().add(
            nextPos.applyQuaternion( // the crux of the camera issues (where it used to get fucky at the south pole) lies here. TODO: investigate further
                new Quaternion().setFromUnitVectors(
                    new Vector3(0, onTop, 0), cameraTarget.clone().normalize())))
    }
}

camera.zoomIn = function() {
    camera.zoomState = "zooming in"
}

camera.zoomOut = function() {
    camera.zoomState = "zooming out"
}

camera.resetFocalLength = function() {
    focalLengthOut = camera.getFocalLength()
    focalLengthIn = camera.getFocalLength()+16
}
camera.resetFocalLength()

camera.animate = function(delta) {
    if (camera.zoomState == "zooming in") {
        if (camera.getFocalLength() < focalLengthIn) {
            var speed = zoomSpeed
            if (player1.doubleJumped) {
                speed/=2
            }
            var focalLength = camera.getFocalLength()+delta*speed
            if (focalLength < focalLengthIn) {
                camera.setFocalLength(focalLength)
            } else {
                camera.setFocalLength(focalLengthIn)
                camera.zoomState = "in"
            }
        }
    } else if (camera.zoomState == "zooming out") {
        if (camera.getFocalLength() > focalLengthOut) {
            var focalLength = camera.getFocalLength()-delta*zoomSpeed
            if (focalLength > focalLengthOut) {
                camera.setFocalLength(focalLength)
            } else {
                camera.setFocalLength(focalLengthOut)
                camera.zoomState = "out"
            }
        }
    }
}

camera.setPosition = function(nextPos) {
    camera.position.copy(nextPos)
}

camera.updateCamera = function() {
    if (player1!=null && scene.loaded) {
        var v = player1.getPosition().clone().sub(camera.position.clone())
        if (scene.gravityDirection == "down") {
            var v2 = new Vector3(-v.z, v.y, v.x).normalize().multiplyScalar(0.5)
            cameraTarget.copy(player1.getPosition().clone().add(v2)).setY(player1.getPosition().y+1.8)
        } else {
            var v2 = player1.getPosition().normalize().cross(v).normalize().multiplyScalar(-0.5)
            cameraTarget.copy(player1.getPosition().add(v2).add(player1.getPosition().normalize().multiplyScalar(1.8)))
        }
        
        var nextPos = camera.nextPosition(distance)

        // this ensures the camera doesn't go behind any meshes
        var ray = new Raycaster(cameraTarget, nextPos.clone().sub(cameraTarget).normalize(), 0.1, distance);
        var collisions = ray.intersectObjects(scene.getCollidableEnvironment([cameraTarget, nextPos]), true);
        if(collisions.length>0){
            // this is just some voodoo
            nextPos = collisions[0].point.clone().sub(nextPos.clone().sub(collisions[0].point).normalize().multiplyScalar(0.1))
            // jk, I take the difference between the nextPos and the point of collision, normalize it, multiply it by 0.1, and add that to the collision point to get the new nextPos
            // really all it does is make sure the camera is slightly above the surface that it's colliding with (instead of at the surface)
        }
        camera.setPosition(nextPos)
    }
    if (scene.gravityDirection == "center") {
        camera.up.copy(player1.getPosition().normalize())
    }
    camera.lookAt(cameraTarget);
    camera.updateMatrix();
}

camera.moveCamera = function(movementX, movementY) {
    theta -= movementX * 0.2
    var x = phi + movementY * 0.2
    if (140 > x && x > -145) {
        phi = x
    }
    camera.updateCamera();
}

export { camera, cameraTarget };