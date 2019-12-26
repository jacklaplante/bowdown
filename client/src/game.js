import { Clock } from 'three'
import Hammer from 'hammerjs'

import player1 from './player1/player1'
import scene from './scene/scene'
import camera from './camera'
import entities from './entities/entities'
import { renderer } from './renderer'
import { animateArrows } from './arrow/arrow'
import { players, animatePlayers } from './players';
import { newChatMessage } from './chat'
import { recordBot } from './websocket'

require.context('../images/');

var clock = new Clock()
var killCount = 0
var kingOfCrownStartTime = 0

window.addEventListener('resize', resize);
var input = {
    keyboard: {
        forward: false,
        backward: false,
        left: false,
        right: false,
        space: false
    },
    touch: {
        x: 0,
        y: 0
    }
}
var state = "playing"
var usingTouchControls = false;
var cameraTouch = {id: null, x: null, y: null, shoot: false}
var movementTouch = {id: null, x: null, y: null}
var jumpTouch = {id: null}
const cameraTouchSensitivity = 4
var rotated

function animate() {
    requestAnimationFrame( animate );
    var delta = clock.getDelta();
    if (player1 && player1.mixer) {
        if (state != "gameOver" && (player1.hp==null || player1.hp > 0)) {
            player1.animate(delta, input);
            camera.animate(delta);
        }
        player1.mixer.update( delta );
    }
    entities.animate(delta)
    animateArrows(delta);
    if (Object.keys(players.all()).length) {
        animatePlayers(delta)
    }
    scene.animate(delta);
    if (process.env.NODE_ENV == 'development') {
        document.getElementById("fps").innerHTML = Math.round(1/delta)
    }
    updateKingOfCrownTime();
    renderer.render(scene, camera);
}

input.jump = 0
function toggleKey(event, toggle) {
    if (typeof event.key == "string") {
        switch(event.key.toLowerCase()) {
        case 'w':
            input.keyboard.forward = toggle;
            break;
        case 'a':
            input.keyboard.left = toggle;
            break;
        case 's':
            input.keyboard.backward = toggle;
            break;
        case 'd':
            input.keyboard.right = toggle;
            break;
        case ' ':
            if (input.jump != null) {
                input.jump = toggle
            } else if (!toggle) {
                input.jump = false
            }
            break;
        case 'shift':
            input.keyboard.shift = toggle;
            break;
        }   
    }
}
function onKeyDown(event) {
    if (event.keyCode === 13 && document.getElementById("chat").classList.contains("chatting")) {
        var chatTextBox = document.getElementById("chat-text-box")
        player1.sendChat(chatTextBox.value)
        newChatMessage(chatTextBox.value)
        chatTextBox.value = ""
        document.getElementById("chat").classList.remove("chatting")
    }
    if (event.key == 'r') {
        var style = ""
        if (recordBot()) { // recordBot() starts recording the bot if not in production mode
            style = "color: red"
        }
        if (process.env.NODE_ENV == 'development') {
            document.getElementById("fps").setAttribute("style", style)
        }
    }
    toggleKey(event, true);
}
function onKeyUp(event) {
    toggleKey(event, false);
}

function lockPointer() {
    if (document.body.requestPointerLock) {
        document.body.requestPointerLock();
    }
}

function unlockPointer() {
    if (document.exitPointerLock) {
        document.exitPointerLock()
    }
}

function onMouseDown() {
    if (event.target.id == "chat" || event.target.parentElement.id == "chat") {
        document.getElementById("chat").classList.add("chatting")
    } else if (!event.target.classList.contains("button")) {
        document.getElementById("chat").classList.remove("chatting")
        if (event.button!=2) {
            if (state == "paused" && (player1.hp == null || player1.hp > 0)) {
                lockPointer()
                play()
            }
        }
        if (state == "playing") {
            if (document.pointerLockElement == null) {
                lockPointer()
            }
            if (player1 && player1.onMouseDown) player1.onMouseDown()
        }
    }
}
function onMouseUp(event) {
    if (state === "playing" && player1 && player1.onMouseUp) {
        player1.onMouseUp(event)
    }
}

function play() {
    let body = document.body
    body.classList.add('playing')
    removeMenuElement()
    state = "playing"
}

