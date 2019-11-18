import {Vector3, AnimationMixer, Raycaster, Vector2, Quaternion, Euler, PositionalAudio, AudioLoader, Geometry, LineBasicMaterial, Line} from 'three'

import {loader} from './loader'
import {uuid, removeCollisionLines} from './utils'
import scene from './scene'
import {camera, cameraTarget} from './camera'
import {shootArrow, retractRopeArrow} from './arrow'
import {sendMessage} from './websocket'
import {init} from './archer'
import {gameOver} from './game'
import {loadAudio} from './audio'
import {updateCrown} from './kingOfCrown'

import audioBowShot from '../audio/effects/Bow Shot.mp3'
import audioBowDraw from '../audio/effects/Bow Draw.mp3'
import audioGrappleShot from '../audio/effects/Grapple Shot.mp3'
import audioGrappleReel from '../audio/effects/Grapple Reel Loop.mp3'

const models = require.context('../models/');

var player1 = {uuid: uuid()}
const movementSpeed = 7
const sprintModifier = 1.3
const velocityInfluenceModifier = 30
const inputInfluenceVelocityModifier = 5
const gravityAcceleration = 10
const godMode = false // don't you dare change this unless you change it back

var sounds = {}
sounds.bowShot = loadAudio(audioBowShot)
sounds.bowDraw = loadAudio(audioBowDraw)
sounds.grappleShot = loadAudio(audioGrappleShot)
sounds.grappleReel = loadAudio(audioGrappleReel)

