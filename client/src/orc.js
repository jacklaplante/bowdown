import {AnimationMixer, LoopOnce, Vector3} from 'three'

import {loader} from './loader'
import {getAnimation} from './utils'
import scene from './scene';

import orcModel from '../models/orc.glb'

const orc = {};

loader.load(orcModel, (gltf) => {
    orc.gltf = gltf
    orc.mixer = new AnimationMixer(gltf.scene)
    orc.anim = {
        idle: orc.mixer.clipAction(getAnimation(gltf, "idle")),
        running: orc.mixer.clipAction(getAnimation(gltf, "running")),
        walk: orc.mixer.clipAction(getAnimation(gltf, "walk")),
        attack: orc.mixer.clipAction(getAnimation(gltf, "swing attack")).setLoop(LoopOnce),
        battleCry: orc.mixer.clipAction(getAnimation(gltf, "battle cry")).setLoop(LoopOnce),
    }
    scene.add(orc.gltf.scene)
    orc.gltf.scene.position.copy(new Vector3(63,63,63))
    orc.anim['running'].reset().play()
})

orc.setRotation = function(quat) {
    this.gltf.scene.quaternion.copy(quat)
}

orc.setPosition = function(vect) {
    this.gltf.scene.position.copy(vect)
}

orc.setVelocity = function(vect) {
    this.velocity = vect
}

orc.update = function(state) {
    this.setPosition(state.position)
    this.setRotation(state.rotation)
    this.setVelocity(state.velocity)
}

export default orc

