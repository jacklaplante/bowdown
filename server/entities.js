const fs = require('fs');
const THREE = global.THREE = require('three');
global.TextDecoder = require('util').TextDecoder;
require('three/examples/js/loaders/GLTFLoader.js');
const { Pathfinding } = require('three-pathfinding');
const content = fs.readFileSync('./orc_pit_NavMesh.glb');

global.THREE = THREE

const entities = {};
const orc = new THREE.Object3D();
let games, payloads

const loader = new THREE.GLTFLoader();
const pathfinding = new Pathfinding();
const ZONE = 'level1';

entities.init = function(g, p, gN) {
    games = g
    payloads = p
    gameName = gN

    let navmesh;
    
    loader.parse( trimBuffer( content ), '', ( gltf ) => {
        gltf.scene.traverse((node) => {
            if (node.isMesh) navmesh = node;
        });
        pathfinding.setZoneData(ZONE, Pathfinding.createZone(navmesh.geometry));
        orc.position.copy(pathfinding.zones[ZONE].vertices[Math.round(pathfinding.zones[ZONE].vertices.length/2)]) // random vector on nav mesh
        let quat = new THREE.Quaternion().setFromUnitVectors(new THREE.Vector3(0,1,0), orc.position.clone().normalize())
        orc.applyQuaternion(quat)
        orc.velocity = new THREE.Vector3(0,0,1).applyQuaternion(quat) // this is important for the initial rotation
        entities.go()
    }, ( e ) => {
        console.error( e );
    });
}

const updateSpeed = 50 // ms
const movementSpeed = 5
entities.go = function() {
    setInterval( () => {
        if (Object.entries(games[gameName].players).length == 0) return
        let pos = toVector(games[gameName].players[Object.keys(games[gameName].players)[0]].position)
        if (pathfinding.getClosestNode(pos, ZONE, getGroupId())) { // not sure if this works
            if (orc.target == null || !orc.target.equals(pos)) {
                orc.target = pos
                orc.path = pathfinding.findPath(orc.position, pos, ZONE, getGroupId());
            }
            if (orc.path && orc.path.length > 0) {
                let direction = orc.path[0].clone().sub(orc.position);
                if (direction.lengthSq() > 0.05 * 0.05) {
                    let nextPos = orc.position.clone().add(direction.clone().normalize().multiplyScalar(Math.min(getMovementSpeed(), direction.length()))); // either go at the speed to the next point in path or to the next point if the speed will make the orc go past the point
                    orc.applyQuaternion(new THREE.Quaternion().setFromUnitVectors(orc.velocity.clone().projectOnPlane(nextPos.clone().normalize()).normalize(), direction.clone().projectOnPlane(nextPos.clone().normalize()).normalize()))
                    orc.velocity.copy(nextPos.clone().sub(orc.position).multiplyScalar(1/updateSpeed))
                    orc.applyQuaternion(new THREE.Quaternion().setFromUnitVectors(orc.position.clone().normalize(), nextPos.clone().normalize()))
                    orc.position.copy(nextPos)
                } else {
                    orc.path.shift();
                }
                entities.updateState()
            }
        } else {
            orc.target = null
        }
    }, updateSpeed);
}

entities.updateState = function() {
    if (!payloads[gameName].entities) payloads[gameName].entities = {}
    payloads[gameName].entities.orc = {
        position: orc.position,
        velocity: orc.velocity,
        rotation: orc.rotation
    }
    games[gameName].entities.orc = {
        position: orc.position,
        velocity: orc.velocity,
        rotation: orc.rotation
    }
}

function getGroupId() {
    return pathfinding.getGroup(ZONE, orc.position)
}

function getMovementSpeed() {
    return movementSpeed * updateSpeed/1000
}

function toVector(pos) {
    return new THREE.Vector3(pos.x, pos.y, pos.z);
}

function trimBuffer ( buffer ) {
    const { byteOffset, byteLength } = buffer;
    return buffer.buffer.slice( byteOffset, byteOffset + byteLength );
}

module.exports = entities