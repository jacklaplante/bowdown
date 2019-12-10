import {AnimationMixer, Vector3, Mesh, BoxGeometry} from 'three'

import {getAnimation, eachDo} from '../utils'
import scene from '../scene';
import flamingo from '../../models/flamingo.gltf'

const birds = {
  roster: {},
  hitBoxes: []
}

import {loader} from '../loader'

birds.add = function(uuid, state) {
  this.roster[uuid] = {}
  loader.load(flamingo, (gltf) => {
    let bird = this.roster[uuid]
    bird.gltf = gltf
    gltf.scene.scale.multiplyScalar(0.02)
    bird.mixer = new AnimationMixer(gltf.scene)
    initBird(bird) // this just sets up the bird functions
    bird.update(state)
    scene.add(bird.gltf.scene)
    bird.fly.reset().play()

    let hitBox = new Mesh(new BoxGeometry(50, 20, 50)); // this is effected by the scale of the flamingo
    // hitBox.material.visible = false
    gltf.scene.add(hitBox)
    hitBox.playerUuid = uuid
    birds.hitBoxes.push(hitBox)
  }) 
}

birds.animate = function(delta) {
  eachDo(birds.roster, (birdUuid) => {
    let bird = birds.get(birdUuid)
    if (bird.mixer) {
      if (bird.velocity) {
        bird.setPosition(bird.getPosition().add(bird.velocity.multiplyScalar(delta)))
      }
      bird.mixer.update(delta);
    }
  })
}

birds.get = function(uuid) {
  return this.roster[uuid]
}

function initBird(bird) {
  bird.fly = bird.mixer.clipAction(getAnimation(bird.gltf, "flamingo_flyA_"))
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
  bird.update = function(state) {
    bird.setPosition(state.position)
    bird.setRotation(state.rotation)
    bird.setVelocity(state.velocity)
  }
}

export default birds;