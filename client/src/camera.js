import {PerspectiveCamera, Vector3, Raycaster, Quaternion} from 'three'
import {collidableEnvironment} from './scene'
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
camera.zoomState = "out"
var focalLengthOut = camera.getFocalLength()
var focalLengthIn = camera.getFocalLength()+16
const zoomSpeed = 60
camera.position.z = 5;
var cameraTarget = new Vector3();
var theta = 0
var phi = 0

camera.nextPosition = function(dist) {
    if (player1!=null) {
        var nextPos = new Vector3();
        nextPos.x = dist * Math.sin(theta * Math.PI / 360) * Math.cos(phi * Math.PI / 360);
        nextPos.y = dist * Math.sin(phi * Math.PI / 360);
        nextPos.z = dist * Math.cos(theta * Math.PI / 360) * Math.cos(phi * Math.PI / 360);
        return cameraTarget.clone().add(
            nextPos.applyQuaternion(
                new Quaternion().setFromUnitVectors(
                    new Vector3(0,1,0), cameraTarget.clone().normalize()))) // maybe try setFromAxisAngle?
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
    if (player1!=null) {
        var v = player1.getPosition().clone().sub(camera.position.clone())
        var v2 = player1.getPosition().clone().normalize().cross(v).normalize().multiplyScalar(-0.5)
        cameraTarget.copy(player1.getPosition().clone().add(v2).add(player1.getPosition().clone().normalize().multiplyScalar(1.8)))
        
        var nextPos = camera.nextPosition(distance)

        // this ensures the camera doesn't go behind any meshes
        var ray = new Raycaster(cameraTarget, nextPos.clone().sub(cameraTarget).normalize(), 0, distance);
        var collisions = ray.intersectObjects(collidableEnvironment, true);
        if(collisions.length>0){
            // this is just some voodoo
            nextPos = collisions[0].point.clone().sub(nextPos.clone().sub(collisions[0].point).normalize().multiplyScalar(0.1))
            // jk, I take the difference between the nextPos and the point of collision, normalize it, multiply it by 0.1, and add that to the collision point to get the new nextPos
            // really all it does is make sure the camera is slightly above the surface that it's colliding with (instead of at the surface)
        }
        camera.setPosition(nextPos)
    }
    camera.up.copy(player1.getPosition().clone().normalize())
    camera.lookAt(cameraTarget);
    camera.updateMatrix();
}

camera.moveCamera = function(movementX, movementY) {
    theta -= movementX * 0.2
    var x = phi + movementY * 0.2
    // this simply ensures the camera cannot go over the top/bottom
    // I have it set 10 135 and 80 because otherwise the camera gets all fucky but it's not the best solution
//     if (180 > x && x > -140) {
        phi = x
//     }
    camera.updateCamera();
}

export { camera, cameraTarget };