import {Vector3, AnimationMixer, Raycaster, Line3, Geometry, LineBasicMaterial, Line} from 'three'

import {loader} from './loader'
import {uuid} from './utils'
import {scene, collidableEnvironment} from './scene'
import {camera} from './camera'
import {movePlayer} from './players'
import {sendMessage} from './websocket'

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
    
    player1.actions = {
        idle: mixer.clipAction(player1.animations[2]),
        walking: mixer.clipAction(player1.animations[3]),
        running: mixer.clipAction(player1.animations[1]),
        jumping: mixer.clipAction(player1.animations[0])
    }

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

    var displayCollisionLines = true
    player1.collisionDetected = function(nextPos){
        if (displayCollisionLines){
            player1.scene.children.forEach((child) => {
               if (child.name === "collision line") {
                   player1.scene.remove(child)
               }
            })
        }
        for(var a=-1; a<=1; a++){
            for(var b=0; b<=1; b++){
                for(var c=-1; c<=1; c++){
                    var vert = new Vector3(a, b, c);
                    vert = vert.clone().normalize()
                    var ray = new Raycaster(new Vector3(nextPos.x, 0, nextPos.z), vert);
                    if (displayCollisionLines){
                        var geometry = new Geometry();
                        geometry.vertices.push(
                            vert,
                            new Vector3()
                        );
                        var material = new LineBasicMaterial({
                            color: 0xff0000
                        });
                        var line = new Line( geometry, material )
                        line.name = "collision line"
                        player1.scene.add(line);
                    }
                    // the true below denotes to recursivly check for collision with objects and all their children. Might not be efficient
                    var collisionResults = ray.intersectObjects(collidableEnvironment, true);
                    if ( collisionResults.length > 0 && collisionResults[0].distance <= new Line3(new Vector3(), vert).distance()) {
                        return true
                    }
                }
            }
        }
        return false;
    }

    player1.move = function(nextPos, rotation){
        if(!player1.collisionDetected(nextPos)){
            movePlayer(player1, nextPos, rotation);
            sendMessage(
                {
                    player: playerUuid,
                    x: player1.scene.position.x,
                    y: player1.scene.position.y,
                    z: player1.scene.position.z,
                    rotation: rotation
                }
            )
        } else {
            player1.velocity.set(0,0,0)
        }
    }

    player1.animate = function(delta, input){
        var nextPos = new Vector3();
        var rotation;
        if (player1.falling()) {
            player1.state = 'falling'
            player1.velocity.y -= delta*10
            nextPos = player1.scene.position.clone().add(player1.velocity.clone().multiplyScalar(delta))
            player1.move(nextPos, rotation)
        } else {
            player1.velocity.set(0,0,0)
            if (input.space) {
                player1.velocity.y = 5
            }
            if (input.forward || input.backward || input.left || input.right) {
                var movementSpeed = 0.12;
                var direction = new Vector3();
                camera.getWorldDirection(direction)
                // make direction 2d (x,z) and normalize
                // then multiply by movement speed
                var b = 1/(Math.abs(direction.x)+Math.abs(direction.z));
                var directionX = movementSpeed*b*direction.x;
                var directionZ = movementSpeed*b*direction.z;
                if (input.forward) {
                    nextPos.z = player1.scene.position.z + directionZ;
                    nextPos.x = player1.scene.position.x + directionX;
                    rotation = Math.atan2(directionX, directionZ)
                }
                if (input.backward) {
                    nextPos.z = player1.scene.position.z - directionZ;
                    nextPos.x = player1.scene.position.x - directionX;
                    rotation = Math.atan2(directionX, directionZ) + Math.PI
                }
                if (input.left) {
                    nextPos.z = player1.scene.position.z - directionX;
                    nextPos.x = player1.scene.position.x + directionZ;
                    rotation = Math.atan2(directionX, directionZ) + Math.PI/2
                }
                if (input.right) {
                    nextPos.z = player1.scene.position.z + directionX;
                    nextPos.x = player1.scene.position.x - directionZ;
                    rotation = Math.atan2(directionX, directionZ) - Math.PI/2
                }
                player1.velocity.x = (nextPos.x-player1.scene.position.x)/delta
                player1.velocity.z = (nextPos.z-player1.scene.position.z)/delta
                nextPos.y = player1.scene.position.y // this is going to need to change for running up/down hill
                player1.move(nextPos, rotation)
                if (player1.state!='running') {
                    player1.actions.idle.fadeOut(0.5);
                    var action = player1.actions.running.reset();
                    action.fadeIn(0.2).play();
                    player1.state = 'running'
                }
            } else if (player1.state=='running') {
                player1.actions.running.fadeOut(0.5);
                var action = player1.actions.idle.reset();
                action.fadeIn(0.2).play();
                player1.state = 'standing'
            }
            if (input.space) {
                nextPos = player1.scene.position.clone().add(player1.velocity.clone().multiplyScalar(delta))
                player1.move(nextPos, rotation)
            }
        }
    }

    var action = mixer.clipAction(player1.animations[2]).reset();
    action.fadeIn(0.2).play();
    player1.state = 'standing'
});

export { player1, playerUuid, mixer }