function removeMenuElement() {
    getMenuElement().innerHTML = ""
}

function getMenuElement() {
    return document.querySelector("#menu.centered")
}

function setKillCount(count) {
    killCount = count
    document.getElementById("kill-count").innerHTML += 'X'
}

function setKingOfCrownStartTime(time) {
    kingOfCrownStartTime = time
}

function updateKingOfCrownTime() {
    if (kingOfCrownStartTime) {
        var totalSeconds = Math.round((Date.now()-kingOfCrownStartTime)/1000)
        var minutes = Math.floor(totalSeconds/60)
        var seconds = totalSeconds-minutes*60
        document.getElementById("bow-king").innerHTML = minutes+":"+seconds
    }
}

function gameOver() {
    state = "gameOver"
    document.body.classList.remove("playing")
    document.body.classList.remove("playing")
    document.body.classList.add("gameOver")
    unlockPointer()
    addRespawnButton()
}

function addMenuButton(text) {
    var button = document.createElement('div');
    button.classList.add("button")
    button.innerText = text
    getMenuElement().append(button)
    return button
}

function addRespawnButton() {
    var respawnButton = addMenuButton("respawn")
    respawnButton.onclick = function() {
        player1.respawn()
        play()
        respawnButton.remove()
    }
}

function onPointerLockChange() {
    if (document.pointerLockElement) {
        play()
    } else if (!usingTouchControls) {
        pause()
    }
}

function pause() {
    state = "paused"
    addRespawnButton()
}

let touchElements
function touchControls(bool) {
    if (bool!=usingTouchControls) {
        if (bool) {
            removeMenuElement()
            touchElements.forEach((elem) => elem.setAttribute("style", "display: block;"))
            document.getElementById("fullscreen").setAttribute("style", "top: 8vw")
        } else {
            touchElements.forEach((elem) => elem.setAttribute("style", "display: none;"))
        }
        usingTouchControls = bool
    }
}

function handleTouch(event) {
    event.preventDefault();
    touchControls(true)
    var camTouch, moveTouch, newTouch
    for (var i=0; i<event.targetTouches.length; i++) {
        if (event.targetTouches.item(i).identifier == cameraTouch.id) {
            camTouch = event.targetTouches.item(i)
        } else if (event.targetTouches.item(i).identifier == movementTouch.id) {
            moveTouch = event.targetTouches.item(i)
        } else if (newTouch==null){
            newTouch = event.targetTouches.item(i)
        }
    }
    if (camTouch) {
        if (rotated) {
            camera.moveCamera(cameraTouchSensitivity*(camTouch.pageY-cameraTouch.y), -1*cameraTouchSensitivity*(camTouch.pageX-cameraTouch.x))
        } else {
            camera.moveCamera(cameraTouchSensitivity*(camTouch.pageX-cameraTouch.x), cameraTouchSensitivity*(camTouch.pageY-cameraTouch.y))
        }
        cameraTouch.x = camTouch.pageX
        cameraTouch.y = camTouch.pageY
    } else if (newTouch) {
        if (newTouch.target.id === "shoot-button" || document.getElementById("shoot-button").contains(event.target)) {
            player1.onMouseDown()
            cameraTouch.shoot = true
        } else if (newTouch.target.id === "rope-button" || document.getElementById("rope-button").contains(event.target)) {
            player1.onMouseDown()
            cameraTouch.rope = true
        }
        if (newTouch.target.id === "jump-button") {
            input.jump = true
            jumpTouch.id = newTouch.identifier
        }
        if ((rotated && newTouch.pageY > window.innerHeight/2) || (!rotated && newTouch.pageX > window.innerWidth/2)) {
            cameraTouch.id = newTouch.identifier
            cameraTouch.x = newTouch.pageX
            cameraTouch.y = newTouch.pageY
        }
    }
    if (moveTouch) {
        if (rotated) {
            input.touch.y = moveTouch.pageX-movementTouch.x
            input.touch.x = moveTouch.pageY-movementTouch.y
        } else {
            input.touch.x = moveTouch.pageX-movementTouch.x
            input.touch.y = -1*(moveTouch.pageY-movementTouch.y) // this needs to be negative for some reason
        }
    } else if (newTouch &&
        ((rotated && newTouch.pageY < window.innerHeight/2) || (!rotated && newTouch.pageX < window.innerWidth/2))) {
        movementTouch.id = newTouch.identifier
        movementTouch.x = newTouch.pageX
        movementTouch.y = newTouch.pageY
    }
}

