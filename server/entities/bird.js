const THREE = global.THREE = require('three');

const bird = new THREE.Object3D();

bird.init = function() {
  this.position.set(-90,-90,-90)
  this.velocity = new THREE.Vector3();
  let quat = new THREE.Quaternion().setFromUnitVectors(new THREE.Vector3(0,1,0), this.position.clone().normalize())
  this.applyQuaternion(quat)
  this.velocity = new THREE.Vector3(0,0,1).applyQuaternion(quat) // this is important for the initial rotation
}

bird.update = function() {
  let nextPos = this.position.clone().applyAxisAngle(new THREE.Vector3(1,0,0), 0.01)
  let nextVel = nextPos.clone().sub(this.position)
  this.applyQuaternion(new THREE.Quaternion().setFromUnitVectors(this.velocity.clone(), nextVel.clone()))
  this.velocity.copy(nextVel)
  this.applyQuaternion(new THREE.Quaternion().setFromUnitVectors(bird.position.clone().normalize(), nextPos.clone().normalize()))
  this.position.copy(nextPos)
}

bird.getState = function() {
  return {
    position: bird.position,
    velocity: bird.velocity,
    rotation: bird.rotation
  }
}

module.exports = bird