const YUKA = require('yuka');

const fetch = require( 'node-fetch' );
const TextDecoder = require( 'text-encoding' ).TextDecoder;

global.fetch = fetch;
global.TextDecoder = TextDecoder;

const entities = {};
let orc, entityManager, games, payloads

entities.init = function(g, p, gN) {
    games = g
    payloads = p
    gameName = gN
    orc = new YUKA.Vehicle();
    // orc.maxSpeed = 150;
    // orc.maxForce = 10;
    const followPathBehavior = new YUKA.FollowPathBehavior();
    // const wanderBehavior = new YUKA.WanderBehavior();
    orc.steering.add(followPathBehavior);
    // orc.steering.add(wanderBehavior);
    entityManager = new YUKA.EntityManager(); 
    const loader = new YUKA.NavMeshLoader();
    loader.load('https://navmesh.s3.amazonaws.com/lowild.glb', { epsilonCoplanarTest: 0.05 }).then((navigationMesh) => {
        orc.navMesh = navigationMesh
        entityManager.add(orc);
        // orc.position.copy(orc.navMesh.getClosestRegion(new YUKA.Vector3(22.46, -13.44, 17.86)).centroid)
        orc.position.copy(orc.navMesh.getClosestRegion(new YUKA.Vector3(63,63,63)).centroid)
        // orc.position.set( - 13, - 0.75, - 9 );
        entities.updateState();
        entities.go();
    }).catch((e) => {
        console.error(e)
    })
}

const updateSpeed = 50 // ms
entities.go = function() {
    setInterval( () => {
        if (Object.entries(games[gameName].players).length == 0) return
        const followPathBehavior = orc.steering.behaviors[0];
        followPathBehavior.path.clear();
        followPathBehavior.active = false;
        // this should only happen when the player is within range of the orc, the orc can detect the player, and the players position has changed
        let pos = games[gameName].players[Object.keys(games[gameName].players)[0]].position
        let to = new YUKA.Vector3(pos.x, pos.y, pos.z)
        if (orc.navMesh.getRegionForPoint(to, orc.navMesh.epsilonContainsTest)) {
            let path = orc.navMesh.findPath(orc.position, to);
            path.forEach((p) => {
                followPathBehavior.active = true;
                followPathBehavior.path.add(p)
            })
        }
        entityManager.update(1/updateSpeed)
        if (followPathBehavior.active) {
            entities.updateState()
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

module.exports = entities