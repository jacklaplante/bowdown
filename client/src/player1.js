import {Vector3, AnimationMixer, Raycaster, Vector2, Euler, Quaternion} from 'three'

import {loader} from './loader'
import {uuid, addCollisionLine, removeCollisionLines, showCollisionPoint} from './utils'
import {scene, collidableEnvironment} from './scene'
import {camera} from './camera'
import {shootArrow, retractRopeArrow} from './arrow'
import {sendMessage} from './websocket'
import {init} from './archer'
import {gameOver} from './game'
const models = require.context('../models/');

var player1 = {uuid: uuid()}
const movementSpeed = 7
const sprintModifier = 1.3
const collisionModifier = 0.5
const velocityInfluenceModifier = 100

player1.race = ['black', 'brown', 'white'][Math.floor(Math.random()*3)];
loader.load(models('./benji_'+player1.race+'.gltf'), ( gltf ) => {
    player1.gltf = gltf;
    player1.velocity = new Vector3()
    player1.bowState = "unequipped"
    
    var mixer = new AnimationMixer(gltf.scene);
    init(mixer, player1);
    mixer.addEventListener('finished', (event) => {
        if (event.action.getClip().name == "Draw bow") {
            player1.bowState = "drawn"
        } else if (event.action.getClip().name == "death") {
            scene.remove(player1.gltf.scene)
        } else {
            if (event.action.getClip().name == "Fire bow") {
                player1.bowState = "equipped"
            }
            player1.idle()
        }
    })

    player1.falling = function(delta){
        if (delta) {
            var origin = player1.getPosition().clone().add(player1.velocity.clone().multiplyScalar(delta)).sub(new Vector3(0, 0.1, 0).applyEuler(player1.getRotation()))
            var dir = new Vector3(0, 1, 0).applyEuler(player1.getRotation());
            var ray = new Raycaster(origin, dir, 0, 0.2+player1.velocity.length()*delta);
            var collisionResults = ray.intersectObjects(collidableEnvironment, true);
            if ( collisionResults.length > 0) {
                showCollisionPoint(collisionResults[0].point)
                return false
            }
            return true;   
        }
    }

    player1.collisionDetected = function(nextPos){
        removeCollisionLines(player1)
        var vert, ray, collisionResults;
        for(var a=-1; a<=1; a++){
            for(var c=-1; c<=1; c++){
                vert = new Vector3(a*collisionModifier, 1, c*collisionModifier).normalize().applyEuler(this.getRotation());
                ray = new Raycaster(nextPos, vert, 0, 1);
                addCollisionLine(nextPos, vert)
                // the true below denotes to recursivly check for collision with objects and all their children. Might not be efficient
                collisionResults = ray.intersectObjects(collidableEnvironment, true);
                if ( collisionResults.length > 0) {
//                     showCollisionPoint(collisionResults[0].point)
                    return vert
                }
                // this bit of code below is supposed to prevent the player from going through meshes in between frames
                vert = nextPos.clone().sub(player1.getPosition())
                ray = new Raycaster(player1.getPosition().clone().add(vert), vert.clone().normalize(), 0, vert.length())
                collisionResults = ray.intersectObjects(collidableEnvironment, true)
                if (collisionResults.length > 0) {
//                     showCollisionPoint(collisionResults[0].point)
                    return vert;
                }
            }
        }
        return false;
    }

    function getDirection(input, delta) {
        var direction = new Vector2();
        if (input.touch.x!=0 && input.touch.y!=0) {
            var touchDir = new Vector2(input.touch.x, input.touch.y)
            if (touchDir.length()>100) {
                input.keyboard.shift = true // sprinting
            } else {
                input.keyboard.shift = false
            }
            touchDir.normalize()
            direction.x = touchDir.x
            direction.y = touchDir.y
        }
        if (input.keyboard.forward) {
            direction.x += 0
            direction.y += 1
        }
        if (input.keyboard.backward) {
            direction.x += 0
            direction.y += -1
        }
        if (input.keyboard.left) {
            direction.x += -1
            direction.y += 0
        }
        if (input.keyboard.right) {
            direction.x += 1
            direction.y += 0
        }
        return direction
    }

    player1.doubleJumped = false
    player1.animate = function(delta, input){
        var nextPos, rotation;
        var falling = player1.falling(delta)
        var direction = getDirection(input, delta)
        if (!falling) {
            player1.doubleJumped = false
            if ((input.touch.x!=0&&input.touch.y!=0) || input.keyboard.forward || input.keyboard.backward || input.keyboard.left || input.keyboard.right) {
                if (input.jump) {
                    player1.velocity.x = (direction.x)/delta
                    player1.velocity.z = (direction.y)/delta
                } else {
                    rotation = Math.atan2(direction.x, direction.y)
                    player1.velocity.set(0,0,0)

                    var testDirection = new Vector3()
                    camera.getWorldDirection(testDirection)
                    testDirection.normalize().multiplyScalar(delta*player1.runOrSprint(input));
                    testDirection.applyEuler(new Euler(0, Math.atan2(direction.x, direction.y), 0))                    
                    nextPos = player1.getPosition().clone().add(testDirection)
                    // for moving up/down slopes
                    // also worth mentioning that the players movement distance will increase as it goes uphill, which should probably be fixed eventually
                    var origin = nextPos.clone().add(
                        new Vector3(0, 0.5, 0).applyEuler(player1.getRotation())
                    )
                    var slopeRay = new Raycaster(origin, new Vector3(0, -1, 0).applyEuler(player1.getRotation()), 0, 1)
                    var top = slopeRay.intersectObjects(collidableEnvironment, true);
                    if (top.length>0){
                        // the 0.01 is kinda hacky tbh
                        nextPos = top[0].point.add(new Vector3(0, 0.1, 0).applyEuler(player1.getRotation()))
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
                    var dir = new Vector3();
                    camera.getWorldDirection(dir)
                    rotation = Math.atan2(dir.x, dir.z)
//                     this.gltf.scene.rotateOnAxis(this.gltf.scene.up, rotation)
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
        if (activeRopeArrow!=null && activeRopeArrow.stopped) {
            player1.velocity.x += direction.x*velocityInfluenceModifier*delta
            player1.velocity.z += direction.z*velocityInfluenceModifier*delta
            this.velocity.add(activeRopeArrow.position.clone().sub(this.getPosition()).normalize())
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
                    player1.velocity.sub(player1.getPosition().clone().normalize().multiplyScalar(gravityAcceleration*delta))
                }
                if (player1.isFiring()) {
                    var dir = new Vector3();
                    camera.getWorldDirection(dir)
                    rotation = Math.atan2(dir.x, dir.z)
                }
                this.gltf.scene.up = this.getPosition().clone().normalize()
                this.gltf.scene.quaternion.setFromUnitVectors(new Vector3(0,1,0), nextPos.clone().normalize())
                if (rotation != null) {
//                     this.gltf.scene.lookAt(testDirection)
//                     var quat = new Quaternion().setFromAxisAngle(new Vector3(0,0,1), Math.atan2(testDirection.x, testDirection.y));
//                     player1.gltf.scene.applyQuaternion(quat)

//                     this.gltf.scene.quaternion.setFromUnitVectors(this.getPosition().clone().applyEuler(new Euler(0, 0, -Math.PI/2)).normalize(), testDirection.clone().normalize())

//                     this.gltf.scene.rotateY(Math.atan2(testDirection.x, testDirection.y))
//                     this.gltf.scene.rotateOnAxis(direction.cross(this.gltf.scene.up), Math.acos(direction.dot(this.gltf.scene.up)/direction.length()))
//                     this.getRotation().y = rotation
                }
                player1.getPosition().copy(nextPos)
                camera.updateCamera()
            } else {
                if (falling) {// slide off edge
//                     player1.velocity.copy(collisionVector.clone().negate().normalize().multiplyScalar(10))
//                     nextPos.add(player1.velocity.clone().multiplyScalar(delta))
//                     player1.getPosition().copy(nextPos)
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
        this.playAction("death")
    }

    player1.respawn = function() {
        scene.add(player1.gltf.scene)
        player1.getPosition().copy(new Vector3())
    }

    player1.sendChat = function(message) {
        sendMessage({
            player: player1.uuid,
            chatMessage: message
        })
    }

    player1.activeActions = []
    player1.playAction = function(action) {
        if (this.anim[action]) {
            this.anim[action].reset().play()
            sendMessage({
                player: this.uuid,
                playAction: action
            })
            if (!this.activeActions.includes(action)) {
                this.activeActions.push(action)   
            }
        }
    }

    player1.stopAction = function(action) {
        if (this.activeActions.includes(action)) {
            this.activeActions = this.activeActions.filter(e => e != action)
            this.anim[action].stop()
            sendMessage({
                player: this.uuid,
                stopAction: action
            })
        } else {
            console.error("tried to stop action: " + action + ", but action was never started")
        }
    }

    player1.bowAction = function(bowAction) {
        if (this.anim && this.anim[bowAction]){
            if (this.activeBowAction != bowAction) {
                if (this.activeBowAction) {
                    this.stopAction(this.activeBowAction)
                    this.activeBowAction = null
                }
                if (this.activeMovement && this.activeMovement != "runWithLegsOnly") {
                    this.stopAction(this.activeMovement)
                }
                if (bowAction) {
                    this.playAction(bowAction)
                }
                this.activeBowAction = bowAction
                
            }
        } else {
            console.error("action: " + bowAction + " does not exist!");
        }
    }

    player1.movementAction = function(action="idle") {
        if (this.anim && this.anim[action]) {
            if (this.activeMovement) {
                if (this.activeMovement != action) {
                    this.stopAction(this.activeMovement)
                } else  {
                    return
                }
            }
            this.playAction(action)
            this.activeMovement = action
        } else {
            console.error("action: " + action + " does not exist!");
        }
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
        if (activeRopeArrow!=null) {
            activeRopeArrow = null
            retractRopeArrow();
        } else if (player1.bowState == "unequipped") {
            player1.equipBow()
        } else {
            if (activeRopeArrow==null) {
                if (this.activeActions.includes("jumping")) {
                    this.stopAction("jumping")
                }
                player1.playBowAction("drawBow")
                player1.bowState = "drawing"
                camera.zoomIn()
            }
        }
    }

    var activeRopeArrow
    player1.onMouseUp = function(event) {
         if (player1.bowState == "drawn") {
            player1.playBowAction("fireBow")
            if (event.button == 2) {
                activeRopeArrow = shootArrow("rope")
            } else {
                shootArrow("normal");   
            }
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
                player: player1.uuid,
                position: player1.getPosition(),
                rotation: player1.getRotation().y,
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

    player1.getPosition().y = 200
//     player1.getPosition().z -= 150
    scene.add( player1.gltf.scene );
    // say hi to server
    sendMessage({
        player: player1.uuid,
        position: player1.getPosition(),
        race: player1.race
    })
    player1.equipBow()
    player1.idle()
});

export default player1