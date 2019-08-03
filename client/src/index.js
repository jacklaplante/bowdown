import { Clock, Vector3, AnimationMixer, Raycaster, Line3,
    Geometry, LineBasicMaterial, Line} from 'three'

import { scene, collidableEnvironment } from './scene'
import { renderer } from './renderer'
import { loader } from './loader'
import { camera, cameraTarget, updateCamera } from './camera'
import { sendMessage } from './websocket'
import { movePlayer } from './players'
import { playerUuid } from './player1'

import Adam from '../models/benji.glb'

var clock = new Clock()
document.body.appendChild( renderer.domElement )
var theta = 0
var phi = 0
var forward = false
var backward = false
var left = false
var right = false
var space = false

var player1;
var mixer;
loader.load( Adam, ( gltf ) => {
    // gltf.scene.children[0].children[1].material = new MeshBasicMaterial({color: 0xffffff});
    player1 = gltf;
    player1.velocity = new Vector3()
    scene.add( gltf.scene );
    mixer = new AnimationMixer(gltf.scene);
    var action = mixer.clipAction(player1.animations[2]).reset();
    action.fadeIn(0.2).play();
    player1.state = 'standing'
});

document.addEventListener('mousemove', onMouseMove);
document.addEventListener('keydown', onKeyDown);
document.addEventListener('keyup', onKeyUp);
document.addEventListener('click', onClick);
window.addEventListener('resize', resize);

animate();

function falling() {
    var vert = new Vector3(0, -1, 0);
    vert = vert.clone().normalize()
    var ray = new Raycaster(new Vector3(player1.scene.position.x, player1.scene.position.y+0.9, player1.scene.position.z), vert);
    var collisionResults = ray.intersectObjects(collidableEnvironment, true);
    if ( collisionResults.length > 0 && collisionResults[0].distance <= new Line3(new Vector3(), vert).distance()) {
        return false
    }
    return true;
}

function animate() {
    requestAnimationFrame( animate );
    var delta = clock.getDelta();
    if (player1) {
        var nextPos = new Vector3();
        var rotation;
        if (falling()) {
            mixer.clipAction( player1.animations[1] ).fadeOut(0.2);
            player1.state = 'falling'
            player1.velocity.y -= delta*10
            nextPos = player1.scene.position.clone().add(player1.velocity.clone().multiplyScalar(delta))
            movePlayer1(nextPos, rotation)
        } else {
            player1.velocity.set(0,0,0)
            if (space) {
                player1.velocity.y = 5
            }
            if (forward || backward || left || right) {
                var movementSpeed = 0.12;
                var direction = new Vector3();
                camera.getWorldDirection(direction)
                // make direction 2d (x,z) and normalize
                // then multiply by movement speed
                var b = 1/(abs(direction.x)+abs(direction.z));
                var directionX = movementSpeed*b*direction.x;
                var directionZ = movementSpeed*b*direction.z;
                if (forward) {
                    nextPos.z = player1.scene.position.z + directionZ;
                    nextPos.x = player1.scene.position.x + directionX;
                    rotation = Math.atan2(directionX, directionZ)
                }
                if (backward) {
                    nextPos.z = player1.scene.position.z - directionZ;
                    nextPos.x = player1.scene.position.x - directionX;
                    rotation = Math.atan2(directionX, directionZ) + Math.PI
                }
                if (left) {
                    nextPos.z = player1.scene.position.z - directionX;
                    nextPos.x = player1.scene.position.x + directionZ;
                    rotation = Math.atan2(directionX, directionZ) + Math.PI/2
                }
                if (right) {
                    nextPos.z = player1.scene.position.z + directionX;
                    nextPos.x = player1.scene.position.x - directionZ;
                    rotation = Math.atan2(directionX, directionZ) - Math.PI/2
                }
                player1.velocity.x = (nextPos.x-player1.scene.position.x)/delta
                player1.velocity.z = (nextPos.z-player1.scene.position.z)/delta
                nextPos.y = player1.scene.position.y // this is going to need to change for running up/down hill
                movePlayer1(nextPos, rotation)
                if (player1.state!='running') {
                    mixer.clipAction(player1.animations[2]).fadeOut(0.5);
                    var action = mixer.clipAction(player1.animations[1]).reset();
                    action.fadeIn(0.2).play();
                    player1.state = 'running'
                }
            } else if (player1.state=='running') {
                mixer.clipAction(player1.animations[1]).fadeOut(0.5);
                var action = mixer.clipAction(player1.animations[2]).reset();
                action.fadeIn(0.2).play();
                player1.state = 'standing'
            }
            if (space) {
                nextPos = player1.scene.position.clone().add(player1.velocity.clone().multiplyScalar(delta))
                movePlayer1(nextPos, rotation)
            }
        }
        // it might be inefficient to create this vector on every frame
        cameraTarget.copy(player1.scene.position.clone().add(new Vector3(0,1,0)))
        updateCamera(theta, phi)
        mixer.update( delta );
    }
    renderer.render( scene, camera );
}

function movePlayer1(nextPos, rotation) {
    if(!collisionDetected(nextPos)){
        movePlayer(player1, nextPos, rotation);
        sendMessage(
            {
                player: playerUuid,
                x: player1.scene.position.x,
                y: player1.scene.position.y,
                z: player1.scene.position.z,
                rotation: rotation
            }
        )
    } else {
        player1.velocity.set(0,0,0)
    }
}

// these might not be completely accurate
var displayCollisionLines = true
function collisionDetected(nextPos){
    if (displayCollisionLines){
        player1.scene.children.forEach((child) => {
           if (child.name === "collision line") {
               player1.scene.remove(child)
           }
        })
    }
    for(var a=-1; a<=1; a++){
        for(var b=0; b<=1; b++){
            for(var c=-1; c<=1; c++){
                var vert = new Vector3(a, b, c);
                vert = vert.clone().normalize()
                var ray = new Raycaster(new Vector3(nextPos.x, 0, nextPos.z), vert);
                if (displayCollisionLines){
                    var geometry = new Geometry();
                    geometry.vertices.push(
                        vert,
                        new Vector3()
                    );
                    var material = new LineBasicMaterial({
                        color: 0xff0000
                    });
                    var line = new Line( geometry, material )
                    line.name = "collision line"
                    player1.scene.add(line);
                }
                // the true below denotes to recursivly check for collision with objects and all their children. Might not be efficient
                var collisionResults = ray.intersectObjects(collidableEnvironment, true);
                if ( collisionResults.length > 0 && collisionResults[0].distance <= new Line3(new Vector3(), vert).distance()) {
                    return true
                }
            }
        }
    }
    return false;
}

function toggleKey(event, toggle) {
    switch(event.key) {
        case 'w':
            forward = toggle;
            break;
        case 'a':
            left = toggle;
            break;
        case 's':
            backward = toggle;
            break;
        case 'd':
            right = toggle;
            break;
        case ' ':
            space = toggle;
            break;
    }
}
function onKeyDown(event) {
    toggleKey(event, true);
}
function onKeyUp(event) {
    toggleKey(event, false);
}
function onClick(event) {
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

function abs(num) {
    return Math.abs(num);
}