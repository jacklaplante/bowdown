import {AnimationMixer, Vector3, Mesh, BoxGeometry, Raycaster, CylinderBufferGeometry, Quaternion} from 'three'

import {getAnimation, eachDo} from '../utils'
import scene from '../scene/scene';
import {sendMessage} from '../websocket'

import flamingo from '../../models/flamingo.gltf'

const birds = {
  roster: {},
  hitBoxes: []
}

const flamingoScale = 0.02

let flamingoGltf
import(/* webpackMode: "lazy" */ '../../models/flamingo.gltf').then(file => {
  flamingoGltf = file.default
})

import {loader} from '../loader'
import player1 from '../player1/player1';

birds.add = function(uuid, state) {
  if (flamingoGltf == null) return
  this.roster[uuid] = {}
  loader.load(flamingo, (gltf) => {
    let bird = this.roster[uuid]
    bird.uuid = uuid
    bird.gltf = gltf
    gltf.scene.scale.multiplyScalar(flamingoScale)
    bird.mixer = new AnimationMixer(gltf.scene)
    initBird(bird) // this just sets up the bird functions
    bird.update(state)
    scene.add(bird.gltf.scene)
    bird.fly.reset().play()

    let hitBox = new Mesh(new BoxGeometry(50, 20, 50)); // this is effected by the scale of the flamingo
    // hitBox.material.visible = false
    gltf.scene.add(hitBox)
    bird.hitBox = hitBox
    hitBox.hitBoxFor = uuid
    birds.hitBoxes.push(hitBox)
  }) 
}

birds.animate = function(delta) {
  eachDo(birds.roster, (birdUuid) => {
    let bird = birds.get(birdUuid)
    if (bird.mixer) {
      if (bird.getVelocity().length() > 0) {
        if (bird.dead) {
          bird.drop(delta)
        } else {
          bird.setPosition(bird.getPosition().add(bird.getVelocity().multiplyScalar(delta)))
        }
      }
      bird.mixer.update(delta);
    }
  })
}

birds.kill = function(birdUuid, playerUuid) {
  sendMessage({
    player: playerUuid,
    damage: 100,
    to: birdUuid
  })
}

birds.die = function(uuid) {
  let bird = birds.get(uuid)
  bird.fly.reset().stop()
  bird.dead = true
  bird.setVelocity(bird.getPosition().normalize().negate().multiplyScalar(20)) // hack (this sort of thing should be done on server side)
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
  bird.getVelocity = function() {
    return this.velocity.clone()
  }
  bird.setVelocity = function(vect) {
    this.velocity = new Vector3(vect.x, vect.y, vect.z)
  }
  bird.update = function(state) {
    if (bird.dead) return
    bird.setPosition(state.position)
    bird.setRotation(state.rotation)
    bird.setVelocity(state.velocity)
  }
  bird.remove = function() {
    scene.remove(bird.gltf.scene)
    delete birds.roster[bird.uuid]
  }
  bird.drop = function(delta) {
    let pos = bird.getPosition()
    let nextPos = pos.clone().add(bird.getVelocity().multiplyScalar(delta))
    if (pos.length() < 100) {
      bird.remove()
    }
    let direction = nextPos.clone().sub(pos)
    let ray = new Raycaster(pos, direction, 0, direction.length())
    let collisions = ray.intersectObjects(scene.getCollidableEnvironment([pos]), true);
    if (collisions.length > 0) {
      bird.gltf.scene.remove(bird.hitBox)
      bird.hitBox.position.copy(collisions[0].point.add(pos.clone().normalize()))
      bird.hitBox.scale.multiplyScalar(flamingoScale)
      scene.add(bird.hitBox)
      let healthHitBox = new Mesh(new CylinderBufferGeometry( 0.8, 0.8, 2, 8 ));
      healthHitBox.material.visible = false
      healthHitBox.applyQuaternion(new Quaternion().setFromUnitVectors(new Vector3(0,1,0), bird.hitBox.position.clone().normalize()))
      healthHitBox.position.copy(bird.hitBox.position)
      scene.add(healthHitBox)
      healthHitBox.trigger = function() {
        player1.setHp(player1.hp+30)
        scene.removeTrigger(healthHitBox)
        scene.remove(bird.hitBox)
      }
      scene.triggers.push(healthHitBox)
      bird.remove()
      console.log("collision detected")
    } else {
      bird.setPosition(nextPos)
    }
  }
}

export default birds;