player1.race = ['black', 'brown', 'white'][Math.floor(Math.random()*3)];
loader.load(models('./benji_'+player1.race+'.gltf'),
  ( gltf ) => {
    player1.gltf = gltf;
    Object.keys(sounds).forEach((sound) => player1.gltf.scene.add(sounds[sound]))
    player1.velocity = new Vector3()
    player1.bowState = "unequipped"
    
    var mixer = new AnimationMixer(gltf.scene);
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
            var origin = player1.getPosition().add(player1.velocity.clone().multiplyScalar(delta)).sub(this.globalVector(new Vector3(0, 0.1, 0)));
            var dir = this.globalVector(new Vector3(0, 1, 0));
            var ray = new Raycaster(origin, dir, 0, 0.2 + player1.velocity.length() * delta);
            var collisionResults = ray.intersectObjects(scene.getCollidableEnvironment([origin]), true);
            if ( collisionResults.length > 0) {
                player1.doubleJumped = false
                return false
            }
            return true;   
        }
    }

    player1.collisionDetected = function(nextPos){
        removeCollisionLines(player1)
        var vect = nextPos.clone().sub(player1.getPosition())
        //check for collisions at foot level
        var origin = player1.getPosition()
        var ray = new Raycaster(origin, vect.clone().normalize(), 0, vect.length())
        var collisionResults = ray.intersectObjects(scene.getCollidableEnvironment([origin, nextPos]), true)
        if (collisionResults.length > 0) {
            return true;
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
        if (activeRopeArrow!=null) {
            activeRopeArrow = null
            retractRopeArrow();
            if (sounds.grappleReel.isPlaying) {
                sounds.grappleReel.stop()   
            }
        } else if (player1.bowState == "unequipped") {
            player1.equipBow()
        } else {
            if (this.activeActions.includes("jumping")) {
                this.stopAction("jumping")
            }
            sounds.bowDraw.play();
            player1.playBowAction("drawBow")
            player1.bowState = "drawing"
            setTimeout(function(){
                if (player1.bowState == "drawing") {
                    document.getElementById("crosshair").classList.add("aiming")
                    player1.bowState = "drawn"
                }
            }, 1000);
            camera.zoomIn()
        }
    }

    var activeRopeArrow
    player1.onMouseUp = function(event) {
        document.getElementById("crosshair").classList.remove("aiming")
        if (sounds.bowDraw.isPlaying) {
            sounds.bowDraw.stop()
        }
        if (player1.bowState == "drawn") {
            player1.playBowAction("fireBow")
            if (event.button == 2) {
                activeRopeArrow = shootArrow("rope")
                sounds.grappleShot.play()
            } else {
                sounds.bowShot.play();
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
                rotation: player1.getRotation(),
                bowState: player1.bowState,
                kingOfCrown: player1.kingOfCrown
            }
        )
    }

    function runOrSprint(input) {
        if (input.keyboard.shift) {
            if (player1.isRunning()) {
                player1.anim[player1.activeMovement].timeScale = sprintModifier
            }
            if (godMode) {
                return movementSpeed*sprintModifier*30
            }
            return movementSpeed*sprintModifier
        } else {
            if (player1.anim[player1.activeMovement]) {
                player1.anim[player1.activeMovement].timeScale = 1
            }
            return movementSpeed
        }
    }

    function getInputDirection(input) {
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
        return new Vector2(x, y)
    }

    function getGlobalDirection(cameraDirection, inputDirection, input, delta) {
        return cameraDirection.clone()
            .projectOnPlane(player1.getPosition().normalize())
            .applyAxisAngle(player1.getPosition().normalize(), -Math.atan2(inputDirection.x, inputDirection.y))
            .normalize()
            .multiplyScalar(delta*runOrSprint(input))
    }

    function getForwardDirection(cameraDirection) {
        var direction = cameraDirection.clone()
        direction.applyQuaternion(
            new Quaternion().setFromUnitVectors(
                cameraTarget.clone().normalize(), new Vector3(0,1,0)))
        return new Vector2(direction.x, direction.z)
    }

    function getLocalDirection(forwardDirection, inputDirection, delta) {
        if (inputDirection.length() == 0 ) {
            inputDirection = new Vector2(0, 1)
        }
        return forwardDirection.clone()
            .rotateAround(new Vector2(), Math.atan2(inputDirection.x, inputDirection.y))
    }

    player1.doubleJumped = false
    player1.animate = function(delta, input){
        var inputDirection = getInputDirection(input) // Vector2 describing the direction of user input for movement
        var cameraDirection = camera.getWorldDirection(new Vector3())// Vector3 describing the direction the camera is pointed
        var globalDirection = getGlobalDirection(cameraDirection, inputDirection, input, delta) // Vector3 describing the players forward movement in the world
        var forwardDirection = getForwardDirection(cameraDirection) // Vector2 describing the direction the relative direction (if the player were on flat land) (not taking into account user movement input)in
        var localDirection = getLocalDirection(forwardDirection, inputDirection, delta) //  Vector2 describing the direction the relative direction (if the player were on flat land)
        var nextPos, rotation;
        var falling = player1.falling(delta)
        if (godMode || (!falling && scene.loaded)) {
            player1.velocity.set(0,0,0)
            if ((input.touch.x!=0&&input.touch.y!=0) || input.keyboard.forward || input.keyboard.backward || input.keyboard.left || input.keyboard.right) {
                rotation = Math.atan2(localDirection.x, localDirection.y)
                nextPos = player1.getPosition()
                nextPos.add(globalDirection)
                // for moving up/down slopes
                // also worth mentioning that the players movement distance will increase as it goes uphill, which should probably be fixed eventually
                var origin = nextPos.clone().add(this.globalVector(new Vector3(0, 0.25, 0)))
                var slopeRay = new Raycaster(origin, this.globalVector(new Vector3(0, -1, 0)), 0, 0.5)
                var top = slopeRay.intersectObjects(scene.getCollidableEnvironment([origin]), true);
                if (top.length>0){
                    // the 0.01 is kinda hacky tbh
                    nextPos = top[0].point.add(this.globalVector(new Vector3(0, 0.01, 0)))
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
            } else {
                if (player1.isRunning()) {
                    if (player1.isFiring()) {
                        player1.stopAction(player1.activeMovement)
                        player1.activeMovement = null
                    } else {
                        player1.idle()
                    }
                }
            }
        } else if (!godMode && scene.loaded) {
            var grav = gravityAcceleration
            // if the player is falling
            if (player1.doubleJumped && player1.isFiring()) {
                grav *= 0.5 //slow fall
            }
            player1.velocity.sub(player1.getPosition().normalize().multiplyScalar(grav*delta))
        }
        if (player1.isFiring()) {
            rotation = Math.atan2(forwardDirection.x, forwardDirection.y)
            camera.updateCamera() // is this needed?
            player1.broadcast()
        }
        if (input.jump && !player1.doubleJumped) {
            input.jump = null
            if (falling) {
                player1.doubleJumped = true
                if (inputDirection.length()) {
                    this.velocity.copy(globalDirection.clone().multiplyScalar(1/delta))
                }
            }
            this.velocity.add(this.getPosition().normalize().multiplyScalar(7))
            this.playAction("jumping")
        }
        var positionDeltaFromVelocity = velocityToPositionDelta(delta, inputDirection, cameraDirection)
        if (positionDeltaFromVelocity) {
            if (!nextPos) nextPos = player1.getPosition()
            nextPos.add(player1.velocity.clone().multiplyScalar(delta))
        }
        if (nextPos) {
            var collision = player1.collisionDetected(nextPos)
            if(godMode || !collision) {
                this.velocity = nextPos.clone().sub(this.getPosition()).multiplyScalar(1/delta)
                updatePosition(nextPos, rotation)
            } else {
                player1.velocity.set(0,0,0)
            }
            player1.broadcast()
        } else if (rotation) {
            updateRotation(nextPos, rotation)
        }
    }

    function updatePosition(nextPos ,rotation) {
        updateRotation(nextPos, rotation)
        player1.setPosition(nextPos)
        camera.updateCamera()
        if (player1.kingOfCrown) {
            updateCrown(player1)   
        }
    }

    function updateRotation(nextPos, rotation) {
        var quat, quatVert;
        if (nextPos) {
            quatVert = nextPos.clone().normalize()
        } else {
            quatVert = player1.getPosition().normalize()
        }
        if (rotation) {
            player1.getRotation().copy(new Euler(0,rotation,0))
            quat = new Quaternion().setFromUnitVectors(new Vector3(0,1,0), quatVert)   
        } else if (nextPos) {
            quat = new Quaternion().setFromUnitVectors(player1.getPosition().normalize(), quatVert)   
        }
        if (quat) player1.gltf.scene.applyQuaternion(quat)
    }

    function velocityToPositionDelta(delta, inputDirection, cameraDirection) {
        if (grappling()) {
            if (inputDirection.length() != 0) {
                var velocityInfluence = cameraDirection.clone().applyAxisAngle(player1.getPosition().normalize(), -Math.atan2(inputDirection.x, inputDirection.y))
                player1.velocity.add(velocityInfluence.multiplyScalar(delta))
            }
            var arrowToPlayer = activeRopeArrow.position.clone().sub(player1.getPosition())
            player1.velocity.add(arrowToPlayer.normalize().multiplyScalar(velocityInfluenceModifier*delta))
            if (player1.velocity.angleTo(arrowToPlayer) > Math.PI/2) {
                player1.velocity.projectOnPlane(arrowToPlayer.clone().normalize())
            }
            if (!sounds.grappleReel.isPlaying) {
                sounds.grappleReel.play()
            }
        }
        if (player1.velocity.length() != 0) {
            return player1.velocity.clone().multiplyScalar(delta)
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
        this.playAction("death")
        gameOver()
    }

    player1.respawn = function() {
        scene.add(player1.gltf.scene)
        var pos = randomSpawn()
        player1.setPosition(pos)
        player1.gltf.scene.applyQuaternion(new Quaternion().setFromUnitVectors(new Vector3(0,1,0), pos.clone().normalize()))
        // say hi to server
        sendMessage({
            player: player1.uuid,
            position: pos,
            race: player1.race,
            status: 'respawn'
        })
        player1.equipBow()
        player1.idle()
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

    function grappling() {
        return activeRopeArrow!=null && activeRopeArrow.stopped
    }
}, (bytes) => {
    console.log("player1 " + Math.round((bytes.loaded / bytes.total)*100) + "% loaded")
});

function randomSpawn() {
    return new Vector3(75, 75, 75)
    return new Vector3(Math.random()*2-1, Math.random()*2-1, Math.random()*2-1).normalize().multiplyScalar(150)
}

export default player1