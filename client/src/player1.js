import {Vector3, AnimationMixer, Raycaster, Line3} from 'three'

import {loader} from './loader'
import {uuid} from './utils'
import {scene} from './scene'

import Adam from '../models/benji.glb'

var playerUuid = uuid();

var player1;
var mixer;
loader.load( Adam, ( gltf ) => {
    // gltf.scene.children[0].children[1].material = new MeshBasicMaterial({color: 0xffffff});
    player1 = gltf;
    player1.velocity = new Vector3()
    scene.add( gltf.scene );
    mixer = new AnimationMixer(gltf.scene);
    var action = mixer.clipAction(player1.animations[2]).reset();
    action.fadeIn(0.2).play();
    player1.state = 'standing'
});

export { player1, playerUuid, mixer }