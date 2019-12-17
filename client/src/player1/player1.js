import {Vector3, AnimationMixer, Raycaster, Vector2, Quaternion, Euler} from 'three'

import {loader} from '../loader'
import {uuid, removeCollisionLines, localVector, getRandom} from '../utils'
import scene from '../scene'
import {camera, cameraTarget} from '../camera'
import {shootArrow, retractRopeArrow} from '../arrow'
import {sendMessage} from '../websocket'
import {init} from '../archer'
import {gameOver} from '../game'
import {loadAudio, loadAllAudio, addAudio} from '../audio'
import {updateCrown} from '../kingOfCrown'

import audioBowShot from '../../audio/effects/Bow Shot.mp3'
import audioBowDraw from '../../audio/effects/Bow Draw.mp3'
import audioGrappleShot from '../../audio/effects/Grapple Shot.mp3'
import audioGrappleReel from '../../audio/effects/Grapple Reel Loop.mp3'

const benji = require.context('../../models/benji');
const footsteps = require.context('../../audio/effects/footsteps');

var player1 = {uuid: uuid()}
const movementSpeed = 7
const sprintModifier = 1.3
const velocityInfluenceModifier = 30
const inputInfluenceVelocityModifier = 5
const gravityAcceleration = 10
const godMode = false

var sounds = {}
sounds.bowShot = loadAudio(audioBowShot)
sounds.bowDraw = loadAudio(audioBowDraw)
sounds.grappleShot = loadAudio(audioGrappleShot)
sounds.grappleReel = loadAudio(audioGrappleReel)
sounds.footsteps = loadAllAudio(footsteps)

