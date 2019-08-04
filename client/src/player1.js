import {Vector3, AnimationMixer, Raycaster, Line3} from 'three'

import {loader} from './loader'
import {uuid} from './utils'
import {scene, collidableEnvironment} from './scene'

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

    player1.falling = function(){
        var vert = new Vector3(0, -1, 0);
        vert = vert.clone().normalize()
        var ray = new Raycaster(new Vector3(player1.scene.position.x, player1.scene.position.y+0.9, player1.scene.position.z), vert);
        var collisionResults = ray.intersectObjects(collidableEnvironment, true);
        if ( collisionResults.length > 0 && collisionResults[0].distance <= new Line3(new Vector3(), vert).distance()) {
            return false
        }
        return true;
    }
});

export { player1, playerUuid, mixer }