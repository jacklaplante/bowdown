import {Scene, Clock, Vector3, AnimationMixer, PerspectiveCamera, WebGLRenderer, Raycaster, Line3, BoxGeometry,
    DirectionalLight, HemisphereLight, Mesh, MeshBasicMaterial, TextureLoader, PlaneGeometry, MeshLambertMaterial} from 'three'
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader'
import Grass from '../textures/grass.png'
import Adam from '../models/CesiumMan.glb'
import Fort from '../models/fort.glb'

var scene = initScene();
var camera = initCamera();
var clock = new Clock();
var renderer = initRenderer();
var collidableEnvironment = []
document.body.appendChild( renderer.domElement );
var cameraTarget = new Vector3( 0, 1, 0 );
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
    mixer.clipAction( gltf.animations[ 0 ] ).play();
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
scene.add(getGround());
document.addEventListener( 'mousemove', onMouseMove);
document.addEventListener('keydown', onKeyDown);
document.addEventListener('keyup', onKeyUp);
document.addEventListener('click', onClick);
window.addEventListener('resize', resize);
const ws = new WebSocket('ws://localhost:18181');
var playerUuid = uuid();
ws.onopen = function open() {
    sendMessage({message: "sup fucker"})
};

// add player uuid and send message
function sendMessage(message) {
    message.player = playerUuid;
    ws.send(JSON.stringify(message))
}
ws.onmessage = function onMessage(message) {
    var message = JSON.parse(message.data)
    if (message.players) {
        initPlayers(message.players);
    }
    if (message.player) {
        var player = message.player;
        if (!players[player] && player != playerUuid) {
            addPlayer(player)
        } else if (message.status==='disconnected') {
            // player disconnected, remove
            scene.remove(players[player])
            delete players[player]
        }
        if (message.x && message.z) {
            movePlayer(players[message.player], message.x, message.z)
        }
    }
}
function initPlayers(newPlayers) {
    Object.keys(newPlayers).forEach(
        (playerUuid) => {
            addPlayer(playerUuid);
            movePlayer(players[playerUuid], newPlayers[playerUuid].x, newPlayers[playerUuid].z)
        })
}
function addPlayer(uuid) {
    var player = createPlayer(0xf58742);
    scene.add(player);
    players[uuid] = player;
}
function initScene() {
    var scene = new Scene();
    return scene;
}
function initCamera() {
    var camera = new PerspectiveCamera( 75, window.innerWidth / window.innerHeight, 0.1, 1000 );
    camera.position.z = 5;
    return camera;
}
function initRenderer() {
    var renderer = new WebGLRenderer();
    renderer.setClearColor("#e5e5e5");
    renderer.setSize( window.innerWidth, window.innerHeight );
    return renderer;
}

function animate() {
    requestAnimationFrame( animate );
    var delta = clock.getDelta();
    mixer.update( delta );
    if (forward || backward || left || right) {
        movePlayer1();
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
    }
    if (backward) {
        z = player1.scene.position.z - directionZ;
        x = player1.scene.position.x - directionX;
    }
    if (left) {
        z = player1.scene.position.z - directionX;
        x = player1.scene.position.x + directionZ;
    }
    if (right) {
        z = player1.scene.position.z + directionX;
        x = player1.scene.position.x - directionZ;
    }
    if(!collisionDetected(x, z)){
        cameraTarget.z = z;
        cameraTarget.x = x;
        movePlayer(player1.scene, x, z);
        updateCamera();
        sendMessage(
            {
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
                var collisionResults = ray.intersectObjects(Object.values(players).concat(collidableEnvironment), true);
                new Line3(new Vector3(), vert).distance()
                if ( collisionResults.length > 0 && collisionResults[0].distance <= new Line3(new Vector3(), vert).distance()) {
                    return true
                }
            }
        }
    }
    return false;
}
function movePlayer(player, x, z) {
    player.position.z = z;
    player.position.x = x;
    
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

function updateCamera() {
    var distance = 5;
    camera.position.x = cameraTarget.x + distance * Math.sin(theta * Math.PI / 360) * Math.cos(phi * Math.PI / 360);
    camera.position.y = cameraTarget.y + distance * Math.sin(phi * Math.PI / 360);
    camera.position.z = cameraTarget.z + distance * Math.cos(theta * Math.PI / 360) * Math.cos(phi * Math.PI / 360);
    camera.lookAt(cameraTarget);
    camera.updateMatrix();
}

function onMouseMove( event ) {
    var movementX = event.movementX || event.mozMovementX || event.webkitMovementX || 0;
    var movementY = event.movementY || event.mozMovementY || event.webkitMovementY || 0;
    theta -= movementX * 0.2
    phi += movementY * 0.2
    updateCamera();
}
function resize() {
    renderer.setSize(window.innerWidth, window.innerHeight);
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
}
function createPlayer(color) {
    var geometry = new BoxGeometry(1, 1, 1);
    var material = new MeshLambertMaterial({color: color});
    var player = new Mesh( geometry, material );
    player.castShadow = true;
    player.receiveShadow = true;
    return player;
}
function getGround() {
    var geometry = new PlaneGeometry(10, 20, 0);
    var texture = new TextureLoader().load(Grass)
    // var material = new MeshBasicMaterial({map: texture, side: DoubleSide});
    var material = new MeshBasicMaterial({map: texture});
    var plane = new Mesh( geometry, material );
    plane.rotateX(Math.PI/2);
    plane.translateZ(0.5);
    plane.receiveShadow = true;
    return plane;
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

function uuid() {
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
        var r = Math.random() * 16 | 0, v = c == 'x' ? r : (r & 0x3 | 0x8);
        return v.toString(16);
    });
}
function abs(num) {
    return Math.abs(num);
}