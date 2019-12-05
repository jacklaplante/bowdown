import {AnimationMixer, LoopOnce, Vector3, Quaternion} from 'three'

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
})

orc.animate = function(delta) {
    if (this.velocity) {
        this.setPosition(this.getPosition().add(this.velocity.multiplyScalar(delta)))
    }
    this.mixer.update(delta);
}

orc.add = function(state) {
    this.update(state)
    scene.add(orc.gltf.scene)
    this.anim['running'].reset().play()
}

orc.setRotation = function(euler) {
    this.gltf.scene.rotation.copy(euler)
}

orc.getPosition = function() {
    return this.gltf.scene.position.clone()
}

orc.setPosition = function(vect) {
    this.gltf.scene.position.copy(vect)
}

orc.setVelocity = function(vect) {
    this.velocity = new Vector3(vect.x, vect.y, vect.z)
}

orc.update = function(state) {
    this.setPosition(state.position)
    this.setRotation(state.rotation)
    this.setVelocity(state.velocity)
}

export default orc

