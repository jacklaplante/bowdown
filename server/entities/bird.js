const THREE = global.THREE = require('three');

const bird = new THREE.Object3D();

bird.init = function() {
  bird.position.set(-90,-90,-90)
  bird.velocity = new THREE.Vector3();
  let quat = new THREE.Quaternion().setFromUnitVectors(new THREE.Vector3(0,1,0), bird.position.clone().normalize())
  bird.applyQuaternion(quat)
}

bird.update = function() {
  let nextPos = bird.position.clone().applyAxisAngle(new THREE.Vector3(1,0,0), 0.01)
  bird.velocity.copy(nextPos.clone().sub(this.position))
  bird.applyQuaternion(new THREE.Quaternion().setFromUnitVectors(bird.position.clone().normalize(), nextPos.clone().normalize()))
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