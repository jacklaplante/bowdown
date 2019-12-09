const THREE = global.THREE = require('three');
const getUuid = require('../utils')

const birds = {}
birds.roster = {}

birds.init = function() {
  let uuid = getUuid()
  this.roster[uuid] = new THREE.Object3D();
  let bird = this.roster[uuid]
  bird.position.copy(new THREE.Vector3(Math.random()*2-1, Math.random()*2-1, Math.random()*2-1).normalize().multiplyScalar(150))
  bird.velocity = new THREE.Vector3();
  let quat = new THREE.Quaternion().setFromUnitVectors(new THREE.Vector3(0,1,0), bird.position.clone().normalize())
  bird.applyQuaternion(quat)
}

birds.updateAll = function() {
  birds.forEach((uuid) => birds.update(uuid))
}

birds.update = function(uuid) {
  let bird = this.get(uuid)
  let nextPos = bird.position.clone().applyAxisAngle(new THREE.Vector3(1,0,0), 0.01)
  bird.velocity.copy(nextPos.clone().sub(bird.position))
  bird.applyQuaternion(new THREE.Quaternion().setFromUnitVectors(bird.position.clone().normalize(), nextPos.clone().normalize()))
  bird.position.copy(nextPos)
}

birds.getState = function() {
  let state = {}
  birds.forEach((uuid) => {
    let bird = birds.get(uuid)
    state[uuid] = {
      position: bird.position,
      velocity: bird.velocity,
      rotation: bird.rotation
    }
  })
  return state
}

birds.forEach = function(func) {
  Object.keys(this.roster).forEach((uuid) => func(uuid))
}

birds.get = function(uuid) {
  return birds.roster[uuid]
}

module.exports = birds