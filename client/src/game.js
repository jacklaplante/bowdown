import { Clock } from 'three'

import { scene } from './scene'
import { renderer } from './renderer'
import { camera } from './camera'
import { player1, mixer } from './player1'
import { animateArrows } from './arrow'
import { players, animatePlayers } from './players';

var clock = new Clock()
document.body.appendChild(renderer.domElement)
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
var state = "ready"
var usingTouchControls = false;
var cameraTouch = {id: null, x: null, y: null, shoot: false}
var movementTouch = {id: null, x: null, y: null}
const cameraTouchSensitivity = 4
const shootButton = document.getElementById("shoot-button")
var rotated

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

function touchControls(bool) {
    if (bool!=usingTouchControls) {
        if (bool) {
            shootButton.setAttribute("style", "display: block;")
        } else {
            shootButton.setAttribute("style", "display: none;")
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
        if (newTouch.target.id === "shoot-button") {
            player1.onMouseDown()
            cameraTouch.shoot = true
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
    if (event.target.id != "shoot-button") { // I'm not sure why this is needed but otherwise the shootBUtton disapears
        touchControls(false)        
    }
    var movementX = event.movementX || event.mozMovementX || event.webkitMovementX || 0;
    var movementY = event.movementY || event.mozMovementY || event.webkitMovementY || 0;
    camera.moveCamera(movementX, movementY);
}

function resize() {
    var width, height;
    if (renderer.domElement.width < renderer.domElement.height) {
        width = renderer.domElement.height
        height = renderer.domElement.width
    } else {
        width = renderer.domElement.width
        height = renderer.domElement.height
    }
    renderer.setSize(width, height);
    camera.aspect = width / height;
    camera.updateProjectionMatrix();
}

export function start() {
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

    animate();

    // create crosshair
    var crosshairHtmlElement = document.getElementById("crosshair")
    crosshairHtmlElement.setAttribute("style", "display: block;")

    if (screen.width < screen.height) { // maybe add this clas as well: screen.orientation.type.includes("portrait")
        // first lets make sure if this works on iphones
        
        // if (document.body.requestFullscreen) {
        //     document.body.requestFullscreen();
        // } else if (document.body.mozRequestFullScreen) { /* Firefox */
        //     document.body.mozRequestFullScreen();
        // } else if (document.body.webkitRequestFullscreen) { /* Chrome, Safari and Opera */
        //     document.body.webkitRequestFullscreen();
        // } else if (document.body.msRequestFullscreen) { /* IE/Edge */
        //     document.body.msRequestFullscreen();
        // }
        document.body.classList.add('rotated')
        rotated = true
    }
}