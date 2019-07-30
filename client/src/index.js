import {Scene, Clock, Vector3, AnimationMixer, WebGLRenderer, Raycaster, Line3, BoxGeometry,
    DirectionalLight, HemisphereLight, Mesh, MeshBasicMaterial, TextureLoader, PlaneGeometry, MeshLambertMaterial, Geometry, LineBasicMaterial, Line} from 'three'
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader'

import { uuid } from './utils'
import { initRenderer } from './renderer'
import { camera, cameraTarget, updateCamera } from './camera'
import { ws, sendMessage } from './websocket'

import Adam from '../models/CesiumMan.glb'
import Fort from '../models/fort.glb'


var scene = initScene();
var clock = new Clock();
var renderer = initRenderer();
var collidableEnvironment = []
document.body.appendChild( renderer.domElement );
var theta = 0
var phi = 0
var forward = false
var backward = false
var left = false
var right = false

var player1;
var loader = new GLTFLoader();
var mixer;
loader.load( Adam, function ( gltf ) {
    // gltf.scene.children[0].children[1].material = new MeshBasicMaterial({color: 0xffffff});
    player1 = gltf;
    scene.add( gltf.scene );
    mixer = new AnimationMixer(gltf.scene);
    
    animate();
});
loader.load(Fort, function (gltf) {
    var mesh = gltf.scene;
    mesh.scale.addScalar(2.0)
    mesh.position.y -=15
    scene.add(mesh);
    collidableEnvironment.push(mesh.children[0])
});

var players = { }

scene.add(getHemisphereLight());
scene.add(getDirectionalLight());
document.addEventListener( 'mousemove', onMouseMove);
document.addEventListener('keydown', onKeyDown);
document.addEventListener('keyup', onKeyUp);
document.addEventListener('click', onClick);
window.addEventListener('resize', resize);
var playerUuid = uuid();

ws.onmessage = function onMessage(message) {
    var message = JSON.parse(message.data)
    if (message.players) {
        initPlayers(message.players);
    }
    if (message.player) {
        var player = message.player;
        if (!players[player] && player != playerUuid) {
            addPlayer(player, message.x, message.y)
        } else if (message.status==='disconnected') {
            // player disconnected, remove
            scene.remove(players[player].scene)
            delete players[player]
        } else if (players[player].scene && message.x && message.z && message.rotation) {
            movePlayer(players[player], message.x, message.z, message.rotation)
            players[player].state = 'moving'
        }
    }
}
function initPlayers(newPlayers) {
    Object.keys(newPlayers).forEach(
        (playerUuid) => {
            addPlayer(playerUuid, newPlayers[playerUuid].x, newPlayers[playerUuid].z);
        })
}
function addPlayer(uuid, x, z) {
    // this is a hacky way to make sure the player model isn't loaded multiple times
    players[uuid] = 'loading'

    loader.load( Adam, function ( gltf ) {
        var player = gltf;
        if (x&&z) {
            movePlayer(player, x, z, 0)
        }
        scene.add( gltf.scene );
        players[uuid] = player;
    });
}
function initScene() {
    var scene = new Scene();
    return scene;
}

function animate() {
    requestAnimationFrame( animate );
    var delta = clock.getDelta();
    mixer.update( delta );
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
//     Object.keys(players).forEach((player) => {
//         if (players[player].state == 'moving') {
//             mixer.clipAction(players[player].animations[0]).play();
//         }
//     })
    render();
}

function render() {
    renderer.render( scene, camera );
}
function movePlayer1(){
    var movementSpeed = 0.3;
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

var displayCollisionLines = true
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
function movePlayer(player, x, z, rotation) {
    player.scene.position.x = x;
    player.scene.position.z = z;
    player.scene.rotation.y = rotation;
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

function getHemisphereLight() {
    var hemiLight = new HemisphereLight( 0xffffff, 0xffffff, 0.6 );
    hemiLight.color.setHSL( 0.6, 1, 0.6 );
    hemiLight.groundColor.setHSL( 0.095, 1, 0.75 );
    hemiLight.position.set( 0, 50, 0 );
    hemiLight.visible = true;
    return hemiLight;
}

function getDirectionalLight() {
    var dirLight = new DirectionalLight( 0xffffff, 1 );
    dirLight.color.setHSL( 0.1, 1, 0.95 );
    dirLight.position.set( - 1, 1.75, 1 );
    dirLight.position.multiplyScalar( 30 );
    dirLight.castShadow = true;
    dirLight.shadow.mapSize.width = 2048;
    dirLight.shadow.mapSize.height = 2048;
    var d = 50;
    dirLight.shadow.camera.left = - d;
    dirLight.shadow.camera.right = d;
    dirLight.shadow.camera.top = d;
    dirLight.shadow.camera.bottom = - d;
    dirLight.shadow.camera.far = 3500;
    dirLight.shadow.bias = - 0.0001;
    dirLight.visible = true;
    return dirLight;
}

function abs(num) {
    return Math.abs(num);
}