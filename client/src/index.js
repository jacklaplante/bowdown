import {Scene, Clock, Vector3, AnimationMixer, WebGLRenderer, Raycaster, Line3, BoxGeometry,
    DirectionalLight, HemisphereLight, Mesh, MeshBasicMaterial, TextureLoader, PlaneGeometry, MeshLambertMaterial} from 'three'
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
// // vox
// var parser = new vox.Parser();
// parser.parse("models/castle.vox").then(function(voxelData) {
//     var builder = new vox.MeshBuilder(voxelData);
//     var mesh = builder.createMesh();
//     scene.add(mesh);
//     // Eventually you're going to need to make a more simplistic collidable mesh for each vox mesh because more complicated vox meshes will be inefficient to calculate collisions on
//     collidableEnvironment.push(mesh);
// });

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
            scene.remove(players[player])
            delete players[player]
        } else if (players[player].scene && message.x && message.z) {
            movePlayer(players[player], message.x, message.z)
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
    players[uuid] = 'loading'
    loader.load( Adam, function ( gltf ) {
        var player = gltf;
        if (x&&z) {
            movePlayer(player, x, z)
        }
        scene.add( gltf.scene );
        mixer = new AnimationMixer(gltf.scene);
        players[uuid] = player;
        animate();
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
        mixer.clipAction( player1.animations[ 0 ] ).play();
    } else {
        mixer.clipAction( player1.animations[ 0 ] ).stop();
    }
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
    var z, x;
    if (forward) {
        z = player1.scene.position.z + directionZ;
        x = player1.scene.position.x + directionX;
        player1.scene.rotation.y = Math.atan2(directionX, directionZ)-Math.PI/2
    }
    if (backward) {
        z = player1.scene.position.z - directionZ;
        x = player1.scene.position.x - directionX;
        player1.scene.rotation.y = Math.atan2(directionX, directionZ)+Math.PI/2
    }
    if (left) {
        z = player1.scene.position.z - directionX;
        x = player1.scene.position.x + directionZ;
        player1.scene.rotation.y = Math.atan2(directionX, directionZ)
    }
    if (right) {
        z = player1.scene.position.z + directionX;
        x = player1.scene.position.x - directionZ;
        player1.scene.rotation.y = Math.atan2(directionX, directionZ)+Math.PI
    }
    if(!collisionDetected(x, z)){
        cameraTarget.z = z;
        cameraTarget.x = x;
        movePlayer(player1, x, z);
        updateCamera(theta, phi);
        sendMessage(
            {
                player: playerUuid,
                x: player1.scene.position.x,
                z: player1.scene.position.z
            }
        )
    }
}
function collisionDetected(x, z){
    for(var a=0; a<=1; a++){
        for(var b=0; b<=1; b++){
            for(var c=0; c<=1; c++){
                var vert = new Vector3(a, b, c);
                var ray = new Raycaster(new Vector3(x, 0, z), vert.clone().normalize());
                // the true below denotes to recursivly check for collision with objects and all their children. Might not be efficient
//                 var collisionResults = ray.intersectObjects(Object.values(players).concat(collidableEnvironment), true);
//                 new Line3(new Vector3(), vert).distance()
//                 if ( collisionResults.length > 0 && collisionResults[0].distance <= new Line3(new Vector3(), vert).distance()) {
//                     return true
//                 }
            }
        }
    }
    return false;
}
function movePlayer(player, x, z) {
    player.scene.position.x = x;
    player.scene.position.z = z;
    
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