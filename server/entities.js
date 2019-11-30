const YUKA = require('yuka');

const entities = {};
let entityManager

entities.init = function(games, payloads, gameName) {
    entityManager = new YUKA.EntityManager();

    let vehicle = new YUKA.Vehicle();
    vehicle.maxSpeed = 1.5;
    vehicle.maxForce = 10;
    const followPathBehavior = new YUKA.FollowPathBehavior();
    vehicle.steering.add(followPathBehavior);
    entityManager.add( vehicle );
    followPathBehavior.path.add(new YUKA.Vector3(100,100,100))

    games[gameName].entities.vehicle = {
        position: vehicle.position,
        velocity: vehicle.velocity,
        rotation: vehicle.rotation
    }
    payloads[gameName].entities = {
        position: vehicle.position,
        velocity: vehicle.velocity,
        rotation: vehicle.rotation
    }

    setInterval( () => {
        entityManager.update(1);
        if (!payloads[gameName].entities) payloads[gameName].entities = {}
        payloads[gameName].entities.vehicle = {
            position: vehicle.position,
            velocity: vehicle.velocity,
            rotation: vehicle.rotation
        }
        games[gameName].entities.vehicle = {
            position: vehicle.position,
            velocity: vehicle.velocity,
            rotation: vehicle.rotation
        }
    }, 1000 );
}

// entities.update = function() {
//     game.entityManager.update(1);
//     console.log( 'New position:', game.entities[0].position );
// }

module.exports = entities