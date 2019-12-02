const YUKA = require('yuka');

const fetch = require( 'node-fetch' );
global.fetch = fetch;

const entities = {};
let orc, entityManager, games, payloads

entities.init = function(g, p, gN) {
    games = g
    payloads = p
    gameName = gN
    orc = new YUKA.Vehicle();
    orc.maxSpeed = 150;
    orc.maxForce = 10;
    const followPathBehavior = new YUKA.FollowPathBehavior();
    // const wanderBehavior = new YUKA.WanderBehavior();
    orc.steering.add(followPathBehavior);
    // orc.steering.add(wanderBehavior);
    entityManager = new YUKA.EntityManager(); 
    const loader = new YUKA.NavMeshLoader();
    loader.load('https://navmesh.s3.amazonaws.com/exampleNavMesh.glb').then((navigationMesh) => {
        orc.navMesh = navigationMesh
        entityManager.add(orc);
        // orc.position.copy(orc.navMesh.getClosestRegion(new YUKA.Vector3(22.46, -13.44, 17.86)).centroid)
        orc.position.copy(orc.navMesh.getClosestRegion(new YUKA.Vector3(0,0,0)).centroid)
        entities.updateState();
        entities.go();
    }).catch((e) => {
        console.error(e)
    })
}

entities.go = function() {
    setInterval( () => {
        if (Object.entries(games[gameName].players).length == 0) return
        let pos = games[gameName].players[Object.keys(games[gameName].players)[0]].position
        let to = new YUKA.Vector3(pos.x, pos.y, pos.z)
        let path = orc.navMesh.findPath(orc.position, to);
        const followPathBehavior = orc.steering.behaviors[0];
        followPathBehavior.path.clear();
        followPathBehavior.active = false;
        path.forEach((p) => {
            followPathBehavior.active = true;
            followPathBehavior.path.add(p)
        })
        entityManager.update(1/5)
        // console.log(orc.position)
        entities.updateState()
    }, 200);
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