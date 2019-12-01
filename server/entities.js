const YUKA = require('yuka');

const entities = {};
let entityManager

entities.init = function(games, payloads, gameName) {
    entityManager = new YUKA.EntityManager();

    let orc = new YUKA.Vehicle();
    orc.maxSpeed = 1.5;
    orc.maxForce = 10;
    const followPathBehavior = new YUKA.FollowPathBehavior();
    orc.steering.add(followPathBehavior);
    entityManager.add( orc );
    followPathBehavior.path.add(new YUKA.Vector3(100,100,100))

    games[gameName].entities.orc = {
        position: orc.position,
        velocity: orc.velocity,
        rotation: orc.rotation
    }
    payloads[gameName].entities = {
        position: orc.position,
        velocity: orc.velocity,
        rotation: orc.rotation
    }

    setInterval( () => {
        entityManager.update(1);
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
    }, 1000 );
}

// entities.update = function() {
//     game.entityManager.update(1);
//     console.log( 'New position:', game.entities[0].position );
// }

module.exports = entities