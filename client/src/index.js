import { Clock } from 'three'

import { scene } from './scene'
import { renderer } from './renderer'
import { camera } from './camera'
import { player1, mixer } from './player1'
import { animateArrows } from './arrow'
import { players, animatePlayers } from './players';

var clock = new Clock()
document.body.appendChild( renderer.domElement )
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

var state = "ready"

// mouse/keyboard events
document.addEventListener('mousemove', onMouseMove);
document.addEventListener('keydown', onKeyDown);
document.addEventListener('keyup', onKeyUp);
document.addEventListener('click', onClick);
document.addEventListener('mousedown', onMouseDown);
document.addEventListener('mouseup', onMouseUp);
document.addEventListener('pointerlockchange', onPointerLockChange)

// touch events
document.addEventListener('touchstart', handleTouch);
document.addEventListener('touchmove', handleTouch);
document.addEventListener('touchend', onTouchEnd);

window.addEventListener('resize', resize);

animate();

function animate() {
    requestAnimationFrame( animate );
    var delta = clock.getDelta();
    animateArrows(delta);
    if (player1 && mixer) {
        player1.animate(delta, input);
        mixer.update( delta );
    }
    if (Object.keys(players.all()).length) {
        animatePlayers(delta)
    }
    renderer.render( scene, camera );
}

function toggleKey(event, toggle) {
    switch(event.key) {
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
            input.keyboard.space = toggle;
            break;
    }
}
function onKeyDown(event) {
    toggleKey(event, true);
}
function onKeyUp(event) {
    toggleKey(event, false);
}

function onMouseDown() {
    if (state === "playing") {
        player1.onMouseDown()
    }
}
function onMouseUp() {
    if (state === "playing") {
        player1.onMouseUp()
    }
}


function onClick() {
    if (state !== "playing") {
        document.body.requestPointerLock();
        state = "playing"
    }
}

function onPointerLockChange() {
    if (!document.pointerLockElement) {
        state = "ready"
    }
}

var usingTouchControls = false;
function touchControls(bool) {
    if (bool!=usingTouchControls) {
        if (bool) {
            shootButton.setAttribute("style", "display: block;"+shootButtonStyle)
        } else {
            shootButton.setAttribute("style", "display: none;"+shootButtonStyle)
        }
        usingTouchControls = bool
    }
}

var cameraTouch = {id: null, x: null, y: null, shoot: false}
var movementTouch = {id: null, x: null, y: null}
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
        camera.moveCamera(4*(camTouch.pageX-cameraTouch.x), 4*(camTouch.pageY-cameraTouch.y))
        cameraTouch.x = camTouch.pageX
        cameraTouch.y = camTouch.pageY
    } else if (newTouch) {
        if (newTouch.target.id === "shootButton") {
            player1.onMouseDown()
            cameraTouch.shoot = true
        }
        if (newTouch.pageX > window.innerWidth/2) {
            cameraTouch.id = newTouch.identifier
            cameraTouch.x = newTouch.pageX
            cameraTouch.y = newTouch.pageY
        }
    }
    if (moveTouch) {
        input.touch.x = moveTouch.pageX-movementTouch.x
        input.touch.y = -1*(moveTouch.pageY-movementTouch.y) // this needs to be negative for some reason
    } else if (newTouch && newTouch.pageX < window.innerWidth/2) {
        movementTouch.id = newTouch.identifier
        movementTouch.x = newTouch.pageX
        movementTouch.y = newTouch.pageY
    }
}

function onTouchEnd(event) {
    if (cameraTouch.id == event.changedTouches[0].identifier) {
        if (cameraTouch.shoot) {
            player1.onMouseUp();
        }
        cameraTouch.id = null
        cameraTouch.shoot = false
    } else if (movementTouch.id == event.changedTouches[0].identifier) {
        movementTouch.id = null
        input.touch = {x:0, y:0}
    }
}

function onMouseMove(event) {
    if (event.target.id != "shootButton") { // I'm not sure why this is needed but otherwise the shootBUtton disapears
        touchControls(false)        
    }
    var movementX = event.movementX || event.mozMovementX || event.webkitMovementX || 0;
    var movementY = event.movementY || event.mozMovementY || event.webkitMovementY || 0;
    camera.moveCamera(movementX, movementY);
}

function resize() {
    renderer.setSize(window.innerWidth, window.innerHeight);
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
}

var bodyElement = document.getElementsByTagName("BODY")[0];

// create crosshair
var crosshairHtmlElement = document.createElement("div")
crosshairHtmlElement.setAttribute("style", "position: fixed; top: 50%; left: 50%; transform: translate(-50%, -50%); width: 30px; height: 30px; background-image: url(crosshair.svg);")
bodyElement.appendChild(crosshairHtmlElement)

// shoot button for mobile controls
var shootButton = document.createElement("div");
shootButton.setAttribute("id", "shootButton");
const shootButtonStyle = "position: fixed; top: 50%; left: 85%; width: 50px; height: 50px; background-image: url(dot-and-circle.svg);"
shootButton.setAttribute("style", "display: none;"+shootButtonStyle)
bodyElement.appendChild(shootButton)

// full screen button
var fullScreenButton = document.createElement("div");
fullScreenButton.onclick = function() {
    if (bodyElement.requestFullscreen) {
        bodyElement.requestFullscreen();
    } else if (bodyElement.mozRequestFullScreen) { /* Firefox */
        bodyElement.mozRequestFullScreen();
    } else if (bodyElement.webkitRequestFullscreen) { /* Chrome, Safari and Opera */
        bodyElement.webkitRequestFullscreen();
    } else if (bodyElement.msRequestFullscreen) { /* IE/Edge */
        bodyElement.msRequestFullscreen();
    }
}
fullScreenButton.setAttribute("style", "position: fixed; top: 10%; left: 7%;; transform: translate(-50%, -50%); width: 15px; height: 15px; background-image: url(fullscreen.svg);")
bodyElement.appendChild(fullScreenButton)
