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

export default orc

