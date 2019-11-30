const YUKA = require('yuka');

const entities = {};
let entityManager

entities.init = function(game) {
    entityManager = new YUKA.EntityManager();

    let vehicle = new YUKA.Vehicle();
    vehicle.maxSpeed = 1.5;
    vehicle.maxForce = 10;
    const followPathBehavior = new YUKA.FollowPathBehavior();
    vehicle.steering.add(followPathBehavior);
    entityManager.add( vehicle );
    followPathBehavior.path.add(new YUKA.Vector3(100,100,100))

    game.entities['vehicle'] = {
        position: vehicle.position,
        velocity: vehicle.velocity,
        rotation: vehicle.rotation
    }

    setInterval( () => {
        entityManager.update(1);
        // entityManager.update( delta );
        // console.log( 'New position:', game.entities["vehicle"].position );
    }, 1000 );
}

// entities.update = function() {
//     game.entityManager.update(1);
//     console.log( 'New position:', game.entities[0].position );
// }

module.exports = entities