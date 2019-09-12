import {Vector3, AnimationMixer, Raycaster, Vector2 } from 'three'

import {loader} from './loader'
import {uuid, addCollisionLine, removeCollisionLines} from './utils'
import {scene, collidableEnvironment} from './scene'
import {camera} from './camera'
import {shootArrow} from './arrow'
import {sendMessage} from './websocket'
import {init} from './archer'
import {gameOver} from './game'
const models = require.context('../models/');

var playerUuid = uuid();

var player1 = {}
var mixer;
const movementSpeed = 7
const sprintModifier = 1.3

player1.race = ['black', 'brown', 'white'][Math.floor(Math.random()*3)];
loader.load(models('./benji_'+player1.race+'.gltf'),
  ( gltf ) => {
    player1.gltf = gltf;
    player1.velocity = new Vector3()
    player1.bowState = "unequipped"

    player1.addToWorld = function() {
        scene.add( this.gltf.scene );
        // say hi to server
        sendMessage({
            player: playerUuid,
            position: player1.getPosition(),
            race: player1.race
        })
        player1.equipBow()
        player1.idle()
    }
    
    mixer = new AnimationMixer(gltf.scene);
    init(mixer, player1);
    mixer.addEventListener('finished', (event) => {
        if (event.action.getClip().name == "Draw bow") {
            player1.bowState = "drawn"
        } else {
            if (event.action.getClip().name == "Fire bow") {
                player1.bowState = "equipped"
            }
            player1.idle()
        }
    })

    player1.falling = function(delta){
        if (delta) {
            var origin = player1.getPosition().clone().add(player1.velocity.clone().multiplyScalar(delta))
            origin.y-=0.1
            var dir = new Vector3(0, 1, 0);
            var ray = new Raycaster(origin, dir, 0, 0.2+Math.abs(player1.velocity.y*delta));
            var collisionResults = ray.intersectObjects(collidableEnvironment, true);
            if ( collisionResults.length > 0) {
                player1.getPosition().copy(collisionResults[collisionResults.length-1].point)
                return false
            }
            return true;   
        }
    }

    player1.collisionDetected = function(nextPos){
        removeCollisionLines(player1)
        for(var a=-1; a<=1; a++){
            for(var c=-1; c<=1; c++){
                var collisionModifier = 0.5
                a*=collisionModifier
                c*=collisionModifier
                var vert = new Vector3(a, 1, c);
                vert = vert.clone().normalize()
                var ray = new Raycaster(new Vector3(nextPos.x, nextPos.y, nextPos.z), vert, 0, vert.length());
                addCollisionLine(player1, vert)
                // the true below denotes to recursivly check for collision with objects and all their children. Might not be efficient
                var collisionResults = ray.intersectObjects(collidableEnvironment, true);
                if ( collisionResults.length > 0) {
                    return vert
                }
            }
        }
        return false;
    }

    player1.playBowAction = function(bowAction) {
        if (player1.isRunning() && player1.activeMovement!='runWithLegsOnly') {
            player1.movementAction('runWithLegsOnly')
        } else if (player1.activeMovement) {
            player1.stopAction(player1.activeMovement)
            player1.activeMovement = null
        }
        player1.bowAction(bowAction);
        player1.broadcast();
    }

    player1.onMouseDown = function() {
        if (player1.bowState == "unequipped") {
            player1.equipBow()
        } else {
            if (this.activeActions.includes("jumping")) {
                this.stopAction("jumping")
            }
            player1.playBowAction("drawBow")
            player1.bowState = "drawing"
            camera.zoomIn()
        }
    }

    player1.onMouseUp = function() {
        if (player1.bowState == "drawn") {
            player1.playBowAction("fireBow")
            shootArrow();
            player1.bowState = "firing"
            camera.zoomOut()
        } else if (player1.bowState === "drawing") {
            player1.stopAction(player1.activeBowAction)
            player1.activeBowAction = null
            player1.bowState = "equipped"
            player1.idle()
            camera.zoomOut()
        }
    }

    player1.broadcast = async function() {
        sendMessage(
            {
                player: playerUuid,
                position: player1.getPosition(),
                rotation: player1.getRotation().y,
                movementAction: player1.activeMovement,
                bowAction: player1.activeBowAction,
                bowState: player1.bowState
            }
        )
    }

    player1.runOrSprint = function(input) {
        if (input.keyboard.shift) {
            if (this.isRunning()) {
                this.anim[this.activeMovement].timeScale = sprintModifier
            }   
            return movementSpeed*sprintModifier
        } else {
            if (this.anim[this.activeMovement]) {
                this.anim[this.activeMovement].timeScale = 1
            }
            return movementSpeed
        }
    }

    function getDirection(input, delta) {
        var direction = new Vector3();
        camera.getWorldDirection(direction)
        direction = new Vector2(direction.x, direction.z) // 3d z becomes 2d y
        direction.normalize().multiplyScalar(delta*player1.runOrSprint(input));
        var x=0, y=0 // these are the inputDirections
        if (input.touch.x!=0 && input.touch.y!=0) {
            var dir = new Vector2(input.touch.x, input.touch.y)
            if (dir.length()>100) {
                input.keyboard.shift = true // sprinting
            } else {
                input.keyboard.shift = false
            }
            dir.normalize()
            x = dir.x
            y = dir.y
        }
        if (input.keyboard.forward) {
            x += 0
            y += 1
        }
        if (input.keyboard.backward) {
            x += 0
            y += -1
        }
        if (input.keyboard.left) {
            x += -1
            y += 0
        }
        if (input.keyboard.right) {
            x += 1
            y += 0
        }
        return direction.rotateAround(new Vector2(), Math.atan2(x, y))
    }

    player1.doubleJumped = false
    player1.animate = function(delta, input){
        var nextPos;
        var falling = player1.falling(delta)
        if (!falling) {
            player1.doubleJumped = false
            var direction = getDirection(input, delta)
            var rotation = Math.atan2(direction.x, direction.y)
            if ((input.touch.x!=0&&input.touch.y!=0) || input.keyboard.forward || input.keyboard.backward || input.keyboard.left || input.keyboard.right) {
                if (input.jump) {
                    player1.velocity.x = (direction.x)/delta
                    player1.velocity.z = (direction.y)/delta
                } else {
                    player1.velocity.set(0,0,0)
                    nextPos = player1.getPosition().clone()
                    nextPos.z += direction.y;
                    nextPos.x += direction.x;
                    // for moving up/down slopes
                    // also worth mentioning that the players movement distance will increase as it goes uphill, which should probably be fixed eventually
                    var origin = new Vector3(nextPos.x, nextPos.y+1, nextPos.z)
                    var slopeRay = new Raycaster(origin, new Vector3(0, -1, 0), 0, 1)
                    var top = slopeRay.intersectObjects(collidableEnvironment, true);
                    if (top.length>0){
                        // the 0.01 is kinda hacky tbh
                        nextPos.y = top[0].point.y+0.01
                    }
                    if (!player1.isRunning()) {
                        if (player1.bowState == "equipped") {
                            player1.movementAction('runWithBow')
                        } else if (player1.isFiring()) {
                            player1.movementAction('runWithLegsOnly')
                        } else {
                            player1.movementAction('running')
                        }
                    }
                }
            } else {
                if (player1.isRunning()) {
                    if (player1.isFiring()) {
                        player1.stopAction(player1.activeMovement)
                        player1.activeMovement = null
                    } else {
                        player1.idle()
                    }
                }
                if (player1.isFiring()) {
                    var direction = new Vector3();
                    camera.getWorldDirection(direction)
                    rotation = Math.atan2(direction.x, direction.z)
                    player1.getRotation().y = rotation
                    camera.updateCamera()
                    player1.broadcast()
                }
            }
        }
        if (input.jump && !player1.doubleJumped) {
            input.jump = null
            if (falling) {
                player1.doubleJumped = true
            }
            player1.velocity.y = 5
            this.playAction("jumping")
        }
        if ( falling || nextPos || player1.velocity.x || player1.velocity.y || player1.velocity.z) {
            if (!nextPos) nextPos = player1.getPosition().clone()
            nextPos.add(player1.velocity.clone().multiplyScalar(delta))
            var collisionVector = player1.collisionDetected(nextPos)
            if(!collisionVector) {
                if (falling) {
                    var gravityAcceleration = 10
                    if (player1.doubleJumped && player1.isFiring()) {
                        gravityAcceleration = 5
                    }
                    player1.velocity.y -= delta*gravityAcceleration  
                }
                player1.getPosition().copy(nextPos)
                if (player1.isFiring()) {
                    var direction = new Vector3();
                    camera.getWorldDirection(direction)
                    rotation = Math.atan2(direction.x, direction.z)
                } else if (rotation == null) {
                    rotation = player1.getRotation().y
                }
                player1.getRotation().y = rotation
                camera.updateCamera()
            } else {
                if (falling) {// slide off edge
                    player1.velocity.copy(collisionVector.clone().negate().normalize().multiplyScalar(10))
                    nextPos.add(player1.velocity.clone().multiplyScalar(delta))
                    player1.getPosition().copy(nextPos)
                } else {
                    player1.velocity.set(0,0,0)
                }
            }
            player1.broadcast()
        }
    }

    player1.idle = function() {
        player1.movementAction('idle')
        player1.broadcast();
    }

    player1.equipBow = function() {
        player1.bowState = "equipped"
        player1.playBowAction("equipBow")
        player1.toggleBow(true)
    }

    player1.unequipBow = function() {
        player1.toggleBow(false)
        player1.bowState = "unequipped";
    }

    player1.takeDamage = function() {
        gameOver()
        player1.getPosition().y -=20
    }

    player1.respawn = function() {
        player1.getPosition().copy(new Vector3())
    }

    player1.sendChat = function(message) {
        sendMessage({
            player:playerUuid,
            chatMessage: message
        })
    }
});

export { player1, playerUuid, mixer }