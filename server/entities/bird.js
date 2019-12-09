const THREE = global.THREE = require('three');

const bird = new THREE.Object3D();

bird.init = function() {
  bird.position.set(-70,-70,-70)
  bird.velocity = new THREE.Vector3();
}

bird.update = function() {
  let nextPos = bird.position.clone().applyAxisAngle(new THREE.Vector3(1,0,0), 0.001)
  bird.velocity.copy(nextPos.clone().sub(this.position))
  bird.position.copy(nextPos)
}

bird.getState = function() {
  return {
    position: bird.position,
    velocity: bird.velocity,
    rotation: bird.rotation
  }
}

module.exports = bird