player1.race = getRandom(['black', 'brown', 'white']);
loader.load(benji('./benji_'+player1.race+'.gltf'),
  ( gltf ) => {
    player1.gltf = gltf;
    addAudio(player1.gltf.scene, sounds)
    player1.bowState = "unequipped"
    
    var mixer = new AnimationMixer(gltf.scene);
    init(mixer, player1);
    player1.setVelocity(new Vector3())
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

    player1.isFalling = function(delta){
        if (delta) {
            var origin = this.getPosition().add(this.getVelocity().multiplyScalar(delta)).sub(this.globalVector(new Vector3(0, 0.1, 0)));
            var dir = this.globalVector(new Vector3(0, 1, 0));
            var ray = new Raycaster(origin, dir, 0, 0.2 + this.getVelocity().length() * delta);
            var collisionResults = ray.intersectObjects(scene.getCollidableEnvironment([origin]), true);
            if ( collisionResults.length > 0) {
                this.doubleJumped = false
                return false
            }
            return true;   
        }
    }

    player1.collisionDetected = function(nextPos){
        removeCollisionLines(this)
        var vect = nextPos.clone().sub(this.getPosition())
        //check for collisions at foot level
        var origin = this.getPosition()
        var ray = new Raycaster(origin, vect.clone().normalize(), 0, vect.length())
        var collisionResults = ray.intersectObjects(scene.getCollidableEnvironment([origin, nextPos]), true)
        if (collisionResults.length > 0) {
            return true;
        }
        return false;
    }

    player1.playBowAction = function(bowAction) {
        if (this.isRunning() && this.activeMovement!='runWithLegsOnly') {
            this.movementAction('runWithLegsOnly')
        } else if (this.activeMovement) {
            this.stopAction(this.activeMovement)
            this.activeMovement = null
        }
        this.bowAction(bowAction);
        this.broadcast();
    }

    player1.onMouseDown = function() {
        if (this.activeRopeArrow!=null) {
            this.activeRopeArrow = null
            retractRopeArrow();
            if (sounds.grappleReel.isPlaying) {
                sounds.grappleReel.stop()   
            }
        } else if (this.bowState == "unequipped") {
            this.equipBow()
        } else {
            if (this.activeActions.includes("jumping")) {
                this.stopAction("jumping")
            }
            sounds.bowDraw.play();
            this.playBowAction("drawBow")
            this.bowState = "drawing"
            setTimeout(function(){
                if (player1.bowState == "drawing") {
                    document.getElementById("crosshair").classList.add("aiming")
                    player1.bowState = "drawn"
                }
            }, 1000);
            camera.zoomIn()
        }
    }

    player1.onMouseUp = function(event) {
        document.getElementById("crosshair").classList.remove("aiming")
        if (sounds.bowDraw.isPlaying) {
            sounds.bowDraw.stop()
        }
        if (this.bowState == "drawn") {
            this.playBowAction("fireBow")
            if (event.button == 2) {
                this.activeRopeArrow = shootArrow("rope")
                sounds.grappleShot.play()
            } else {
                sounds.bowShot.play();
                shootArrow("normal");   
            }
            this.bowState = "firing"
            camera.zoomOut()
        } else if (this.bowState === "drawing") {
            this.stopAction(this.activeBowAction)
            this.activeBowAction = null
            this.bowState = "equipped"
            this.idle()
            camera.zoomOut()
        }
    }

    var payload = {} // right now the payload will only keep track of velocity and position
    player1.broadcast = async function() {
        sendMessage(
            {
                player: this.uuid,
                position: this.getPosition(),
                velocity: this.getVelocity(),
                rotation: this.getRotation(),
                bowState: this.bowState,
                kingOfCrown: this.kingOfCrown
            }
        )
        payload = {}
    }

    function godModeOn() {
        return godMode && process.env.NODE_ENV == 'development'
    }

    function runOrSprint(input) {
        if (input.keyboard.shift) {
            if (player1.isRunning()) {
                player1.anim[player1.activeMovement].timeScale = sprintModifier
            }
            if (godModeOn()) {
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
        var up = player1.localVector(0, 1, 0)
        return cameraDirection.clone()
            .projectOnPlane(up)
            .applyAxisAngle(up, -Math.atan2(inputDirection.x, inputDirection.y))
            .normalize()
            .multiplyScalar(delta*runOrSprint(input))
    }

    function getForwardDirection(cameraDirection) {
        var direction = cameraDirection.clone()
        if (scene.gravityDirection == "center") {
            direction.applyQuaternion(
                new Quaternion().setFromUnitVectors(
                    cameraTarget.clone().normalize(), new Vector3(0,1,0)))
        }
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
        if (!scene.loaded) return
        var inputDirection = getInputDirection(input) // Vector2 describing the direction of user input for movement
        var cameraDirection = camera.getWorldDirection(new Vector3())// Vector3 describing the direction the camera is pointed
        var globalDirection = getGlobalDirection(cameraDirection, inputDirection, input, delta) // Vector3 describing the players forward movement in the world
        var forwardDirection = getForwardDirection(cameraDirection) // Vector2 describing the direction the relative direction (if the player were on flat land) (not taking into account user movement input)in
        var localDirection = getLocalDirection(forwardDirection, inputDirection, delta) //  Vector2 describing the direction the relative direction (if the player were on flat land)
        var nextPos, rotation;
        this.falling = this.isFalling(delta)
        if (godModeOn() || !this.falling) {
            if (this.getVelocity().length() > 0) {
                this.setVelocity(new Vector3())
                this.broadcast()
            }
            if (runningInput(input)) {
                rotation = Math.atan2(localDirection.x, localDirection.y)
                nextPos = this.getPosition()
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
            } else {
                if (this.isRunning()) {
                    if (this.isFiring()) {
                        this.stopAction(this.activeMovement)
                        this.activeMovement = null
                    } else {
                        this.idle()
                    }
                }
            }
        } else if (!godModeOn() && scene.loaded) {
            var grav = gravityAcceleration
            // if the player is falling
            if (this.doubleJumped && this.isFiring()) {
                grav *= 0.5 //slow fall
            }
            this.velocity.sub(this.localVector(0, grav*delta, 0))
        }
        if (this.isFiring()) {
            rotation = Math.atan2(forwardDirection.x, forwardDirection.y)
            camera.updateCamera() // is this needed?
            this.broadcast()
        }
        if (input.jump && !this.doubleJumped) {
            input.jump = null
            if (this.falling) {
                this.doubleJumped = true
                if (inputDirection.length()) {
                    this.velocity.copy(globalDirection.clone().multiplyScalar(1/delta))
                }
            }
            this.velocity.add(this.localVector(0, 7, 0))
            this.playAction("jumping")
        }
        var positionDeltaFromVelocity = velocityToPositionDelta(delta, inputDirection, cameraDirection)
        if (positionDeltaFromVelocity) {
            if (!nextPos) nextPos = this.getPosition()
            nextPos.add(this.getVelocity().multiplyScalar(delta))
        }
        if (nextPos) {
            var collision = this.collisionDetected(nextPos)
            if(godModeOn() || !collision) {
                this.velocity = nextPos.clone().sub(this.getPosition()).multiplyScalar(1/delta)
                updatePosition(nextPos, rotation)
                if (runningInput(input)) {
                    this.run() // running animation and footstep sound
                }
            } else {
                this.setVelocity(new Vector3())
            }
            this.broadcast()
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
        if (scene.gravityDirection == "down") {
            if (rotation) {
                player1.gltf.scene.rotation.y = rotation
            }
        } else {
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
    }

    function velocityToPositionDelta(delta, inputDirection, cameraDirection) {
        if (grappling()) {
            if (inputDirection.length() != 0) {
                var velocityInfluence = cameraDirection.clone().applyAxisAngle(player1.getPosition().normalize(), -Math.atan2(inputDirection.x, inputDirection.y))
                player1.addVelocity(velocityInfluence.multiplyScalar(delta))
            }
            var arrowToPlayer = player1.activeRopeArrow.position.clone().sub(player1.getPosition())
            player1.addVelocity(arrowToPlayer.normalize().multiplyScalar(velocityInfluenceModifier*delta))
            if (player1.getVelocity().angleTo(arrowToPlayer) > Math.PI/2) {
                player1.setVelocity(player1.getVelocity().projectOnPlane(arrowToPlayer.clone().normalize()))
            }
            if (!sounds.grappleReel.isPlaying) {
                sounds.grappleReel.play()
            }
        }
        if (player1.getVelocity().length() != 0) {
            return player1.getVelocity().multiplyScalar(delta)
        }
    }

    player1.localVector = function(x, y, z) {
        return localVector(new Vector3(x, y, z), this.getPosition(), scene.gravityDirection);
    }

    player1.idle = function() {
        this.movementAction('idle')
        this.broadcast();
    }

    player1.equipBow = function() {
        this.bowState = "equipped"
        this.playBowAction("equipBow")
        this.toggleBow(true)
    }

    player1.unequipBow = function() {
        this.toggleBow(false)
        this.bowState = "unequipped";
    }

    player1.takeDamage = function(damage) {
        this.hp -= damage
        this.playAction("death")
        gameOver()
    }

    player1.init = function() {
        scene.add(this.gltf.scene)
    }

    player1.respawn = function() {
        if (this.activeActions && this.activeActions.includes("death")) {
            this.activeActions = this.activeActions.filter(e => e != "death")
            this.anim["death"].stop()
        }
        var pos = randomSpawn()
        this.hp = 100
        this.gltf.scene.visible = true
        if (scene.gravityDirection == "center") {
            this.gltf.scene.rotation.setFromQuaternion(new Quaternion().setFromUnitVectors(new Vector3(0,1,0), pos.clone().normalize()))
        }
        updatePosition(pos)
        // say hi to server
        sendMessage({
            player: this.uuid,
            hp: this.hp,
            position: pos,
            race: this.race,
            status: 'respawn'
        })
        this.equipBow()
        this.idle()
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

    player1.run = function() {
        if (!this.isRunning()) {
            this.playFootstepSound()
            if (this.bowState == "equipped") {
                this.movementAction('runWithBow')
            } else if (this.isFiring()) {
                this.movementAction('runWithLegsOnly')
            } else {
                this.movementAction('running')
            }
        }
    }

    player1.playFootstepSound = function() {
        setTimeout(() => {
            if (player1.isRunning()) {
                let sound = getRandom(sounds.footsteps)
                sound.play()
                player1.playFootstepSound()
            }
        }, 400)
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
        return player1.activeRopeArrow!=null && player1.activeRopeArrow.stopped
    }
}, (bytes) => {
    console.log("player1 " + Math.round((bytes.loaded / bytes.total)*100) + "% loaded")
});

function randomSpawn() { // this should be moved to the server
    if (scene.gravityDirection == "down") {
        return new Vector3( - 13, 10, - 9 )
    }
    if (process.env.NODE_ENV == 'development') {
        return new Vector3(-70,-70,-70)
        // return new Vector3(22.96985387802124, -13.388231039047241, 17.285733222961426)
    }
    return new Vector3(Math.random()*2-1, Math.random()*2-1, Math.random()*2-1).normalize().multiplyScalar(150)
}

function runningInput(input) {
    return (input.touch.x!=0&&input.touch.y!=0) || input.keyboard.forward || input.keyboard.backward || input.keyboard.left || input.keyboard.right
}

export default player1