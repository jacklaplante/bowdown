const YUKA = require('yuka');

const entities = {};

entities.init = function(game) {
    game.entities = []
    game.entityManager = new YUKA.EntityManager();

    let vehicle = new YUKA.Vehicle();
    vehicle.maxSpeed = 1.5;
    vehicle.maxForce = 10;
    const followPathBehavior = new YUKA.FollowPathBehavior();
    vehicle.steering.add(followPathBehavior);
    game.entityManager.add( vehicle );
    followPathBehavior.path.add(new YUKA.Vector3(100,100,100))

    game.entities.push(vehicle)

    setInterval( () => {
        game.entityManager.update(1);
        // entityManager.update( delta );
        console.log( 'New position:', game.entities[0].position );
    }, 1000 );
}

module.exports = entities