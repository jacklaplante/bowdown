import { Clock, Vector3, AnimationMixer, Raycaster, Line3,
    Geometry, LineBasicMaterial, Line} from 'three'

import { scene, collidableEnvironment } from './scene'
import { renderer } from './renderer'
import { loader } from './loader'
import { camera, cameraTarget, updateCamera } from './camera'
import { sendMessage } from './websocket'
import { movePlayer } from './players'
import { playerUuid } from './player1'

import Adam from '../models/CesiumMan.glb'

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
        if (falling()) {
            player1.velocity.y -= delta*10
        } else {
            player1.velocity.y = 0
            if (space) {
                player1.velocity.y = 5
            }
            if (forward || backward || left || right) {
                movePlayer1();
                if (player1.state!='walking') {
                    var action = mixer.clipAction( player1.animations[ 0 ] ).reset();
                    action.timeScale = 1.5
                    action.fadeIn(0.2).play();
                    player1.state = 'walking'
                }
            } else if (player1.state=='walking') {
                mixer.clipAction( player1.animations[ 0 ] ).fadeOut(0.5);
                player1.state = 'standing'
            }
        }
        player1.scene.position.add(player1.velocity.clone().multiplyScalar(delta))
        cameraTarget.y = player1.scene.position.y+1
        updateCamera(theta, phi)
        mixer.update( delta );
    }
//     Object.keys(players).forEach((player) => {
//         if (players[player].state == 'moving') {
//             mixer.clipAction(players[player].animations[0]).play();
//         }
//     })
    renderer.render( scene, camera );
}

function movePlayer1(){
    var movementSpeed = 0.085;
    var direction = new Vector3();
    camera.getWorldDirection(direction)
    // make direction 2d (x,z) and normalize
    // then multiply by movement speed
    var b = 1/(abs(direction.x)+abs(direction.z));
    var directionX = movementSpeed*b*direction.x;
    var directionZ = movementSpeed*b*direction.z;
    var z, x, rotation;
    if (forward) {
        z = player1.scene.position.z + directionZ;
        x = player1.scene.position.x + directionX;
        rotation = Math.atan2(directionX, directionZ)-Math.PI/2
    }
    if (backward) {
        z = player1.scene.position.z - directionZ;
        x = player1.scene.position.x - directionX;
        rotation = Math.atan2(directionX, directionZ)+Math.PI/2
    }
    if (left) {
        z = player1.scene.position.z - directionX;
        x = player1.scene.position.x + directionZ;
        rotation = Math.atan2(directionX, directionZ)
    }
    if (right) {
        z = player1.scene.position.z + directionX;
        x = player1.scene.position.x - directionZ;
        rotation = Math.atan2(directionX, directionZ)+Math.PI
    }
    if(!collisionDetected(x, z)){
        cameraTarget.z = z;
        cameraTarget.x = x;
        movePlayer(player1, x, z, rotation);
        updateCamera(theta, phi);
        sendMessage(
            {
                player: playerUuid,
                x: player1.scene.position.x,
                z: player1.scene.position.z,
                rotation: rotation
            }
        )
    }
}

// these might not be completely accurate
var displayCollisionLines = false
function collisionDetected(x, z){
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
                var ray = new Raycaster(new Vector3(x, 0, z), vert);
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