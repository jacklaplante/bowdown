import {AnimationMixer, Vector3} from 'three'

import {getAnimation} from '../utils'
import scene from '../scene';
import flamingo from '../../models/flamingo.gltf'

const bird = {}

import {loader} from '../loader'

loader.load(flamingo, (gltf) => {
  bird.gltf = gltf
  gltf.scene.scale.multiplyScalar(0.5)
  bird.mixer = new AnimationMixer(gltf.scene)
  bird.fly = bird.mixer.clipAction(getAnimation(gltf, "flamingo_flyA_"))
})

bird.add = function(state) {
  this.update(state)
  scene.add(this.gltf.scene)
  this.fly.reset().play()
}

bird.update = function(state) {
  this.setPosition(state.position)
  this.setRotation(state.rotation)
  this.setVelocity(state.velocity)
}

bird.animate = function(delta) {
  if (this.velocity) {
    this.setPosition(this.getPosition().add(this.velocity.multiplyScalar(delta)))
  }
  this.mixer.update(delta);
}

bird.setRotation = function(euler) {
  this.gltf.scene.rotation.copy(euler)
}

bird.getPosition = function() {
  return this.gltf.scene.position.clone()
}

bird.setPosition = function(vect) {
  this.gltf.scene.position.copy(vect)
}

bird.setVelocity = function(vect) {
  this.velocity = new Vector3(vect.x, vect.y, vect.z)
}

export default bird;