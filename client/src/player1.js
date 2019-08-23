import {Vector3, AnimationMixer, Raycaster, Line3, Geometry, LineBasicMaterial, Line, Vector2 } from 'three'

import {loader} from './loader'
import {uuid} from './utils'
import {scene, collidableEnvironment} from './scene'
import {camera} from './camera'
import {shootArrow} from './arrow'
import {sendMessage} from './websocket'
import {initActions} from './archer'

import Adam from '../models/benji.glb'

var playerUuid = uuid();

var player1;
var mixer;
const movementSpeed = 0.12;

loader.load( Adam, ( gltf ) => {
    player1 = gltf;
    player1.velocity = new Vector3()

    scene.add( gltf.scene );
    mixer = new AnimationMixer(gltf.scene);
    initActions(mixer, player1);
    mixer.addEventListener('finished', (event) => {
        if (event.action.getClip().name !== "Draw bow") {
            // this is hacky and should be changed
            player1.playAction("idle")
        } else {
            player1.state = "bow drawn"
        }
    })

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

    var displayCollisionLines = false
    player1.collisionDetected = function(nextPos){
        if (displayCollisionLines){
            player1.scene.children.forEach((child) => {
               if (child.name === "collision line") {
                   player1.scene.remove(child)
               }
            })
        }
        for(var a=-1; a<=1; a++){
            for(var c=-1; c<=1; c++){
                // this dictates how long the collision rays are (how big the collision detection area is)
                var collisionModifier = 0.5
                a*=collisionModifier
                c*=collisionModifier
                var vert = new Vector3(a, 1, c);
                vert = vert.clone().normalize()
                var ray = new Raycaster(new Vector3(nextPos.x, nextPos.y, nextPos.z), vert);
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
                    if (displayCollisionLines && line) {
                        line.material.color.b=1
                        line.name = "collision"
                    }
                    return true
                }
            }
        }
        return false;
    }

    player1.playAction = function(action) {
        if (player1.activeAction) {
            player1.actions[player1.activeAction].stop()
            if(player1.previousAction!=action&&player1.activeAction!=action){
                player1.previousAction = player1.activeAction
            }
        }
        player1.activeAction = action
        player1.actions[action].reset().play();
        player1.state = action
        sendMessage(
            {
                player: playerUuid,
                // rotation: rotation, you might want this later if multiplayer animation rotations are weird
                action: action
            }
        )
    }

    player1.jump = function() {
        player1.velocity.y = 5
        player1.playAction("jumping")
    }

    player1.onMouseDown = function() {
        if (!player1.bowEquipped) {
            player1.equipBow()
        } else {
            player1.playAction("drawBow")
        }
    }

    player1.onMouseUp = function() {
        if (player1.state === "bow drawn") {
            player1.playAction("fireBow")
            shootArrow();
        } else if (player1.state === "drawBow") {
            player1.actions.drawBow.stop();
            player1.playAction("idle")
        }
    }

    player1.move = function(nextPos, rotation=player1.scene.rotation.y){
        if(!player1.collisionDetected(nextPos)){
            player1.scene.position.copy(nextPos)
            player1.scene.rotation.y = rotation
            camera.updateCamera()
            sendMessage(
                {
                    player: playerUuid,
                    x: player1.scene.position.x,
                    y: player1.scene.position.y,
                    z: player1.scene.position.z,
                    rotation: rotation,
                    action: player1.activeAction
                }
            )
        } else {
            player1.velocity.set(0,0,0)
        }
    }

    player1.isRunning = function(){
        if (player1.activeAction) {
            return player1.activeAction.toLowerCase().includes("run")
        }
        return false
    }

    function getDirection(input) {
        var direction = new Vector3();
        camera.getWorldDirection(direction)
        direction = new Vector2(direction.x, direction.z) // 3d z becomes 2d y
        direction.normalize().multiplyScalar(movementSpeed);
        var x, y // these are the inputDirections
        if (input.forward) {
            x = 0
            y = 1
        }
        if (input.backward) {
            x = 0
            y = -1
        }
        if (input.left) {
            x = -1
            y = 0
        }
        if (input.right) {
            x = 1
            y = 0
        }
        return direction.rotateAround(new Vector2(), Math.atan2(x, y))
    }

    player1.animate = function(delta, input){
        var nextPos = new Vector3();
        var rotation;
        if (player1.falling()) {
            player1.state = 'falling'
            player1.velocity.y -= delta*10
            nextPos = player1.scene.position.clone().add(player1.velocity.clone().multiplyScalar(delta))
            player1.move(nextPos)
        } else {
            player1.velocity.set(0,0,0)
            if (input.space) {
                player1.jump();
            }
            if (input.forward || input.backward || input.left || input.right) {
                var direction = getDirection(input)
                nextPos.z = player1.scene.position.z + direction.y;
                nextPos.x = player1.scene.position.x + direction.x;
                rotation = Math.atan2(direction.x, direction.y)
                player1.velocity.x = (nextPos.x-player1.scene.position.x)/delta
                player1.velocity.z = (nextPos.z-player1.scene.position.z)/delta

                // for moving up/down slopes
                // also worth mentioning that the players movement distance will increase as it goes uphill, which should probably be fixed eventually
                nextPos.y = player1.scene.position.y
                var origin = new Vector3(nextPos.x, nextPos.y+1, nextPos.z)
                var slopeRay = new Raycaster(origin, new Vector3(0, -1, 0))
                var top = slopeRay.intersectObjects(collidableEnvironment, true);
                if (top.length>0){
                    // the 0.01 is kinda hacky tbh
                    nextPos.y = top[0].point.y+0.01
                }
                
                player1.move(nextPos, rotation)
                if (!player1.isRunning()) {
                    if (player1.bowEquipped) {
                        player1.playAction('runWithBow')
                    } else {
                        player1.playAction('running')
                    }
                }
            } else if (player1.isRunning()) {
                player1.playAction('idle')
            }
            if (input.space) {
                nextPos = player1.scene.position.clone().add(player1.velocity.clone().multiplyScalar(delta))
                player1.move(nextPos)
            }
        }
    }

    player1.equipBow = function() {
        player1.bowEquipped = true
        player1.playAction("equipBow")
        // this is a hack because I'm too lazy to figure out how to animate this in blender
        player1.scene.children[0].children[1].visible = false
        player1.scene.children[0].children[2].visible = true
    }

    player1.unequipBow = function() {
        player1.scene.children[0].children[2].visible = false
        player1.scene.children[0].children[1].visible = true
        player1.bowEquipped = false;
    }

    player1.takeDamage = function() {
        player1.scene.position.y -=20
    }

    player1.unequipBow()
    player1.playAction('idle')
});

export { player1, playerUuid, mixer }