function onTouchEnd(event) {
    if (cameraTouch.id == event.changedTouches[0].identifier) {
        if (cameraTouch.id == jumpTouch.id) {
            input.jump = false
        }
        if (cameraTouch.shoot) {
            player1.onMouseUp({button: 0});
        }
        if (cameraTouch.rope) {
            player1.onMouseUp({button: 2}) // emulate right click
        }
        cameraTouch.id = null
        cameraTouch.shoot = false
        cameraTouch.rope = false
    } else if (movementTouch.id == event.changedTouches[0].identifier) {
        movementTouch.id = null
        input.touch = {x:0, y:0}
    }
}

function onMouseMove(event) {
    if (event.target.id != "shoot-button" && event.target.id != "jump-button" && event.target.id != "rope-button") { // I'm not sure why this is needed but otherwise the shootBUtton disapears
        touchControls(false)        
    }
    var movementX = event.movementX || event.mozMovementX || event.webkitMovementX || 0;
    var movementY = event.movementY || event.mozMovementY || event.webkitMovementY || 0;
    camera.moveCamera(movementX, movementY);
}

function resize() {
    var width, height;
    width = window.innerWidth
    height = window.innerHeight
    if (rotated && window.innerWidth > window.innerHeight) {
        rotated = false
        document.body.classList.remove("rotated")
    } else if (rotated) {
        width = window.innerHeight
        height = window.innerWidth
//     } else if (window.innerWidth < window.innerHeight) { I'm going to remove this for now until I can commit to an mobile interface
//         rotate()
//         width = window.innerHeight
//         height = window.innerWidth
    }
    renderer.setSize(width, height, false);
    camera.aspect = width / height;
    camera.resetFocalLength();
    camera.updateProjectionMatrix();
}

function rotate() {
    document.body.classList.add('rotated')
    rotated = true
}

function initTouchElements() {
    touchElements = [
        document.getElementById("shoot-button"),
        document.getElementById("rope-button"),
        document.getElementById("jump-button"),
        document.getElementById("menu-button"),
        renderer.domElement
    ]
    touchElements.forEach((element) => {
        var mc = new Hammer.Manager(element, {recognizers:[[Hammer.Pinch, { enable: true }]]})
        if (element.id == "menu-button") {
            mc.add(new Hammer.Tap());
            mc.on("tap", function() {
                pause()
            });
        }
    })
}

function start() {
    // mouse/keyboard events
    document.addEventListener('mousemove', onMouseMove);
    document.addEventListener('keydown', onKeyDown);
    document.addEventListener('keyup', onKeyUp);
    document.addEventListener('mousedown', onMouseDown);
    document.addEventListener('mouseup', onMouseUp);
    document.addEventListener('pointerlockchange', onPointerLockChange)
    // touch events
    document.addEventListener('touchstart', handleTouch);
    document.addEventListener('touchmove', handleTouch);
    document.addEventListener('touchend', onTouchEnd);
    // renderer
    document.body.appendChild(renderer.domElement)
    // hammerjs touch controls
    initTouchElements()
    // auto rotate
    if (window.innerWidth < window.innerHeight && document.body.requestPointerLock && document.body.requestPointerLock() && screen.orientation.type && screen.orientation.type.includes("portrait")) {
        if (document.body.requestFullscreen) {
            document.body.requestFullscreen();
        } else if (document.body.mozRequestFullScreen) { /* Firefox */
            document.body.mozRequestFullScreen();
        } else if (document.body.webkitRequestFullscreen) { /* Chrome, Safari and Opera */
            document.body.webkitRequestFullscreen();
        } else if (document.body.msRequestFullscreen) { /* IE/Edge */
            document.body.msRequestFullscreen();
        }
        rotate()
    }
    // !!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
    animate();
    // !!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
    play()
}

export {start, gameOver, setKillCount, setKingOfCrownStartTime}