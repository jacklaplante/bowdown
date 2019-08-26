(window["webpackJsonp"] = window["webpackJsonp"] || []).push([["game"],{

/***/ "./models/benji.glb":
/*!**************************!*\
  !*** ./models/benji.glb ***!
  \**************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

module.exports = __webpack_require__.p + "ec0f26f24ed9b204e683ac03a0be63f9.glb";

/***/ }),

/***/ "./models/env.glb":
/*!************************!*\
  !*** ./models/env.glb ***!
  \************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

module.exports = __webpack_require__.p + "baae041779d88e3f44e7b73d83d4b782.glb";

/***/ }),

/***/ "./src/archer.js":
/*!***********************!*\
  !*** ./src/archer.js ***!
  \***********************/
/*! exports provided: initActions */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "initActions", function() { return initActions; });
/* harmony import */ var three__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! three */ "./node_modules/three/build/three.module.js");


function getAnimation(animations, name){
    var result;
    animations.forEach((animation) => {
        if (animation.name===name) {
            result = animation
            return
        }
    })
    return result
}

function initActions(mixer, archer) {
    archer.mixer = mixer
    archer.actions = {
        idle: mixer.clipAction(getAnimation(archer.animations, "Idle")),
        running: mixer.clipAction(getAnimation(archer.animations, "Running2")),
        runWithBow: mixer.clipAction(getAnimation(archer.animations, "Run with bow")),
        jumping: mixer.clipAction(getAnimation(archer.animations, "Jumping")).setLoop(three__WEBPACK_IMPORTED_MODULE_0__["LoopOnce"]),
        equipBow: mixer.clipAction(getAnimation(archer.animations, "Equip Bow")).setLoop(three__WEBPACK_IMPORTED_MODULE_0__["LoopOnce"]),
        drawBow: mixer.clipAction(getAnimation(archer.animations, "Draw bow")).setLoop(three__WEBPACK_IMPORTED_MODULE_0__["LoopOnce"]),
        fireBow: mixer.clipAction(getAnimation(archer.animations, "Fire bow")).setLoop(three__WEBPACK_IMPORTED_MODULE_0__["LoopOnce"])
    }
    archer.actions.drawBow.clampWhenFinished = true
}

/***/ }),

/***/ "./src/arrow.js":
/*!**********************!*\
  !*** ./src/arrow.js ***!
  \**********************/
/*! exports provided: shootArrow, animateArrows, addOtherPlayerArrow */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "shootArrow", function() { return shootArrow; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "animateArrows", function() { return animateArrows; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "addOtherPlayerArrow", function() { return addOtherPlayerArrow; });
/* harmony import */ var three__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! three */ "./node_modules/three/build/three.module.js");
/* harmony import */ var _scene__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./scene */ "./src/scene.js");
/* harmony import */ var _players__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./players */ "./src/players.js");
/* harmony import */ var _player1__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./player1 */ "./src/player1.js");
/* harmony import */ var _camera__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ./camera */ "./src/camera.js");
/* harmony import */ var _websocket__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ./websocket */ "./src/websocket.js");








var player1Arrows = [] // these are arrows that were shot by player1
var otherPlayerArrows = [] // these are arrows that were shot by other players
var arrowWidth = 0.06
var arrowLength = 0.75

function createArrow(origin, rotation){
    var geometry = new three__WEBPACK_IMPORTED_MODULE_0__["BoxGeometry"](arrowWidth, arrowWidth, arrowLength);
    var material = new three__WEBPACK_IMPORTED_MODULE_0__["MeshBasicMaterial"]( {color: 0x00ff00} );
    var arrow = new three__WEBPACK_IMPORTED_MODULE_0__["Mesh"]( geometry, material );
    
    arrow.origin = origin
    arrow.position.copy(origin)
    arrow.rotation.copy(rotation)
    _scene__WEBPACK_IMPORTED_MODULE_1__["scene"].add(arrow);

    return arrow
}

function shootArrow(){
    var origin = _player1__WEBPACK_IMPORTED_MODULE_3__["player1"].scene.position.clone().add(new three__WEBPACK_IMPORTED_MODULE_0__["Vector3"](0, 1.5, 0));
    var rotation = _camera__WEBPACK_IMPORTED_MODULE_4__["camera"].rotation // this needs to be changed
    var arrow = createArrow(origin, rotation);

    // if the reticle (center of screen) is pointed at something, aim arrows there! otherwise estimate where the player is aiming 
    var raycaster = new three__WEBPACK_IMPORTED_MODULE_0__["Raycaster"]()
    raycaster.setFromCamera({x: 0, y: 0}, _camera__WEBPACK_IMPORTED_MODULE_4__["camera"]) // the {x: 0, y: 0} means the center of the screen; there may eventually be issues with this not actually lining up with the html reticle
    var collisions = raycaster.intersectObjects(_scene__WEBPACK_IMPORTED_MODULE_1__["collidableEnvironment"].concat(_players__WEBPACK_IMPORTED_MODULE_2__["playerHitBoxes"]), true)
    var direction;
    if (collisions.length > 0) {
        direction = collisions[0].point.sub(origin)
    } else {
        direction = new three__WEBPACK_IMPORTED_MODULE_0__["Vector3"]()
        _camera__WEBPACK_IMPORTED_MODULE_4__["camera"].getWorldDirection(direction)
    }

    arrow.velocity = direction.normalize().multiplyScalar(60)
    player1Arrows.push(arrow)

    Object(_websocket__WEBPACK_IMPORTED_MODULE_5__["sendMessage"])({
        arrow: {
            origin: arrow.position,
            rotation: arrow.rotation,
            velocity: arrow.velocity,
            timeOfShoot: Date.now()
        }
    })
}

function addOtherPlayerArrow(newArrow) {
    var arrow = createArrow(newArrow.origin, newArrow.rotation)
    arrow.velocity = new three__WEBPACK_IMPORTED_MODULE_0__["Vector3"](newArrow.velocity.x, newArrow.velocity.y, newArrow.velocity.z)
    otherPlayerArrows.push(arrow)
    moveArrow(arrow, (Date.now()-newArrow.timeOfShoot)/1000)
}

function moveArrow(arrow, delta) {
    arrow.velocity.y -= delta*9
    arrow.position.add(arrow.velocity.clone().multiplyScalar(delta))
}

function animateArrows(delta) {
    player1Arrows.forEach((arrow) => {
        if(!arrow.stopped){
            moveArrow(arrow, delta)
            // detect arrow collisions
            var direction = new three__WEBPACK_IMPORTED_MODULE_0__["Vector3"](0,0,1)
            direction.applyEuler(arrow.rotation).normalize()
            var collisionTrail = arrow.position.clone().sub(arrow.origin).length()/2 // this is the length of the ray that will be used to detect collisions
            // right now it is the distance from the arrow to the point where the arrow was fired, divided by 2
            // dividing it by 2 is really just a hack. if you don't divide it by 2, the ray would collide with the ground at the players feet when the arrow is shot into the air because the arrow was falling slightly due to gravity
            var ray = new three__WEBPACK_IMPORTED_MODULE_0__["Raycaster"](arrow.position, direction, 0, collisionTrail)
            // detect collisions with other players
            var collisions = ray.intersectObjects(_players__WEBPACK_IMPORTED_MODULE_2__["playerHitBoxes"])
            if (collisions.length > 0) {
                var collision = collisions.pop()
                arrow.position.copy(collision.point)
                arrow.stopped = true
                Object(_players__WEBPACK_IMPORTED_MODULE_2__["killPlayer"])(collision.object.playerUuid)
            }
            // detect collisions with the environment
            collisions = ray.intersectObjects(_scene__WEBPACK_IMPORTED_MODULE_1__["collidableEnvironment"], true)
            if (collisions.length > 0) {
                arrow.position.copy(collisions.pop().point)
                arrow.stopped = true
            }
        }
    })
    otherPlayerArrows.forEach((arrow) => {
        moveArrow(arrow, delta)
    })
}



/***/ }),

/***/ "./src/camera.js":
/*!***********************!*\
  !*** ./src/camera.js ***!
  \***********************/
/*! exports provided: camera, cameraTarget */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "camera", function() { return camera; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "cameraTarget", function() { return cameraTarget; });
/* harmony import */ var three__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! three */ "./node_modules/three/build/three.module.js");
/* harmony import */ var _scene__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./scene */ "./src/scene.js");
/* harmony import */ var _player1__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./player1 */ "./src/player1.js");




var distance = 3.5;

var camera = new three__WEBPACK_IMPORTED_MODULE_0__["PerspectiveCamera"]( 75, window.innerWidth / window.innerHeight, 0.1, 1000 );
camera.position.z = 5;
var cameraTarget = new three__WEBPACK_IMPORTED_MODULE_0__["Vector3"]( 0, 1, 0 );
var theta = 0
var phi = 0

camera.nextPosition = function(dist) {
    if (_player1__WEBPACK_IMPORTED_MODULE_2__["player1"]!=null) {
        var nextPos = new three__WEBPACK_IMPORTED_MODULE_0__["Vector3"]();
        nextPos.x = cameraTarget.x + dist * Math.sin(theta * Math.PI / 360) * Math.cos(phi * Math.PI / 360);
        nextPos.y = cameraTarget.y + dist * Math.sin(phi * Math.PI / 360);
        nextPos.z = cameraTarget.z + dist * Math.cos(theta * Math.PI / 360) * Math.cos(phi * Math.PI / 360);
        return nextPos
    }
}

camera.setPosition = function(nextPos) {
    camera.position.copy(nextPos)
}

camera.updateCamera = function() {
    if (_player1__WEBPACK_IMPORTED_MODULE_2__["player1"]!=null) {
        var v = _player1__WEBPACK_IMPORTED_MODULE_2__["player1"].scene.position.clone().sub(camera.position.clone())
        var v2 = new three__WEBPACK_IMPORTED_MODULE_0__["Vector3"](-v.z, 0, v.x).normalize()
        cameraTarget.copy(_player1__WEBPACK_IMPORTED_MODULE_2__["player1"].scene.position.clone().add(v2)).setY(_player1__WEBPACK_IMPORTED_MODULE_2__["player1"].scene.position.y+1)
        
        var nextPos = camera.nextPosition(distance)

        // this ensures the camera doesn't go behind any meshes
        var ray = new three__WEBPACK_IMPORTED_MODULE_0__["Raycaster"](cameraTarget, nextPos.clone().sub(cameraTarget).normalize(), 0, 5);
        var collisions = ray.intersectObjects(_scene__WEBPACK_IMPORTED_MODULE_1__["collidableEnvironment"], true);
        if(collisions.length>0){
            // this is just some voodoo
            nextPos = collisions[0].point.clone().sub(nextPos.clone().sub(collisions[0].point).normalize().multiplyScalar(0.1))
            // jk, I take the difference between the nextPos and the point of collision, normalize it, multiply it by 0.1, and add that to the collision point to get the new nextPos
            // really all it does is make sure the camera is slightly above the surface that it's colliding with (instead of at the surface)
        }
        camera.setPosition(nextPos)
    }
    camera.lookAt(cameraTarget);
    camera.updateMatrix();
}

camera.moveCamera = function(movementX, movementY) {
    theta -= movementX * 0.2
    var x = phi + movementY * 0.2
    // this simply ensures the camera cannot go over the top/bottom
    // I have it set 10 135 and 80 because otherwise the camera gets all fucky but it's not the best solution
    if (135 >= x && x >= -80) {
        phi = x
    }
    camera.updateCamera();
}



/***/ }),

/***/ "./src/game.js":
/*!*********************!*\
  !*** ./src/game.js ***!
  \*********************/
/*! exports provided: start */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "start", function() { return start; });
/* harmony import */ var three__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! three */ "./node_modules/three/build/three.module.js");
/* harmony import */ var _scene__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./scene */ "./src/scene.js");
/* harmony import */ var _renderer__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./renderer */ "./src/renderer.js");
/* harmony import */ var _camera__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./camera */ "./src/camera.js");
/* harmony import */ var _player1__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ./player1 */ "./src/player1.js");
/* harmony import */ var _arrow__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ./arrow */ "./src/arrow.js");
/* harmony import */ var _players__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! ./players */ "./src/players.js");









var clock = new three__WEBPACK_IMPORTED_MODULE_0__["Clock"]()
document.body.appendChild( _renderer__WEBPACK_IMPORTED_MODULE_2__["renderer"].domElement )
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

function animate() {
    requestAnimationFrame( animate );
    var delta = clock.getDelta();
    Object(_arrow__WEBPACK_IMPORTED_MODULE_5__["animateArrows"])(delta);
    if (_player1__WEBPACK_IMPORTED_MODULE_4__["player1"] && _player1__WEBPACK_IMPORTED_MODULE_4__["mixer"]) {
        _player1__WEBPACK_IMPORTED_MODULE_4__["player1"].animate(delta, input);
        _player1__WEBPACK_IMPORTED_MODULE_4__["mixer"].update( delta );
    }
    if (Object.keys(_players__WEBPACK_IMPORTED_MODULE_6__["players"].all()).length) {
        Object(_players__WEBPACK_IMPORTED_MODULE_6__["animatePlayers"])(delta)
    }
    _renderer__WEBPACK_IMPORTED_MODULE_2__["renderer"].render( _scene__WEBPACK_IMPORTED_MODULE_1__["scene"], _camera__WEBPACK_IMPORTED_MODULE_3__["camera"] );
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
        _player1__WEBPACK_IMPORTED_MODULE_4__["player1"].onMouseDown()
    }
}
function onMouseUp() {
    if (state === "playing") {
        _player1__WEBPACK_IMPORTED_MODULE_4__["player1"].onMouseUp()
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
            shootButton.setAttribute("style", "display: block;"+shootButtonStyle)
        } else {
            shootButton.setAttribute("style", "display: none;"+shootButtonStyle)
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
        _camera__WEBPACK_IMPORTED_MODULE_3__["camera"].moveCamera(4*(camTouch.pageX-cameraTouch.x), 4*(camTouch.pageY-cameraTouch.y))
        cameraTouch.x = camTouch.pageX
        cameraTouch.y = camTouch.pageY
    } else if (newTouch) {
        if (newTouch.target.id === "shootButton") {
            _player1__WEBPACK_IMPORTED_MODULE_4__["player1"].onMouseDown()
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
            _player1__WEBPACK_IMPORTED_MODULE_4__["player1"].onMouseUp();
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
    _camera__WEBPACK_IMPORTED_MODULE_3__["camera"].moveCamera(movementX, movementY);
}

function resize() {
    _renderer__WEBPACK_IMPORTED_MODULE_2__["renderer"].setSize(window.innerWidth, window.innerHeight);
    _camera__WEBPACK_IMPORTED_MODULE_3__["camera"].aspect = window.innerWidth / window.innerHeight;
    _camera__WEBPACK_IMPORTED_MODULE_3__["camera"].updateProjectionMatrix();
}

const shootButtonStyle = "position: fixed; top: 50%; left: 85%; width: 50px; height: 50px; background-image: url(dot-and-circle.svg);"
function start(body) {
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

    // create crosshair
    var crosshairHtmlElement = document.createElement("div")
    crosshairHtmlElement.setAttribute("style", "position: fixed; top: 50%; left: 50%; transform: translate(-50%, -50%); width: 30px; height: 30px; background-image: url(crosshair.svg);")
    body.appendChild(crosshairHtmlElement)
    // shoot button for mobile controls
    var shootButton = document.createElement("div");
    shootButton.setAttribute("id", "shootButton");
    
    shootButton.setAttribute("style", "display: none;"+shootButtonStyle)
    body.appendChild(shootButton)

    // full screen button
    var fullScreenButton = document.createElement("div");
    fullScreenButton.onclick = function() {
        if (body.requestFullscreen) {
            body.requestFullscreen();
        } else if (body.mozRequestFullScreen) { /* Firefox */
            body.mozRequestFullScreen();
        } else if (body.webkitRequestFullscreen) { /* Chrome, Safari and Opera */
            body.webkitRequestFullscreen();
        } else if (body.msRequestFullscreen) { /* IE/Edge */
            body.msRequestFullscreen();
        }
    }
    fullScreenButton.setAttribute("style", "position: fixed; top: 10%; left: 7%;; transform: translate(-50%, -50%); width: 15px; height: 15px; background-image: url(fullscreen.svg);")
    body.appendChild(fullScreenButton)
}

/***/ }),

/***/ "./src/loader.js":
/*!***********************!*\
  !*** ./src/loader.js ***!
  \***********************/
/*! exports provided: loader */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "loader", function() { return loader; });
/* harmony import */ var three_examples_jsm_loaders_GLTFLoader__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! three/examples/jsm/loaders/GLTFLoader */ "./node_modules/three/examples/jsm/loaders/GLTFLoader.js");


var loader = new three_examples_jsm_loaders_GLTFLoader__WEBPACK_IMPORTED_MODULE_0__["GLTFLoader"]();



/***/ }),

/***/ "./src/player1.js":
/*!************************!*\
  !*** ./src/player1.js ***!
  \************************/
/*! exports provided: player1, playerUuid, mixer */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "player1", function() { return player1; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "playerUuid", function() { return playerUuid; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "mixer", function() { return mixer; });
/* harmony import */ var three__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! three */ "./node_modules/three/build/three.module.js");
/* harmony import */ var _loader__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./loader */ "./src/loader.js");
/* harmony import */ var _utils__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./utils */ "./src/utils.js");
/* harmony import */ var _scene__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./scene */ "./src/scene.js");
/* harmony import */ var _camera__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ./camera */ "./src/camera.js");
/* harmony import */ var _arrow__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ./arrow */ "./src/arrow.js");
/* harmony import */ var _websocket__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! ./websocket */ "./src/websocket.js");
/* harmony import */ var _archer__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(/*! ./archer */ "./src/archer.js");
/* harmony import */ var _models_benji_glb__WEBPACK_IMPORTED_MODULE_8__ = __webpack_require__(/*! ../models/benji.glb */ "./models/benji.glb");
/* harmony import */ var _models_benji_glb__WEBPACK_IMPORTED_MODULE_8___default = /*#__PURE__*/__webpack_require__.n(_models_benji_glb__WEBPACK_IMPORTED_MODULE_8__);












var playerUuid = Object(_utils__WEBPACK_IMPORTED_MODULE_2__["uuid"])();

var player1;
var mixer;
const movementSpeed = 0.12;

_loader__WEBPACK_IMPORTED_MODULE_1__["loader"].load( _models_benji_glb__WEBPACK_IMPORTED_MODULE_8___default.a, ( gltf ) => {
    player1 = gltf;
    player1.velocity = new three__WEBPACK_IMPORTED_MODULE_0__["Vector3"]()
    player1.bowState = "unequipped"

    _scene__WEBPACK_IMPORTED_MODULE_3__["scene"].add( gltf.scene );
    mixer = new three__WEBPACK_IMPORTED_MODULE_0__["AnimationMixer"](gltf.scene);
    Object(_archer__WEBPACK_IMPORTED_MODULE_7__["initActions"])(mixer, player1);
    mixer.addEventListener('finished', (event) => {
        if (event.action.getClip().name !== "Draw bow") {
            // this is hacky and should be changed
            player1.playAction("idle")
        } else {
            player1.bowState = "drawn"
        }
    })

    player1.falling = function(){
        var vert = new three__WEBPACK_IMPORTED_MODULE_0__["Vector3"](0, -1, 0);
        vert = vert.clone().normalize()
        var ray = new three__WEBPACK_IMPORTED_MODULE_0__["Raycaster"](new three__WEBPACK_IMPORTED_MODULE_0__["Vector3"](player1.scene.position.x, player1.scene.position.y+0.9, player1.scene.position.z), vert);
        var collisionResults = ray.intersectObjects(_scene__WEBPACK_IMPORTED_MODULE_3__["collidableEnvironment"], true);
        if ( collisionResults.length > 0 && collisionResults[0].distance <= new three__WEBPACK_IMPORTED_MODULE_0__["Line3"](new three__WEBPACK_IMPORTED_MODULE_0__["Vector3"](), vert).distance()) {
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
                var vert = new three__WEBPACK_IMPORTED_MODULE_0__["Vector3"](a, 1, c);
                vert = vert.clone().normalize()
                var ray = new three__WEBPACK_IMPORTED_MODULE_0__["Raycaster"](new three__WEBPACK_IMPORTED_MODULE_0__["Vector3"](nextPos.x, nextPos.y, nextPos.z), vert);
                if (displayCollisionLines){
                    var geometry = new three__WEBPACK_IMPORTED_MODULE_0__["Geometry"]();
                    geometry.vertices.push(
                        vert,
                        new three__WEBPACK_IMPORTED_MODULE_0__["Vector3"]()
                    );
                    var material = new three__WEBPACK_IMPORTED_MODULE_0__["LineBasicMaterial"]({
                        color: 0xff0000
                    });
                    var line = new three__WEBPACK_IMPORTED_MODULE_0__["Line"]( geometry, material )
                    line.name = "collision line"
                    player1.scene.add(line);
                }
                // the true below denotes to recursivly check for collision with objects and all their children. Might not be efficient
                var collisionResults = ray.intersectObjects(_scene__WEBPACK_IMPORTED_MODULE_3__["collidableEnvironment"], true);
                if ( collisionResults.length > 0 && collisionResults[0].distance <= new three__WEBPACK_IMPORTED_MODULE_0__["Line3"](new three__WEBPACK_IMPORTED_MODULE_0__["Vector3"](), vert).distance()) {
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
        Object(_websocket__WEBPACK_IMPORTED_MODULE_6__["sendMessage"])(
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
        if (player1.bowState == "unequipped") {
            player1.equipBow()
        } else {
            player1.playAction("drawBow")
        }
    }

    player1.onMouseUp = function() {
        if (player1.bowState == "drawn") {
            player1.playAction("fireBow")
            Object(_arrow__WEBPACK_IMPORTED_MODULE_5__["shootArrow"])();
            player1.bowState = "equipped"
        } else if (player1.state === "drawBow") {
            player1.actions.drawBow.stop();
            player1.playAction("idle")
        }
    }

    player1.move = function(nextPos, rotation=player1.scene.rotation.y){
        if(!player1.collisionDetected(nextPos)){
            player1.scene.position.copy(nextPos)
            player1.scene.rotation.y = rotation
            _camera__WEBPACK_IMPORTED_MODULE_4__["camera"].updateCamera()
            Object(_websocket__WEBPACK_IMPORTED_MODULE_6__["sendMessage"])(
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
        var direction = new three__WEBPACK_IMPORTED_MODULE_0__["Vector3"]();
        _camera__WEBPACK_IMPORTED_MODULE_4__["camera"].getWorldDirection(direction)
        direction = new three__WEBPACK_IMPORTED_MODULE_0__["Vector2"](direction.x, direction.z) // 3d z becomes 2d y
        direction.normalize().multiplyScalar(movementSpeed);
        var x=0, y=0 // these are the inputDirections
        if (input.touch.x!=0 && input.touch.y!=0) {
            var dir = new three__WEBPACK_IMPORTED_MODULE_0__["Vector2"](input.touch.x, input.touch.y).normalize()
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
        return direction.rotateAround(new three__WEBPACK_IMPORTED_MODULE_0__["Vector2"](), Math.atan2(x, y))
    }

    player1.animate = function(delta, input){
        var nextPos = new three__WEBPACK_IMPORTED_MODULE_0__["Vector3"]();
        var rotation;
        if (player1.falling()) {
            player1.state = 'falling'
            player1.velocity.y -= delta*10
            nextPos = player1.scene.position.clone().add(player1.velocity.clone().multiplyScalar(delta))
            player1.move(nextPos)
        } else {
            player1.velocity.set(0,0,0)
            if (input.keyboard.space) {
                player1.jump();
            }
            if ((input.touch.x!=0&&input.touch.y!=0) || input.keyboard.forward || input.keyboard.backward || input.keyboard.left || input.keyboard.right) {
                var direction = getDirection(input)
                nextPos.z = player1.scene.position.z + direction.y;
                nextPos.x = player1.scene.position.x + direction.x;
                rotation = Math.atan2(direction.x, direction.y)
                player1.velocity.x = (nextPos.x-player1.scene.position.x)/delta
                player1.velocity.z = (nextPos.z-player1.scene.position.z)/delta

                // for moving up/down slopes
                // also worth mentioning that the players movement distance will increase as it goes uphill, which should probably be fixed eventually
                nextPos.y = player1.scene.position.y
                var origin = new three__WEBPACK_IMPORTED_MODULE_0__["Vector3"](nextPos.x, nextPos.y+1, nextPos.z)
                var slopeRay = new three__WEBPACK_IMPORTED_MODULE_0__["Raycaster"](origin, new three__WEBPACK_IMPORTED_MODULE_0__["Vector3"](0, -1, 0))
                var top = slopeRay.intersectObjects(_scene__WEBPACK_IMPORTED_MODULE_3__["collidableEnvironment"], true);
                if (top.length>0){
                    // the 0.01 is kinda hacky tbh
                    nextPos.y = top[0].point.y+0.01
                }
                
                player1.move(nextPos, rotation)
                if (!player1.isRunning()) {
                    if (player1.bowState == "equipped") {
                        player1.playAction('runWithBow')
                    } else {
                        player1.playAction('running')
                    }
                }
            } else if (player1.isRunning()) {
                player1.playAction('idle')
            }
            if (input.keyboard.space) {
                nextPos = player1.scene.position.clone().add(player1.velocity.clone().multiplyScalar(delta))
                player1.move(nextPos)
            }
        }
    }

    player1.equipBow = function() {
        player1.bowState = "equipped"
        player1.playAction("equipBow")
        // this is a hack because I'm too lazy to figure out how to animate this in blender
        player1.scene.children[0].children[1].visible = false
        player1.scene.children[0].children[2].visible = true
    }

    player1.unequipBow = function() {
        player1.scene.children[0].children[2].visible = false
        player1.scene.children[0].children[1].visible = true
        player1.bowState = "unequipped";
    }

    player1.takeDamage = function() {
        player1.scene.position.y -=20
    }

    player1.unequipBow()
    player1.playAction('idle')
});



/***/ }),

/***/ "./src/players.js":
/*!************************!*\
  !*** ./src/players.js ***!
  \************************/
/*! exports provided: players, animatePlayers, playerAction, playerHitBoxes, killPlayer */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "players", function() { return players; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "animatePlayers", function() { return animatePlayers; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "playerAction", function() { return playerAction; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "playerHitBoxes", function() { return playerHitBoxes; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "killPlayer", function() { return killPlayer; });
/* harmony import */ var three__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! three */ "./node_modules/three/build/three.module.js");
/* harmony import */ var _loader__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./loader */ "./src/loader.js");
/* harmony import */ var _scene__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./scene */ "./src/scene.js");
/* harmony import */ var _archer__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./archer */ "./src/archer.js");
/* harmony import */ var _models_benji_glb__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ../models/benji.glb */ "./models/benji.glb");
/* harmony import */ var _models_benji_glb__WEBPACK_IMPORTED_MODULE_4___default = /*#__PURE__*/__webpack_require__.n(_models_benji_glb__WEBPACK_IMPORTED_MODULE_4__);
/* harmony import */ var _websocket__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ./websocket */ "./src/websocket.js");








var players = {};
var roster = {}
var playerHitBoxes = []

players.all = function() {
    return roster;
}

players.get = (uuid) => {
    return roster[uuid]
}

players.add = function(uuid, position) {
    // this is a hacky way to make sure the player model isn't loaded multiple times
    roster[uuid] = 'loading'
    _loader__WEBPACK_IMPORTED_MODULE_1__["loader"].load(_models_benji_glb__WEBPACK_IMPORTED_MODULE_4___default.a, function(player) {
        roster[uuid] = player; // this needs to happen first, pretty sure
        Object(_archer__WEBPACK_IMPORTED_MODULE_3__["initActions"])(new three__WEBPACK_IMPORTED_MODULE_0__["AnimationMixer"](player.scene), player);
        if (position) {
            players.move(uuid, position, 0)
        }
        _scene__WEBPACK_IMPORTED_MODULE_2__["scene"].add( player.scene );
        playAction(player, "idle")

        var hitBox = new three__WEBPACK_IMPORTED_MODULE_0__["Mesh"](new three__WEBPACK_IMPORTED_MODULE_0__["BoxGeometry"](0.5, 2, 0.5));
        hitBox.position.y += 1
        hitBox.material.visible = false
        player.scene.add(hitBox)
        hitBox.playerUuid = uuid
        playerHitBoxes.push(hitBox)
    });
}

players.init = function(newPlayers) {
    Object.keys(newPlayers).forEach(
        (playerUuid) => {
            players.add(playerUuid, new three__WEBPACK_IMPORTED_MODULE_0__["Vector3"](
                newPlayers[playerUuid].x,
                newPlayers[playerUuid].y,
                newPlayers[playerUuid].z));
        })
}

players.move = function(playerUuid, pos, rotation, action) {
    var player = roster[playerUuid]
    player.scene.position.copy(pos)
    player.scene.rotation.y = rotation
    playAction(player, action)
}

function playAction(player, action) {
    if (player.actions && player.actions[action]) {
        if (player.activeAction) {
            if (player.activeAction != action) {
                player.actions[player.activeAction].stop()
            } else  {
                return
            }
        }
        player.actions[action].reset().play()
        player.activeAction = action
    }
}

function animatePlayers(delta) {
    Object.keys(roster).forEach(
        (playerUuid) => {
            if (roster[playerUuid].mixer) {
                roster[playerUuid].mixer.update(delta)
            }
        })
}

function playerAction(playerUuid, action) {
    var player = roster[playerUuid]
    if (player) {
        playAction(player, action)
    }
}

function killPlayer(playerUuid) {
    Object(_websocket__WEBPACK_IMPORTED_MODULE_5__["sendMessage"])({
        player: playerUuid,
        damage: 100
    })
}



/***/ }),

/***/ "./src/renderer.js":
/*!*************************!*\
  !*** ./src/renderer.js ***!
  \*************************/
/*! exports provided: renderer */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "renderer", function() { return renderer; });
/* harmony import */ var three__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! three */ "./node_modules/three/build/three.module.js");
 

// make antialias a setting eventually
var renderer = new three__WEBPACK_IMPORTED_MODULE_0__["WebGLRenderer"]({ antialias: true });
renderer.setClearColor("#e5e5e5");
renderer.setPixelRatio( window.devicePixelRatio );
renderer.setSize( window.innerWidth, window.innerHeight);
renderer.gammaOutput = true;
renderer.gammaFactor = 2.2;



/***/ }),

/***/ "./src/scene.js":
/*!**********************!*\
  !*** ./src/scene.js ***!
  \**********************/
/*! exports provided: scene, collidableEnvironment */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "scene", function() { return scene; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "collidableEnvironment", function() { return collidableEnvironment; });
/* harmony import */ var three__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! three */ "./node_modules/three/build/three.module.js");
/* harmony import */ var _loader__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./loader */ "./src/loader.js");
/* harmony import */ var _models_env_glb__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../models/env.glb */ "./models/env.glb");
/* harmony import */ var _models_env_glb__WEBPACK_IMPORTED_MODULE_2___default = /*#__PURE__*/__webpack_require__.n(_models_env_glb__WEBPACK_IMPORTED_MODULE_2__);





var scene = new three__WEBPACK_IMPORTED_MODULE_0__["Scene"]();
var collidableEnvironment = []

_loader__WEBPACK_IMPORTED_MODULE_1__["loader"].load(_models_env_glb__WEBPACK_IMPORTED_MODULE_2___default.a, function (gltf) {
    var mesh = gltf.scene;
    mesh.position.y -=10
    scene.add(mesh);
    collidableEnvironment.push(mesh)
});

scene.add(getHemisphereLight());
scene.add(getDirectionalLight());

function getHemisphereLight() {
    var hemiLight = new three__WEBPACK_IMPORTED_MODULE_0__["HemisphereLight"]( 0xffffff, 0xffffff, 0.6 );
    hemiLight.color.setHSL( 0.6, 1, 0.6 );
    hemiLight.groundColor.setHSL( 0.095, 1, 0.75 );
    hemiLight.position.set( 0, 50, 0 );
    hemiLight.visible = true;
    return hemiLight;
}

function getDirectionalLight() {
    var dirLight = new three__WEBPACK_IMPORTED_MODULE_0__["DirectionalLight"]( 0xffffff, 1 );
    dirLight.color.setHSL( 0.1, 1, 0.95 );
    dirLight.position.set( - 1, 1.75, 1 );
    dirLight.position.multiplyScalar( 30 );
    dirLight.castShadow = true;
    dirLight.shadow.mapSize.width = 2048;
    dirLight.shadow.mapSize.height = 2048;
    var d = 50;
    dirLight.shadow.camera.left = - d;
    dirLight.shadow.camera.right = d;
    dirLight.shadow.camera.top = d;
    dirLight.shadow.camera.bottom = - d;
    dirLight.shadow.camera.far = 3500;
    dirLight.shadow.bias = - 0.0001;
    dirLight.visible = true;
    return dirLight;
}



/***/ }),

/***/ "./src/utils.js":
/*!**********************!*\
  !*** ./src/utils.js ***!
  \**********************/
/*! exports provided: uuid */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "uuid", function() { return uuid; });
function uuid() {
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
        var r = Math.random() * 16 | 0, v = c == 'x' ? r : (r & 0x3 | 0x8);
        return v.toString(16);
    });
}

/***/ }),

/***/ "./src/websocket.js":
/*!**************************!*\
  !*** ./src/websocket.js ***!
  \**************************/
/*! exports provided: ws, sendMessage */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "ws", function() { return ws; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "sendMessage", function() { return sendMessage; });
/* harmony import */ var three__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! three */ "./node_modules/three/build/three.module.js");
/* harmony import */ var _players__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./players */ "./src/players.js");
/* harmony import */ var _player1__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./player1 */ "./src/player1.js");
/* harmony import */ var _scene__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./scene */ "./src/scene.js");
/* harmony import */ var _arrow__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ./arrow */ "./src/arrow.js");







// var url = 'ws://localhost:18181'
var url = 'ws://ec2-18-191-136-250.us-east-2.compute.amazonaws.com:18181'
const ws = new WebSocket(url);

ws.onopen = function open() {
    sendMessage({message: "sup fucker"})
};

ws.onmessage = function onMessage(message) {
    var message = JSON.parse(message.data)
    if (message.players) {
        _players__WEBPACK_IMPORTED_MODULE_1__["players"].init(message.players);
    }
    if (message.player) {
        var player = message.player;
        if (player == _player1__WEBPACK_IMPORTED_MODULE_2__["playerUuid"]) {
            if (message.damage) {
                _player1__WEBPACK_IMPORTED_MODULE_2__["player1"].takeDamage(message.damage)
            }
        } else {
            if (!_players__WEBPACK_IMPORTED_MODULE_1__["players"].get(player)) {
                _players__WEBPACK_IMPORTED_MODULE_1__["players"].add(player, new three__WEBPACK_IMPORTED_MODULE_0__["Vector3"](message.x, message.y, message.z))
            } else if (message.status==='disconnected') {
                // player disconnected, remove
                _scene__WEBPACK_IMPORTED_MODULE_3__["scene"].remove(_players__WEBPACK_IMPORTED_MODULE_1__["players"].get(player).scene)
                delete _players__WEBPACK_IMPORTED_MODULE_1__["players"].get(player)
            } else if (_players__WEBPACK_IMPORTED_MODULE_1__["players"].get(player).scene && message.x && message.y && message.z && message.rotation && message.action) {
                _players__WEBPACK_IMPORTED_MODULE_1__["players"].move(player, new three__WEBPACK_IMPORTED_MODULE_0__["Vector3"](message.x, message.y, message.z), message.rotation, message.action)
                _players__WEBPACK_IMPORTED_MODULE_1__["players"].get(player).state = 'moving'
            } else if (message.action) {
                Object(_players__WEBPACK_IMPORTED_MODULE_1__["playerAction"])(player, message.action)
            }
        }
    } else if (message.arrow) {
        Object(_arrow__WEBPACK_IMPORTED_MODULE_4__["addOtherPlayerArrow"])(message.arrow)
    }
}

function sendMessage(message) {
    ws.send(JSON.stringify(message))
}



/***/ })

}]);
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly8vLi9tb2RlbHMvYmVuamkuZ2xiIiwid2VicGFjazovLy8uL21vZGVscy9lbnYuZ2xiIiwid2VicGFjazovLy8uL3NyYy9hcmNoZXIuanMiLCJ3ZWJwYWNrOi8vLy4vc3JjL2Fycm93LmpzIiwid2VicGFjazovLy8uL3NyYy9jYW1lcmEuanMiLCJ3ZWJwYWNrOi8vLy4vc3JjL2dhbWUuanMiLCJ3ZWJwYWNrOi8vLy4vc3JjL2xvYWRlci5qcyIsIndlYnBhY2s6Ly8vLi9zcmMvcGxheWVyMS5qcyIsIndlYnBhY2s6Ly8vLi9zcmMvcGxheWVycy5qcyIsIndlYnBhY2s6Ly8vLi9zcmMvcmVuZGVyZXIuanMiLCJ3ZWJwYWNrOi8vLy4vc3JjL3NjZW5lLmpzIiwid2VicGFjazovLy8uL3NyYy91dGlscy5qcyIsIndlYnBhY2s6Ly8vLi9zcmMvd2Vic29ja2V0LmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7Ozs7OztBQUFBLGlCQUFpQixxQkFBdUIsMEM7Ozs7Ozs7Ozs7O0FDQXhDLGlCQUFpQixxQkFBdUIsMEM7Ozs7Ozs7Ozs7OztBQ0F4QztBQUFBO0FBQUE7QUFBOEI7O0FBRTlCO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsS0FBSztBQUNMO0FBQ0E7O0FBRU87QUFDUDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0Esc0ZBQXNGLDhDQUFRO0FBQzlGLHlGQUF5Riw4Q0FBUTtBQUNqRyx1RkFBdUYsOENBQVE7QUFDL0YsdUZBQXVGLDhDQUFRO0FBQy9GO0FBQ0E7QUFDQSxDOzs7Ozs7Ozs7Ozs7QUN6QkE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBOEU7O0FBRTFCO0FBQ0E7QUFDbkI7QUFDRjtBQUNTOztBQUV4QztBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBLHVCQUF1QixpREFBVztBQUNsQyx1QkFBdUIsdURBQWlCLEdBQUcsZ0JBQWdCO0FBQzNELG9CQUFvQiwwQ0FB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bW9kdWxlLmV4cG9ydHMgPSBfX3dlYnBhY2tfcHVibGljX3BhdGhfXyArIFwiZWMwZjI2ZjI0ZWQ5YjIwNGU2ODNhYzAzYTBiZTYzZjkuZ2xiXCI7IiwibW9kdWxlLmV4cG9ydHMgPSBfX3dlYnBhY2tfcHVibGljX3BhdGhfXyArIFwiYmFhZTA0MTc3OWQ4OGUzZjQ0ZTdiNzNkODNkNGI3ODIuZ2xiXCI7IiwiaW1wb3J0IHtMb29wT25jZX0gZnJvbSAndGhyZWUnXG5cbmZ1bmN0aW9uIGdldEFuaW1hdGlvbihhbmltYXRpb25zLCBuYW1lKXtcbiAgICB2YXIgcmVzdWx0O1xuICAgIGFuaW1hdGlvbnMuZm9yRWFjaCgoYW5pbWF0aW9uKSA9PiB7XG4gICAgICAgIGlmIChhbmltYXRpb24ubmFtZT09PW5hbWUpIHtcbiAgICAgICAgICAgIHJlc3VsdCA9IGFuaW1hdGlvblxuICAgICAgICAgICAgcmV0dXJuXG4gICAgICAgIH1cbiAgICB9KVxuICAgIHJldHVybiByZXN1bHRcbn1cblxuZXhwb3J0IGZ1bmN0aW9uIGluaXRBY3Rpb25zKG1peGVyLCBhcmNoZXIpIHtcbiAgICBhcmNoZXIubWl4ZXIgPSBtaXhlclxuICAgIGFyY2hlci5hY3Rpb25zID0ge1xuICAgICAgICBpZGxlOiBtaXhlci5jbGlwQWN0aW9uKGdldEFuaW1hdGlvbihhcmNoZXIuYW5pbWF0aW9ucywgXCJJZGxlXCIpKSxcbiAgICAgICAgcnVubmluZzogbWl4ZXIuY2xpcEFjdGlvbihnZXRBbmltYXRpb24oYXJjaGVyLmFuaW1hdGlvbnMsIFwiUnVubmluZzJcIikpLFxuICAgICAgICBydW5XaXRoQm93OiBtaXhlci5jbGlwQWN0aW9uKGdldEFuaW1hdGlvbihhcmNoZXIuYW5pbWF0aW9ucywgXCJSdW4gd2l0aCBib3dcIikpLFxuICAgICAgICBqdW1waW5nOiBtaXhlci5jbGlwQWN0aW9uKGdldEFuaW1hdGlvbihhcmNoZXIuYW5pbWF0aW9ucywgXCJKdW1waW5nXCIpKS5zZXRMb29wKExvb3BPbmNlKSxcbiAgICAgICAgZXF1aXBCb3c6IG1peGVyLmNsaXBBY3Rpb24oZ2V0QW5pbWF0aW9uKGFyY2hlci5hbmltYXRpb25zLCBcIkVxdWlwIEJvd1wiKSkuc2V0TG9vcChMb29wT25jZSksXG4gICAgICAgIGRyYXdCb3c6IG1peGVyLmNsaXBBY3Rpb24oZ2V0QW5pbWF0aW9uKGFyY2hlci5hbmltYXRpb25zLCBcIkRyYXcgYm93XCIpKS5zZXRMb29wKExvb3BPbmNlKSxcbiAgICAgICAgZmlyZUJvdzogbWl4ZXIuY2xpcEFjdGlvbihnZXRBbmltYXRpb24oYXJjaGVyLmFuaW1hdGlvbnMsIFwiRmlyZSBib3dcIikpLnNldExvb3AoTG9vcE9uY2UpXG4gICAgfVxuICAgIGFyY2hlci5hY3Rpb25zLmRyYXdCb3cuY2xhbXBXaGVuRmluaXNoZWQgPSB0cnVlXG59IiwiaW1wb3J0IHtCb3hHZW9tZXRyeSwgTWVzaEJhc2ljTWF0ZXJpYWwsIE1lc2gsIFZlY3RvcjMsIFJheWNhc3Rlcn0gZnJvbSAndGhyZWUnXG5cbmltcG9ydCB7c2NlbmUsIGNvbGxpZGFibGVFbnZpcm9ubWVudH0gZnJvbSAnLi9zY2VuZSdcbmltcG9ydCB7cGxheWVySGl0Qm94ZXMsIGtpbGxQbGF5ZXJ9IGZyb20gJy4vcGxheWVycydcbmltcG9ydCB7cGxheWVyMX0gZnJvbSAnLi9wbGF5ZXIxJ1xuaW1wb3J0IHtjYW1lcmF9IGZyb20gJy4vY2FtZXJhJ1xuaW1wb3J0IHtzZW5kTWVzc2FnZX0gZnJvbSAnLi93ZWJzb2NrZXQnO1xuXG52YXIgcGxheWVyMUFycm93cyA9IFtdIC8vIHRoZXNlIGFyZSBhcnJvd3MgdGhhdCB3ZXJlIHNob3QgYnkgcGxheWVyMVxudmFyIG90aGVyUGxheWVyQXJyb3dzID0gW10gLy8gdGhlc2UgYXJlIGFycm93cyB0aGF0IHdlcmUgc2hvdCBieSBvdGhlciBwbGF5ZXJzXG52YXIgYXJyb3dXaWR0aCA9IDAuMDZcbnZhciBhcnJvd0xlbmd0aCA9IDAuNzVcblxuZnVuY3Rpb24gY3JlYXRlQXJyb3cob3JpZ2luLCByb3RhdGlvbil7XG4gICAgdmFyIGdlb21ldHJ5ID0gbmV3IEJveEdlb21ldHJ5KGFycm93V2lkdGgsIGFycm93V2lkdGgsIGFycm93TGVuZ3RoKTtcbiAgICB2YXIgbWF0ZXJpYWwgPSBuZXcgTWVzaEJhc2ljTWF0ZXJpYWwoIHtjb2xvcjogMHgwMGZmMDB9ICk7XG4gICAgdmFyIGFycm93ID0gbmV3IE1lc2goIGdlb21ldHJ5LCBtYXRlcmlhbCApO1xuICAgIFxuICAgIGFycm93Lm9yaWdpbiA9IG9yaWdpblxuICAgIGFycm93LnBvc2l0aW9uLmNvcHkob3JpZ2luKVxuICAgIGFycm93LnJvdGF0aW9uLmNvcHkocm90YXRpb24pXG4gICAgc2NlbmUuYWRkKGFycm93KTtcblxuICAgIHJldHVybiBhcnJvd1xufVxuXG5mdW5jdGlvbiBzaG9vdEFycm93KCl7XG4gICAgdmFyIG9yaWdpbiA9IHBsYXllcjEuc2NlbmUucG9zaXRpb24uY2xvbmUoKS5hZGQobmV3IFZlY3RvcjMoMCwgMS41LCAwKSk7XG4gICAgdmFyIHJvdGF0aW9uID0gY2FtZXJhLnJvdGF0aW9uIC8vIHRoaXMgbmVlZHMgdG8gYmUgY2hhbmdlZFxuICAgIHZhciBhcnJvdyA9IGNyZWF0ZUFycm93KG9yaWdpbiwgcm90YXRpb24pO1xuXG4gICAgLy8gaWYgdGhlIHJldGljbGUgKGNlbnRlciBvZiBzY3JlZW4pIGlzIHBvaW50ZWQgYXQgc29tZXRoaW5nLCBhaW0gYXJyb3dzIHRoZXJlISBvdGhlcndpc2UgZXN0aW1hdGUgd2hlcmUgdGhlIHBsYXllciBpcyBhaW1pbmcgXG4gICAgdmFyIHJheWNhc3RlciA9IG5ldyBSYXljYXN0ZXIoKVxuICAgIHJheWNhc3Rlci5zZXRGcm9tQ2FtZXJhKHt4OiAwLCB5OiAwfSwgY2FtZXJhKSAvLyB0aGUge3g6IDAsIHk6IDB9IG1lYW5zIHRoZSBjZW50ZXIgb2YgdGhlIHNjcmVlbjsgdGhlcmUgbWF5IGV2ZW50dWFsbHkgYmUgaXNzdWVzIHdpdGggdGhpcyBub3QgYWN0dWFsbHkgbGluaW5nIHVwIHdpdGggdGhlIGh0bWwgcmV0aWNsZVxuICAgIHZhciBjb2xsaXNpb25zID0gcmF5Y2FzdGVyLmludGVyc2VjdE9iamVjdHMoY29sbGlkYWJsZUVudmlyb25tZW50LmNvbmNhdChwbGF5ZXJIaXRCb3hlcyksIHRydWUpXG4gICAgdmFyIGRpcmVjdGlvbjtcbiAgICBpZiAoY29sbGlzaW9ucy5sZW5ndGggPiAwKSB7XG4gICAgICAgIGRpcmVjdGlvbiA9IGNvbGxpc2lvbnNbMF0ucG9pbnQuc3ViKG9yaWdpbilcbiAgICB9IGVsc2Uge1xuICAgICAgICBkaXJlY3Rpb24gPSBuZXcgVmVjdG9yMygpXG4gICAgICAgIGNhbWVyYS5nZXRXb3JsZERpcmVjdGlvbihkaXJlY3Rpb24pXG4gICAgfVxuXG4gICAgYXJyb3cudmVsb2NpdHkgPSBkaXJlY3Rpb24ubm9ybWFsaXplKCkubXVsdGlwbHlTY2FsYXIoNjApXG4gICAgcGxheWVyMUFycm93cy5wdXNoKGFycm93KVxuXG4gICAgc2VuZE1lc3NhZ2Uoe1xuICAgICAgICBhcnJvdzoge1xuICAgICAgICAgICAgb3JpZ2luOiBhcnJvdy5wb3NpdGlvbixcbiAgICAgICAgICAgIHJvdGF0aW9uOiBhcnJvdy5yb3RhdGlvbixcbiAgICAgICAgICAgIHZlbG9jaXR5OiBhcnJvdy52ZWxvY2l0eSxcbiAgICAgICAgICAgIHRpbWVPZlNob290OiBEYXRlLm5vdygpXG4gICAgICAgIH1cbiAgICB9KVxufVxuXG5mdW5jdGlvbiBhZGRPdGhlclBsYXllckFycm93KG5ld0Fycm93KSB7XG4gICAgdmFyIGFycm93ID0gY3JlYXRlQXJyb3cobmV3QXJyb3cub3JpZ2luLCBuZXdBcnJvdy5yb3RhdGlvbilcbiAgICBhcnJvdy52ZWxvY2l0eSA9IG5ldyBWZWN0b3IzKG5ld0Fycm93LnZlbG9jaXR5LngsIG5ld0Fycm93LnZlbG9jaXR5LnksIG5ld0Fycm93LnZlbG9jaXR5LnopXG4gICAgb3RoZXJQbGF5ZXJBcnJvd3MucHVzaChhcnJvdylcbiAgICBtb3ZlQXJyb3coYXJyb3csIChEYXRlLm5vdygpLW5ld0Fycm93LnRpbWVPZlNob290KS8xMDAwKVxufVxuXG5mdW5jdGlvbiBtb3ZlQXJyb3coYXJyb3csIGRlbHRhKSB7XG4gICAgYXJyb3cudmVsb2NpdHkueSAtPSBkZWx0YSo5XG4gICAgYXJyb3cucG9zaXRpb24uYWRkKGFycm93LnZlbG9jaXR5LmNsb25lKCkubXVsdGlwbHlTY2FsYXIoZGVsdGEpKVxufVxuXG5mdW5jdGlvbiBhbmltYXRlQXJyb3dzKGRlbHRhKSB7XG4gICAgcGxheWVyMUFycm93cy5mb3JFYWNoKChhcnJvdykgPT4ge1xuICAgICAgICBpZighYXJyb3cuc3RvcHBlZCl7XG4gICAgICAgICAgICBtb3ZlQXJyb3coYXJyb3csIGRlbHRhKVxuICAgICAgICAgICAgLy8gZGV0ZWN0IGFycm93IGNvbGxpc2lvbnNcbiAgICAgICAgICAgIHZhciBkaXJlY3Rpb24gPSBuZXcgVmVjdG9yMygwLDAsMSlcbiAgICAgICAgICAgIGRpcmVjdGlvbi5hcHBseUV1bGVyKGFycm93LnJvdGF0aW9uKS5ub3JtYWxpemUoKVxuICAgICAgICAgICAgdmFyIGNvbGxpc2lvblRyYWlsID0gYXJyb3cucG9zaXRpb24uY2xvbmUoKS5zdWIoYXJyb3cub3JpZ2luKS5sZW5ndGgoKS8yIC8vIHRoaXMgaXMgdGhlIGxlbmd0aCBvZiB0aGUgcmF5IHRoYXQgd2lsbCBiZSB1c2VkIHRvIGRldGVjdCBjb2xsaXNpb25zXG4gICAgICAgICAgICAvLyByaWdodCBub3cgaXQgaXMgdGhlIGRpc3RhbmNlIGZyb20gdGhlIGFycm93IHRvIHRoZSBwb2ludCB3aGVyZSB0aGUgYXJyb3cgd2FzIGZpcmVkLCBkaXZpZGVkIGJ5IDJcbiAgICAgICAgICAgIC8vIGRpdmlkaW5nIGl0IGJ5IDIgaXMgcmVhbGx5IGp1c3QgYSBoYWNrLiBpZiB5b3UgZG9uJ3QgZGl2aWRlIGl0IGJ5IDIsIHRoZSByYXkgd291bGQgY29sbGlkZSB3aXRoIHRoZSBncm91bmQgYXQgdGhlIHBsYXllcnMgZmVldCB3aGVuIHRoZSBhcnJvdyBpcyBzaG90IGludG8gdGhlIGFpciBiZWNhdXNlIHRoZSBhcnJvdyB3YXMgZmFsbGluZyBzbGlnaHRseSBkdWUgdG8gZ3Jhdml0eVxuICAgICAgICAgICAgdmFyIHJheSA9IG5ldyBSYXljYXN0ZXIoYXJyb3cucG9zaXRpb24sIGRpcmVjdGlvbiwgMCwgY29sbGlzaW9uVHJhaWwpXG4gICAgICAgICAgICAvLyBkZXRlY3QgY29sbGlzaW9ucyB3aXRoIG90aGVyIHBsYXllcnNcbiAgICAgICAgICAgIHZhciBjb2xsaXNpb25zID0gcmF5LmludGVyc2VjdE9iamVjdHMocGxheWVySGl0Qm94ZXMpXG4gICAgICAgICAgICBpZiAoY29sbGlzaW9ucy5sZW5ndGggPiAwKSB7XG4gICAgICAgICAgICAgICAgdmFyIGNvbGxpc2lvbiA9IGNvbGxpc2lvbnMucG9wKClcbiAgICAgICAgICAgICAgICBhcnJvdy5wb3NpdGlvbi5jb3B5KGNvbGxpc2lvbi5wb2ludClcbiAgICAgICAgICAgICAgICBhcnJvdy5zdG9wcGVkID0gdHJ1ZVxuICAgICAgICAgICAgICAgIGtpbGxQbGF5ZXIoY29sbGlzaW9uLm9iamVjdC5wbGF5ZXJVdWlkKVxuICAgICAgICAgICAgfVxuICAgICAgICAgICAgLy8gZGV0ZWN0IGNvbGxpc2lvbnMgd2l0aCB0aGUgZW52aXJvbm1lbnRcbiAgICAgICAgICAgIGNvbGxpc2lvbnMgPSByYXkuaW50ZXJzZWN0T2JqZWN0cyhjb2xsaWRhYmxlRW52aXJvbm1lbnQsIHRydWUpXG4gICAgICAgICAgICBpZiAoY29sbGlzaW9ucy5sZW5ndGggPiAwKSB7XG4gICAgICAgICAgICAgICAgYXJyb3cucG9zaXRpb24uY29weShjb2xsaXNpb25zLnBvcCgpLnBvaW50KVxuICAgICAgICAgICAgICAgIGFycm93LnN0b3BwZWQgPSB0cnVlXG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICB9KVxuICAgIG90aGVyUGxheWVyQXJyb3dzLmZvckVhY2goKGFycm93KSA9PiB7XG4gICAgICAgIG1vdmVBcnJvdyhhcnJvdywgZGVsdGEpXG4gICAgfSlcbn1cblxuZXhwb3J0IHtzaG9vdEFycm93LCBhbmltYXRlQXJyb3dzLCBhZGRPdGhlclBsYXllckFycm93fSIsImltcG9ydCB7UGVyc3BlY3RpdmVDYW1lcmEsIFZlY3RvcjMsIFJheWNhc3Rlcn0gZnJvbSAndGhyZWUnXG5pbXBvcnQge2NvbGxpZGFibGVFbnZpcm9ubWVudH0gZnJvbSAnLi9zY2VuZSdcbmltcG9ydCB7cGxheWVyMX0gZnJvbSAnLi9wbGF5ZXIxJ1xuXG52YXIgZGlzdGFuY2UgPSAzLjU7XG5cbnZhciBjYW1lcmEgPSBuZXcgUGVyc3BlY3RpdmVDYW1lcmEoIDc1LCB3aW5kb3cuaW5uZXJXaWR0aCAvIHdpbmRvdy5pbm5lckhlaWdodCwgMC4xLCAxMDAwICk7XG5jYW1lcmEucG9zaXRpb24ueiA9IDU7XG52YXIgY2FtZXJhVGFyZ2V0ID0gbmV3IFZlY3RvcjMoIDAsIDEsIDAgKTtcbnZhciB0aGV0YSA9IDBcbnZhciBwaGkgPSAwXG5cbmNhbWVyYS5uZXh0UG9zaXRpb24gPSBmdW5jdGlvbihkaXN0KSB7XG4gICAgaWYgKHBsYXllcjEhPW51bGwpIHtcbiAgICAgICAgdmFyIG5leHRQb3MgPSBuZXcgVmVjdG9yMygpO1xuICAgICAgICBuZXh0UG9zLnggPSBjYW1lcmFUYXJnZXQueCArIGRpc3QgKiBNYXRoLnNpbih0aGV0YSAqIE1hdGguUEkgLyAzNjApICogTWF0aC5jb3MocGhpICogTWF0aC5QSSAvIDM2MCk7XG4gICAgICAgIG5leHRQb3MueSA9IGNhbWVyYVRhcmdldC55ICsgZGlzdCAqIE1hdGguc2luKHBoaSAqIE1hdGguUEkgLyAzNjApO1xuICAgICAgICBuZXh0UG9zLnogPSBjYW1lcmFUYXJnZXQueiArIGRpc3QgKiBNYXRoLmNvcyh0aGV0YSAqIE1hdGguUEkgLyAzNjApICogTWF0aC5jb3MocGhpICogTWF0aC5QSSAvIDM2MCk7XG4gICAgICAgIHJldHVybiBuZXh0UG9zXG4gICAgfVxufVxuXG5jYW1lcmEuc2V0UG9zaXRpb24gPSBmdW5jdGlvbihuZXh0UG9zKSB7XG4gICAgY2FtZXJhLnBvc2l0aW9uLmNvcHkobmV4dFBvcylcbn1cblxuY2FtZXJhLnVwZGF0ZUNhbWVyYSA9IGZ1bmN0aW9uKCkge1xuICAgIGlmIChwbGF5ZXIxIT1udWxsKSB7XG4gICAgICAgIHZhciB2ID0gcGxheWVyMS5zY2VuZS5wb3NpdGlvbi5jbG9uZSgpLnN1YihjYW1lcmEucG9zaXRpb24uY2xvbmUoKSlcbiAgICAgICAgdmFyIHYyID0gbmV3IFZlY3RvcjMoLXYueiwgMCwgdi54KS5ub3JtYWxpemUoKVxuICAgICAgICBjYW1lcmFUYXJnZXQuY29weShwbGF5ZXIxLnNjZW5lLnBvc2l0aW9uLmNsb25lKCkuYWRkKHYyKSkuc2V0WShwbGF5ZXIxLnNjZW5lLnBvc2l0aW9uLnkrMSlcbiAgICAgICAgXG4gICAgICAgIHZhciBuZXh0UG9zID0gY2FtZXJhLm5leHRQb3NpdGlvbihkaXN0YW5jZSlcblxuICAgICAgICAvLyB0aGlzIGVuc3VyZXMgdGhlIGNhbWVyYSBkb2Vzbid0IGdvIGJlaGluZCBhbnkgbWVzaGVzXG4gICAgICAgIHZhciByYXkgPSBuZXcgUmF5Y2FzdGVyKGNhbWVyYVRhcmdldCwgbmV4dFBvcy5jbG9uZSgpLnN1YihjYW1lcmFUYXJnZXQpLm5vcm1hbGl6ZSgpLCAwLCA1KTtcbiAgICAgICAgdmFyIGNvbGxpc2lvbnMgPSByYXkuaW50ZXJzZWN0T2JqZWN0cyhjb2xsaWRhYmxlRW52aXJvbm1lbnQsIHRydWUpO1xuICAgICAgICBpZihjb2xsaXNpb25zLmxlbmd0aD4wKXtcbiAgICAgICAgICAgIC8vIHRoaXMgaXMganVzdCBzb21lIHZvb2Rvb1xuICAgICAgICAgICAgbmV4dFBvcyA9IGNvbGxpc2lvbnNbMF0ucG9pbnQuY2xvbmUoKS5zdWIobmV4dFBvcy5jbG9uZSgpLnN1Yihjb2xsaXNpb25zWzBdLnBvaW50KS5ub3JtYWxpemUoKS5tdWx0aXBseVNjYWxhcigwLjEpKVxuICAgICAgICAgICAgLy8gamssIEkgdGFrZSB0aGUgZGlmZmVyZW5jZSBiZXR3ZWVuIHRoZSBuZXh0UG9zIGFuZCB0aGUgcG9pbnQgb2YgY29sbGlzaW9uLCBub3JtYWxpemUgaXQsIG11bHRpcGx5IGl0IGJ5IDAuMSwgYW5kIGFkZCB0aGF0IHRvIHRoZSBjb2xsaXNpb24gcG9pbnQgdG8gZ2V0IHRoZSBuZXcgbmV4dFBvc1xuICAgICAgICAgICAgLy8gcmVhbGx5IGFsbCBpdCBkb2VzIGlzIG1ha2Ugc3VyZSB0aGUgY2FtZXJhIGlzIHNsaWdodGx5IGFib3ZlIHRoZSBzdXJmYWNlIHRoYXQgaXQncyBjb2xsaWRpbmcgd2l0aCAoaW5zdGVhZCBvZiBhdCB0aGUgc3VyZmFjZSlcbiAgICAgICAgfVxuICAgICAgICBjYW1lcmEuc2V0UG9zaXRpb24obmV4dFBvcylcbiAgICB9XG4gICAgY2FtZXJhLmxvb2tBdChjYW1lcmFUYXJnZXQpO1xuICAgIGNhbWVyYS51cGRhdGVNYXRyaXgoKTtcbn1cblxuY2FtZXJhLm1vdmVDYW1lcmEgPSBmdW5jdGlvbihtb3ZlbWVudFgsIG1vdmVtZW50WSkge1xuICAgIHRoZXRhIC09IG1vdmVtZW50WCAqIDAuMlxuICAgIHZhciB4ID0gcGhpICsgbW92ZW1lbnRZICogMC4yXG4gICAgLy8gdGhpcyBzaW1wbHkgZW5zdXJlcyB0aGUgY2FtZXJhIGNhbm5vdCBnbyBvdmVyIHRoZSB0b3AvYm90dG9tXG4gICAgLy8gSSBoYXZlIGl0IHNldCAxMCAxMzUgYW5kIDgwIGJlY2F1c2Ugb3RoZXJ3aXNlIHRoZSBjYW1lcmEgZ2V0cyBhbGwgZnVja3kgYnV0IGl0J3Mgbm90IHRoZSBiZXN0IHNvbHV0aW9uXG4gICAgaWYgKDEzNSA+PSB4ICYmIHggPj0gLTgwKSB7XG4gICAgICAgIHBoaSA9IHhcbiAgICB9XG4gICAgY2FtZXJhLnVwZGF0ZUNhbWVyYSgpO1xufVxuXG5leHBvcnQgeyBjYW1lcmEsIGNhbWVyYVRhcmdldCB9OyIsImltcG9ydCB7IENsb2NrIH0gZnJvbSAndGhyZWUnXG5cbmltcG9ydCB7IHNjZW5lIH0gZnJvbSAnLi9zY2VuZSdcbmltcG9ydCB7IHJlbmRlcmVyIH0gZnJvbSAnLi9yZW5kZXJlcidcbmltcG9ydCB7IGNhbWVyYSB9IGZyb20gJy4vY2FtZXJhJ1xuaW1wb3J0IHsgcGxheWVyMSwgbWl4ZXIgfSBmcm9tICcuL3BsYXllcjEnXG5pbXBvcnQgeyBhbmltYXRlQXJyb3dzIH0gZnJvbSAnLi9hcnJvdydcbmltcG9ydCB7IHBsYXllcnMsIGFuaW1hdGVQbGF5ZXJzIH0gZnJvbSAnLi9wbGF5ZXJzJztcblxudmFyIGNsb2NrID0gbmV3IENsb2NrKClcbmRvY3VtZW50LmJvZHkuYXBwZW5kQ2hpbGQoIHJlbmRlcmVyLmRvbUVsZW1lbnQgKVxudmFyIGlucHV0ID0ge1xuICAgIGtleWJvYXJkOiB7XG4gICAgICAgIGZvcndhcmQ6IGZhbHNlLFxuICAgICAgICBiYWNrd2FyZDogZmFsc2UsXG4gICAgICAgIGxlZnQ6IGZhbHNlLFxuICAgICAgICByaWdodDogZmFsc2UsXG4gICAgICAgIHNwYWNlOiBmYWxzZVxuICAgIH0sXG4gICAgdG91Y2g6IHtcbiAgICAgICAgeDogMCxcbiAgICAgICAgeTogMFxuICAgIH1cbn1cbnZhciBzdGF0ZSA9IFwicmVhZHlcIlxudmFyIHVzaW5nVG91Y2hDb250cm9scyA9IGZhbHNlO1xudmFyIGNhbWVyYVRvdWNoID0ge2lkOiBudWxsLCB4OiBudWxsLCB5OiBudWxsLCBzaG9vdDogZmFsc2V9XG52YXIgbW92ZW1lbnRUb3VjaCA9IHtpZDogbnVsbCwgeDogbnVsbCwgeTogbnVsbH1cblxuZnVuY3Rpb24gYW5pbWF0ZSgpIHtcbiAgICByZXF1ZXN0QW5pbWF0aW9uRnJhbWUoIGFuaW1hdGUgKTtcbiAgICB2YXIgZGVsdGEgPSBjbG9jay5nZXREZWx0YSgpO1xuICAgIGFuaW1hdGVBcnJvd3MoZGVsdGEpO1xuICAgIGlmIChwbGF5ZXIxICYmIG1peGVyKSB7XG4gICAgICAgIHBsYXllcjEuYW5pbWF0ZShkZWx0YSwgaW5wdXQpO1xuICAgICAgICBtaXhlci51cGRhdGUoIGRlbHRhICk7XG4gICAgfVxuICAgIGlmIChPYmplY3Qua2V5cyhwbGF5ZXJzLmFsbCgpKS5sZW5ndGgpIHtcbiAgICAgICAgYW5pbWF0ZVBsYXllcnMoZGVsdGEpXG4gICAgfVxuICAgIHJlbmRlcmVyLnJlbmRlciggc2NlbmUsIGNhbWVyYSApO1xufVxuXG5cbmZ1bmN0aW9uIHRvZ2dsZUtleShldmVudCwgdG9nZ2xlKSB7XG4gICAgc3dpdGNoKGV2ZW50LmtleSkge1xuICAgICAgICBjYXNlICd3JzpcbiAgICAgICAgICAgIGlucHV0LmtleWJvYXJkLmZvcndhcmQgPSB0b2dnbGU7XG4gICAgICAgICAgICBicmVhaztcbiAgICAgICAgY2FzZSAnYSc6XG4gICAgICAgICAgICBpbnB1dC5rZXlib2FyZC5sZWZ0ID0gdG9nZ2xlO1xuICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgIGNhc2UgJ3MnOlxuICAgICAgICAgICAgaW5wdXQua2V5Ym9hcmQuYmFja3dhcmQgPSB0b2dnbGU7XG4gICAgICAgICAgICBicmVhaztcbiAgICAgICAgY2FzZSAnZCc6XG4gICAgICAgICAgICBpbnB1dC5rZXlib2FyZC5yaWdodCA9IHRvZ2dsZTtcbiAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICBjYXNlICcgJzpcbiAgICAgICAgICAgIGlucHV0LmtleWJvYXJkLnNwYWNlID0gdG9nZ2xlO1xuICAgICAgICAgICAgYnJlYWs7XG4gICAgfVxufVxuZnVuY3Rpb24gb25LZXlEb3duKGV2ZW50KSB7XG4gICAgdG9nZ2xlS2V5KGV2ZW50LCB0cnVlKTtcbn1cbmZ1bmN0aW9uIG9uS2V5VXAoZXZlbnQpIHtcbiAgICB0b2dnbGVLZXkoZXZlbnQsIGZhbHNlKTtcbn1cblxuZnVuY3Rpb24gb25Nb3VzZURvd24oKSB7XG4gICAgaWYgKHN0YXRlID09PSBcInBsYXlpbmdcIikge1xuICAgICAgICBwbGF5ZXIxLm9uTW91c2VEb3duKClcbiAgICB9XG59XG5mdW5jdGlvbiBvbk1vdXNlVXAoKSB7XG4gICAgaWYgKHN0YXRlID09PSBcInBsYXlpbmdcIikge1xuICAgICAgICBwbGF5ZXIxLm9uTW91c2VVcCgpXG4gICAgfVxufVxuXG5cbmZ1bmN0aW9uIG9uQ2xpY2soKSB7XG4gICAgaWYgKHN0YXRlICE9PSBcInBsYXlpbmdcIikge1xuICAgICAgICBkb2N1bWVudC5ib2R5LnJlcXVlc3RQb2ludGVyTG9jaygpO1xuICAgICAgICBzdGF0ZSA9IFwicGxheWluZ1wiXG4gICAgfVxufVxuXG5mdW5jdGlvbiBvblBvaW50ZXJMb2NrQ2hhbmdlKCkge1xuICAgIGlmICghZG9jdW1lbnQucG9pbnRlckxvY2tFbGVtZW50KSB7XG4gICAgICAgIHN0YXRlID0gXCJyZWFkeVwiXG4gICAgfVxufVxuXG5mdW5jdGlvbiB0b3VjaENvbnRyb2xzKGJvb2wpIHtcbiAgICBpZiAoYm9vbCE9dXNpbmdUb3VjaENvbnRyb2xzKSB7XG4gICAgICAgIGlmIChib29sKSB7XG4gICAgICAgICAgICBzaG9vdEJ1dHRvbi5zZXRBdHRyaWJ1dGUoXCJzdHlsZVwiLCBcImRpc3BsYXk6IGJsb2NrO1wiK3Nob290QnV0dG9uU3R5bGUpXG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICBzaG9vdEJ1dHRvbi5zZXRBdHRyaWJ1dGUoXCJzdHlsZVwiLCBcImRpc3BsYXk6IG5vbmU7XCIrc2hvb3RCdXR0b25TdHlsZSlcbiAgICAgICAgfVxuICAgICAgICB1c2luZ1RvdWNoQ29udHJvbHMgPSBib29sXG4gICAgfVxufVxuXG5mdW5jdGlvbiBoYW5kbGVUb3VjaChldmVudCkge1xuICAgIGV2ZW50LnByZXZlbnREZWZhdWx0KCk7XG4gICAgdG91Y2hDb250cm9scyh0cnVlKVxuICAgIHZhciBjYW1Ub3VjaCwgbW92ZVRvdWNoLCBuZXdUb3VjaFxuICAgIGZvciAodmFyIGk9MDsgaTxldmVudC50YXJnZXRUb3VjaGVzLmxlbmd0aDsgaSsrKSB7XG4gICAgICAgIGlmIChldmVudC50YXJnZXRUb3VjaGVzLml0ZW0oaSkuaWRlbnRpZmllciA9PSBjYW1lcmFUb3VjaC5pZCkge1xuICAgICAgICAgICAgY2FtVG91Y2ggPSBldmVudC50YXJnZXRUb3VjaGVzLml0ZW0oaSlcbiAgICAgICAgfSBlbHNlIGlmIChldmVudC50YXJnZXRUb3VjaGVzLml0ZW0oaSkuaWRlbnRpZmllciA9PSBtb3ZlbWVudFRvdWNoLmlkKSB7XG4gICAgICAgICAgICBtb3ZlVG91Y2ggPSBldmVudC50YXJnZXRUb3VjaGVzLml0ZW0oaSlcbiAgICAgICAgfSBlbHNlIGlmIChuZXdUb3VjaD09bnVsbCl7XG4gICAgICAgICAgICBuZXdUb3VjaCA9IGV2ZW50LnRhcmdldFRvdWNoZXMuaXRlbShpKVxuICAgICAgICB9XG4gICAgfVxuICAgIGlmIChjYW1Ub3VjaCkge1xuICAgICAgICBjYW1lcmEubW92ZUNhbWVyYSg0KihjYW1Ub3VjaC5wYWdlWC1jYW1lcmFUb3VjaC54KSwgNCooY2FtVG91Y2gucGFnZVktY2FtZXJhVG91Y2gueSkpXG4gICAgICAgIGNhbWVyYVRvdWNoLnggPSBjYW1Ub3VjaC5wYWdlWFxuICAgICAgICBjYW1lcmFUb3VjaC55ID0gY2FtVG91Y2gucGFnZVlcbiAgICB9IGVsc2UgaWYgKG5ld1RvdWNoKSB7XG4gICAgICAgIGlmIChuZXdUb3VjaC50YXJnZXQuaWQgPT09IFwic2hvb3RCdXR0b25cIikge1xuICAgICAgICAgICAgcGxheWVyMS5vbk1vdXNlRG93bigpXG4gICAgICAgICAgICBjYW1lcmFUb3VjaC5zaG9vdCA9IHRydWVcbiAgICAgICAgfVxuICAgICAgICBpZiAobmV3VG91Y2gucGFnZVggPiB3aW5kb3cuaW5uZXJXaWR0aC8yKSB7XG4gICAgICAgICAgICBjYW1lcmFUb3VjaC5pZCA9IG5ld1RvdWNoLmlkZW50aWZpZXJcbiAgICAgICAgICAgIGNhbWVyYVRvdWNoLnggPSBuZXdUb3VjaC5wYWdlWFxuICAgICAgICAgICAgY2FtZXJhVG91Y2gueSA9IG5ld1RvdWNoLnBhZ2VZXG4gICAgICAgIH1cbiAgICB9XG4gICAgaWYgKG1vdmVUb3VjaCkge1xuICAgICAgICBpbnB1dC50b3VjaC54ID0gbW92ZVRvdWNoLnBhZ2VYLW1vdmVtZW50VG91Y2gueFxuICAgICAgICBpbnB1dC50b3VjaC55ID0gLTEqKG1vdmVUb3VjaC5wYWdlWS1tb3ZlbWVudFRvdWNoLnkpIC8vIHRoaXMgbmVlZHMgdG8gYmUgbmVnYXRpdmUgZm9yIHNvbWUgcmVhc29uXG4gICAgfSBlbHNlIGlmIChuZXdUb3VjaCAmJiBuZXdUb3VjaC5wYWdlWCA8IHdpbmRvdy5pbm5lcldpZHRoLzIpIHtcbiAgICAgICAgbW92ZW1lbnRUb3VjaC5pZCA9IG5ld1RvdWNoLmlkZW50aWZpZXJcbiAgICAgICAgbW92ZW1lbnRUb3VjaC54ID0gbmV3VG91Y2gucGFnZVhcbiAgICAgICAgbW92ZW1lbnRUb3VjaC55ID0gbmV3VG91Y2gucGFnZVlcbiAgICB9XG59XG5cbmZ1bmN0aW9uIG9uVG91Y2hFbmQoZXZlbnQpIHtcbiAgICBpZiAoY2FtZXJhVG91Y2guaWQgPT0gZXZlbnQuY2hhbmdlZFRvdWNoZXNbMF0uaWRlbnRpZmllcikge1xuICAgICAgICBpZiAoY2FtZXJhVG91Y2guc2hvb3QpIHtcbiAgICAgICAgICAgIHBsYXllcjEub25Nb3VzZVVwKCk7XG4gICAgICAgIH1cbiAgICAgICAgY2FtZXJhVG91Y2guaWQgPSBudWxsXG4gICAgICAgIGNhbWVyYVRvdWNoLnNob290ID0gZmFsc2VcbiAgICB9IGVsc2UgaWYgKG1vdmVtZW50VG91Y2guaWQgPT0gZXZlbnQuY2hhbmdlZFRvdWNoZXNbMF0uaWRlbnRpZmllcikge1xuICAgICAgICBtb3ZlbWVudFRvdWNoLmlkID0gbnVsbFxuICAgICAgICBpbnB1dC50b3VjaCA9IHt4OjAsIHk6MH1cbiAgICB9XG59XG5cbmZ1bmN0aW9uIG9uTW91c2VNb3ZlKGV2ZW50KSB7XG4gICAgaWYgKGV2ZW50LnRhcmdldC5pZCAhPSBcInNob290QnV0dG9uXCIpIHsgLy8gSSdtIG5vdCBzdXJlIHdoeSB0aGlzIGlzIG5lZWRlZCBidXQgb3RoZXJ3aXNlIHRoZSBzaG9vdEJVdHRvbiBkaXNhcGVhcnNcbiAgICAgICAgdG91Y2hDb250cm9scyhmYWxzZSkgICAgICAgIFxuICAgIH1cbiAgICB2YXIgbW92ZW1lbnRYID0gZXZlbnQubW92ZW1lbnRYIHx8IGV2ZW50Lm1vek1vdmVtZW50WCB8fCBldmVudC53ZWJraXRNb3ZlbWVudFggfHwgMDtcbiAgICB2YXIgbW92ZW1lbnRZID0gZXZlbnQubW92ZW1lbnRZIHx8IGV2ZW50Lm1vek1vdmVtZW50WSB8fCBldmVudC53ZWJraXRNb3ZlbWVudFkgfHwgMDtcbiAgICBjYW1lcmEubW92ZUNhbWVyYShtb3ZlbWVudFgsIG1vdmVtZW50WSk7XG59XG5cbmZ1bmN0aW9uIHJlc2l6ZSgpIHtcbiAgICByZW5kZXJlci5zZXRTaXplKHdpbmRvdy5pbm5lcldpZHRoLCB3aW5kb3cuaW5uZXJIZWlnaHQpO1xuICAgIGNhbWVyYS5hc3BlY3QgPSB3aW5kb3cuaW5uZXJXaWR0aCAvIHdpbmRvdy5pbm5lckhlaWdodDtcbiAgICBjYW1lcmEudXBkYXRlUHJvamVjdGlvbk1hdHJpeCgpO1xufVxuXG5jb25zdCBzaG9vdEJ1dHRvblN0eWxlID0gXCJwb3NpdGlvbjogZml4ZWQ7IHRvcDogNTAlOyBsZWZ0OiA4NSU7IHdpZHRoOiA1MHB4OyBoZWlnaHQ6IDUwcHg7IGJhY2tncm91bmQtaW1hZ2U6IHVybChkb3QtYW5kLWNpcmNsZS5zdmcpO1wiXG5leHBvcnQgZnVuY3Rpb24gc3RhcnQoYm9keSkge1xuICAgIC8vIG1vdXNlL2tleWJvYXJkIGV2ZW50c1xuICAgIGRvY3VtZW50LmFkZEV2ZW50TGlzdGVuZXIoJ21vdXNlbW92ZScsIG9uTW91c2VNb3ZlKTtcbiAgICBkb2N1bWVudC5hZGRFdmVudExpc3RlbmVyKCdrZXlkb3duJywgb25LZXlEb3duKTtcbiAgICBkb2N1bWVudC5hZGRFdmVudExpc3RlbmVyKCdrZXl1cCcsIG9uS2V5VXApO1xuICAgIGRvY3VtZW50LmFkZEV2ZW50TGlzdGVuZXIoJ2NsaWNrJywgb25DbGljayk7XG4gICAgZG9jdW1lbnQuYWRkRXZlbnRMaXN0ZW5lcignbW91c2Vkb3duJywgb25Nb3VzZURvd24pO1xuICAgIGRvY3VtZW50LmFkZEV2ZW50TGlzdGVuZXIoJ21vdXNldXAnLCBvbk1vdXNlVXApO1xuICAgIGRvY3VtZW50LmFkZEV2ZW50TGlzdGVuZXIoJ3BvaW50ZXJsb2NrY2hhbmdlJywgb25Qb2ludGVyTG9ja0NoYW5nZSlcblxuICAgIC8vIHRvdWNoIGV2ZW50c1xuICAgIGRvY3VtZW50LmFkZEV2ZW50TGlzdGVuZXIoJ3RvdWNoc3RhcnQnLCBoYW5kbGVUb3VjaCk7XG4gICAgZG9jdW1lbnQuYWRkRXZlbnRMaXN0ZW5lcigndG91Y2htb3ZlJywgaGFuZGxlVG91Y2gpO1xuICAgIGRvY3VtZW50LmFkZEV2ZW50TGlzdGVuZXIoJ3RvdWNoZW5kJywgb25Ub3VjaEVuZCk7XG5cbiAgICB3aW5kb3cuYWRkRXZlbnRMaXN0ZW5lcigncmVzaXplJywgcmVzaXplKTtcblxuICAgIGFuaW1hdGUoKTtcblxuICAgIC8vIGNyZWF0ZSBjcm9zc2hhaXJcbiAgICB2YXIgY3Jvc3NoYWlySHRtbEVsZW1lbnQgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KFwiZGl2XCIpXG4gICAgY3Jvc3NoYWlySHRtbEVsZW1lbnQuc2V0QXR0cmlidXRlKFwic3R5bGVcIiwgXCJwb3NpdGlvbjogZml4ZWQ7IHRvcDogNTAlOyBsZWZ0OiA1MCU7IHRyYW5zZm9ybTogdHJhbnNsYXRlKC01MCUsIC01MCUpOyB3aWR0aDogMzBweDsgaGVpZ2h0OiAzMHB4OyBiYWNrZ3JvdW5kLWltYWdlOiB1cmwoY3Jvc3NoYWlyLnN2Zyk7XCIpXG4gICAgYm9keS5hcHBlbmRDaGlsZChjcm9zc2hhaXJIdG1sRWxlbWVudClcbiAgICAvLyBzaG9vdCBidXR0b24gZm9yIG1vYmlsZSBjb250cm9sc1xuICAgIHZhciBzaG9vdEJ1dHRvbiA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoXCJkaXZcIik7XG4gICAgc2hvb3RCdXR0b24uc2V0QXR0cmlidXRlKFwiaWRcIiwgXCJzaG9vdEJ1dHRvblwiKTtcbiAgICBcbiAgICBzaG9vdEJ1dHRvbi5zZXRBdHRyaWJ1dGUoXCJzdHlsZVwiLCBcImRpc3BsYXk6IG5vbmU7XCIrc2hvb3RCdXR0b25TdHlsZSlcbiAgICBib2R5LmFwcGVuZENoaWxkKHNob290QnV0dG9uKVxuXG4gICAgLy8gZnVsbCBzY3JlZW4gYnV0dG9uXG4gICAgdmFyIGZ1bGxTY3JlZW5CdXR0b24gPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KFwiZGl2XCIpO1xuICAgIGZ1bGxTY3JlZW5CdXR0b24ub25jbGljayA9IGZ1bmN0aW9uKCkge1xuICAgICAgICBpZiAoYm9keS5yZXF1ZXN0RnVsbHNjcmVlbikge1xuICAgICAgICAgICAgYm9keS5yZXF1ZXN0RnVsbHNjcmVlbigpO1xuICAgICAgICB9IGVsc2UgaWYgKGJvZHkubW96UmVxdWVzdEZ1bGxTY3JlZW4pIHsgLyogRmlyZWZveCAqL1xuICAgICAgICAgICAgYm9keS5tb3pSZXF1ZXN0RnVsbFNjcmVlbigpO1xuICAgICAgICB9IGVsc2UgaWYgKGJvZHkud2Via2l0UmVxdWVzdEZ1bGxzY3JlZW4pIHsgLyogQ2hyb21lLCBTYWZhcmkgYW5kIE9wZXJhICovXG4gICAgICAgICAgICBib2R5LndlYmtpdFJlcXVlc3RGdWxsc2NyZWVuKCk7XG4gICAgICAgIH0gZWxzZSBpZiAoYm9keS5tc1JlcXVlc3RGdWxsc2NyZWVuKSB7IC8qIElFL0VkZ2UgKi9cbiAgICAgICAgICAgIGJvZHkubXNSZXF1ZXN0RnVsbHNjcmVlbigpO1xuICAgICAgICB9XG4gICAgfVxuICAgIGZ1bGxTY3JlZW5CdXR0b24uc2V0QXR0cmlidXRlKFwic3R5bGVcIiwgXCJwb3NpdGlvbjogZml4ZWQ7IHRvcDogMTAlOyBsZWZ0OiA3JTs7IHRyYW5zZm9ybTogdHJhbnNsYXRlKC01MCUsIC01MCUpOyB3aWR0aDogMTVweDsgaGVpZ2h0OiAxNXB4OyBiYWNrZ3JvdW5kLWltYWdlOiB1cmwoZnVsbHNjcmVlbi5zdmcpO1wiKVxuICAgIGJvZHkuYXBwZW5kQ2hpbGQoZnVsbFNjcmVlbkJ1dHRvbilcbn0iLCJpbXBvcnQgeyBHTFRGTG9hZGVyIH0gZnJvbSAndGhyZWUvZXhhbXBsZXMvanNtL2xvYWRlcnMvR0xURkxvYWRlcidcblxudmFyIGxvYWRlciA9IG5ldyBHTFRGTG9hZGVyKCk7XG5cbmV4cG9ydCB7bG9hZGVyfSIsImltcG9ydCB7VmVjdG9yMywgQW5pbWF0aW9uTWl4ZXIsIFJheWNhc3RlciwgTGluZTMsIEdlb21ldHJ5LCBMaW5lQmFzaWNNYXRlcmlhbCwgTGluZSwgVmVjdG9yMiB9IGZyb20gJ3RocmVlJ1xuXG5pbXBvcnQge2xvYWRlcn0gZnJvbSAnLi9sb2FkZXInXG5pbXBvcnQge3V1aWR9IGZyb20gJy4vdXRpbHMnXG5pbXBvcnQge3NjZW5lLCBjb2xsaWRhYmxlRW52aXJvbm1lbnR9IGZyb20gJy4vc2NlbmUnXG5pbXBvcnQge2NhbWVyYX0gZnJvbSAnLi9jYW1lcmEnXG5pbXBvcnQge3Nob290QXJyb3d9IGZyb20gJy4vYXJyb3cnXG5pbXBvcnQge3NlbmRNZXNzYWdlfSBmcm9tICcuL3dlYnNvY2tldCdcbmltcG9ydCB7aW5pdEFjdGlvbnN9IGZyb20gJy4vYXJjaGVyJ1xuXG5pbXBvcnQgQWRhbSBmcm9tICcuLi9tb2RlbHMvYmVuamkuZ2xiJ1xuXG52YXIgcGxheWVyVXVpZCA9IHV1aWQoKTtcblxudmFyIHBsYXllcjE7XG52YXIgbWl4ZXI7XG5jb25zdCBtb3ZlbWVudFNwZWVkID0gMC4xMjtcblxubG9hZGVyLmxvYWQoIEFkYW0sICggZ2x0ZiApID0+IHtcbiAgICBwbGF5ZXIxID0gZ2x0ZjtcbiAgICBwbGF5ZXIxLnZlbG9jaXR5ID0gbmV3IFZlY3RvcjMoKVxuICAgIHBsYXllcjEuYm93U3RhdGUgPSBcInVuZXF1aXBwZWRcIlxuXG4gICAgc2NlbmUuYWRkKCBnbHRmLnNjZW5lICk7XG4gICAgbWl4ZXIgPSBuZXcgQW5pbWF0aW9uTWl4ZXIoZ2x0Zi5zY2VuZSk7XG4gICAgaW5pdEFjdGlvbnMobWl4ZXIsIHBsYXllcjEpO1xuICAgIG1peGVyLmFkZEV2ZW50TGlzdGVuZXIoJ2ZpbmlzaGVkJywgKGV2ZW50KSA9PiB7XG4gICAgICAgIGlmIChldmVudC5hY3Rpb24uZ2V0Q2xpcCgpLm5hbWUgIT09IFwiRHJhdyBib3dcIikge1xuICAgICAgICAgICAgLy8gdGhpcyBpcyBoYWNreSBhbmQgc2hvdWxkIGJlIGNoYW5nZWRcbiAgICAgICAgICAgIHBsYXllcjEucGxheUFjdGlvbihcImlkbGVcIilcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIHBsYXllcjEuYm93U3RhdGUgPSBcImRyYXduXCJcbiAgICAgICAgfVxuICAgIH0pXG5cbiAgICBwbGF5ZXIxLmZhbGxpbmcgPSBmdW5jdGlvbigpe1xuICAgICAgICB2YXIgdmVydCA9IG5ldyBWZWN0b3IzKDAsIC0xLCAwKTtcbiAgICAgICAgdmVydCA9IHZlcnQuY2xvbmUoKS5ub3JtYWxpemUoKVxuICAgICAgICB2YXIgcmF5ID0gbmV3IFJheWNhc3RlcihuZXcgVmVjdG9yMyhwbGF5ZXIxLnNjZW5lLnBvc2l0aW9uLngsIHBsYXllcjEuc2NlbmUucG9zaXRpb24ueSswLjksIHBsYXllcjEuc2NlbmUucG9zaXRpb24ueiksIHZlcnQpO1xuICAgICAgICB2YXIgY29sbGlzaW9uUmVzdWx0cyA9IHJheS5pbnRlcnNlY3RPYmplY3RzKGNvbGxpZGFibGVFbnZpcm9ubWVudCwgdHJ1ZSk7XG4gICAgICAgIGlmICggY29sbGlzaW9uUmVzdWx0cy5sZW5ndGggPiAwICYmIGNvbGxpc2lvblJlc3VsdHNbMF0uZGlzdGFuY2UgPD0gbmV3IExpbmUzKG5ldyBWZWN0b3IzKCksIHZlcnQpLmRpc3RhbmNlKCkpIHtcbiAgICAgICAgICAgIHJldHVybiBmYWxzZVxuICAgICAgICB9XG4gICAgICAgIHJldHVybiB0cnVlO1xuICAgIH1cblxuICAgIHZhciBkaXNwbGF5Q29sbGlzaW9uTGluZXMgPSBmYWxzZVxuICAgIHBsYXllcjEuY29sbGlzaW9uRGV0ZWN0ZWQgPSBmdW5jdGlvbihuZXh0UG9zKXtcbiAgICAgICAgaWYgKGRpc3BsYXlDb2xsaXNpb25MaW5lcyl7XG4gICAgICAgICAgICBwbGF5ZXIxLnNjZW5lLmNoaWxkcmVuLmZvckVhY2goKGNoaWxkKSA9PiB7XG4gICAgICAgICAgICAgICBpZiAoY2hpbGQubmFtZSA9PT0gXCJjb2xsaXNpb24gbGluZVwiKSB7XG4gICAgICAgICAgICAgICAgICAgcGxheWVyMS5zY2VuZS5yZW1vdmUoY2hpbGQpXG4gICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9KVxuICAgICAgICB9XG4gICAgICAgIGZvcih2YXIgYT0tMTsgYTw9MTsgYSsrKXtcbiAgICAgICAgICAgIGZvcih2YXIgYz0tMTsgYzw9MTsgYysrKXtcbiAgICAgICAgICAgICAgICAvLyB0aGlzIGRpY3RhdGVzIGhvdyBsb25nIHRoZSBjb2xsaXNpb24gcmF5cyBhcmUgKGhvdyBiaWcgdGhlIGNvbGxpc2lvbiBkZXRlY3Rpb24gYXJlYSBpcylcbiAgICAgICAgICAgICAgICB2YXIgY29sbGlzaW9uTW9kaWZpZXIgPSAwLjVcbiAgICAgICAgICAgICAgICBhKj1jb2xsaXNpb25Nb2RpZmllclxuICAgICAgICAgICAgICAgIGMqPWNvbGxpc2lvbk1vZGlmaWVyXG4gICAgICAgICAgICAgICAgdmFyIHZlcnQgPSBuZXcgVmVjdG9yMyhhLCAxLCBjKTtcbiAgICAgICAgICAgICAgICB2ZXJ0ID0gdmVydC5jbG9uZSgpLm5vcm1hbGl6ZSgpXG4gICAgICAgICAgICAgICAgdmFyIHJheSA9IG5ldyBSYXljYXN0ZXIobmV3IFZlY3RvcjMobmV4dFBvcy54LCBuZXh0UG9zLnksIG5leHRQb3MueiksIHZlcnQpO1xuICAgICAgICAgICAgICAgIGlmIChkaXNwbGF5Q29sbGlzaW9uTGluZXMpe1xuICAgICAgICAgICAgICAgICAgICB2YXIgZ2VvbWV0cnkgPSBuZXcgR2VvbWV0cnkoKTtcbiAgICAgICAgICAgICAgICAgICAgZ2VvbWV0cnkudmVydGljZXMucHVzaChcbiAgICAgICAgICAgICAgICAgICAgICAgIHZlcnQsXG4gICAgICAgICAgICAgICAgICAgICAgICBuZXcgVmVjdG9yMygpXG4gICAgICAgICAgICAgICAgICAgICk7XG4gICAgICAgICAgICAgICAgICAgIHZhciBtYXRlcmlhbCA9IG5ldyBMaW5lQmFzaWNNYXRlcmlhbCh7XG4gICAgICAgICAgICAgICAgICAgICAgICBjb2xvcjogMHhmZjAwMDBcbiAgICAgICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICAgICAgICAgIHZhciBsaW5lID0gbmV3IExpbmUoIGdlb21ldHJ5LCBtYXRlcmlhbCApXG4gICAgICAgICAgICAgICAgICAgIGxpbmUubmFtZSA9IFwiY29sbGlzaW9uIGxpbmVcIlxuICAgICAgICAgICAgICAgICAgICBwbGF5ZXIxLnNjZW5lLmFkZChsaW5lKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgLy8gdGhlIHRydWUgYmVsb3cgZGVub3RlcyB0byByZWN1cnNpdmx5IGNoZWNrIGZvciBjb2xsaXNpb24gd2l0aCBvYmplY3RzIGFuZCBhbGwgdGhlaXIgY2hpbGRyZW4uIE1pZ2h0IG5vdCBiZSBlZmZpY2llbnRcbiAgICAgICAgICAgICAgICB2YXIgY29sbGlzaW9uUmVzdWx0cyA9IHJheS5pbnRlcnNlY3RPYmplY3RzKGNvbGxpZGFibGVFbnZpcm9ubWVudCwgdHJ1ZSk7XG4gICAgICAgICAgICAgICAgaWYgKCBjb2xsaXNpb25SZXN1bHRzLmxlbmd0aCA+IDAgJiYgY29sbGlzaW9uUmVzdWx0c1swXS5kaXN0YW5jZSA8PSBuZXcgTGluZTMobmV3IFZlY3RvcjMoKSwgdmVydCkuZGlzdGFuY2UoKSkge1xuICAgICAgICAgICAgICAgICAgICBpZiAoZGlzcGxheUNvbGxpc2lvbkxpbmVzICYmIGxpbmUpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGxpbmUubWF0ZXJpYWwuY29sb3IuYj0xXG4gICAgICAgICAgICAgICAgICAgICAgICBsaW5lLm5hbWUgPSBcImNvbGxpc2lvblwiXG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIHRydWVcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIGZhbHNlO1xuICAgIH1cblxuICAgIHBsYXllcjEucGxheUFjdGlvbiA9IGZ1bmN0aW9uKGFjdGlvbikge1xuICAgICAgICBpZiAocGxheWVyMS5hY3RpdmVBY3Rpb24pIHtcbiAgICAgICAgICAgIHBsYXllcjEuYWN0aW9uc1twbGF5ZXIxLmFjdGl2ZUFjdGlvbl0uc3RvcCgpXG4gICAgICAgICAgICBpZihwbGF5ZXIxLnByZXZpb3VzQWN0aW9uIT1hY3Rpb24mJnBsYXllcjEuYWN0aXZlQWN0aW9uIT1hY3Rpb24pe1xuICAgICAgICAgICAgICAgIHBsYXllcjEucHJldmlvdXNBY3Rpb24gPSBwbGF5ZXIxLmFjdGl2ZUFjdGlvblxuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICAgIHBsYXllcjEuYWN0aXZlQWN0aW9uID0gYWN0aW9uXG4gICAgICAgIHBsYXllcjEuYWN0aW9uc1thY3Rpb25dLnJlc2V0KCkucGxheSgpO1xuICAgICAgICBwbGF5ZXIxLnN0YXRlID0gYWN0aW9uXG4gICAgICAgIHNlbmRNZXNzYWdlKFxuICAgICAgICAgICAge1xuICAgICAgICAgICAgICAgIHBsYXllcjogcGxheWVyVXVpZCxcbiAgICAgICAgICAgICAgICAvLyByb3RhdGlvbjogcm90YXRpb24sIHlvdSBtaWdodCB3YW50IHRoaXMgbGF0ZXIgaWYgbXVsdGlwbGF5ZXIgYW5pbWF0aW9uIHJvdGF0aW9ucyBhcmUgd2VpcmRcbiAgICAgICAgICAgICAgICBhY3Rpb246IGFjdGlvblxuICAgICAgICAgICAgfVxuICAgICAgICApXG4gICAgfVxuXG4gICAgcGxheWVyMS5qdW1wID0gZnVuY3Rpb24oKSB7XG4gICAgICAgIHBsYXllcjEudmVsb2NpdHkueSA9IDVcbiAgICAgICAgcGxheWVyMS5wbGF5QWN0aW9uKFwianVtcGluZ1wiKVxuICAgIH1cblxuICAgIHBsYXllcjEub25Nb3VzZURvd24gPSBmdW5jdGlvbigpIHtcbiAgICAgICAgaWYgKHBsYXllcjEuYm93U3RhdGUgPT0gXCJ1bmVxdWlwcGVkXCIpIHtcbiAgICAgICAgICAgIHBsYXllcjEuZXF1aXBCb3coKVxuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgcGxheWVyMS5wbGF5QWN0aW9uKFwiZHJhd0Jvd1wiKVxuICAgICAgICB9XG4gICAgfVxuXG4gICAgcGxheWVyMS5vbk1vdXNlVXAgPSBmdW5jdGlvbigpIHtcbiAgICAgICAgaWYgKHBsYXllcjEuYm93U3RhdGUgPT0gXCJkcmF3blwiKSB7XG4gICAgICAgICAgICBwbGF5ZXIxLnBsYXlBY3Rpb24oXCJmaXJlQm93XCIpXG4gICAgICAgICAgICBzaG9vdEFycm93KCk7XG4gICAgICAgICAgICBwbGF5ZXIxLmJvd1N0YXRlID0gXCJlcXVpcHBlZFwiXG4gICAgICAgIH0gZWxzZSBpZiAocGxheWVyMS5zdGF0ZSA9PT0gXCJkcmF3Qm93XCIpIHtcbiAgICAgICAgICAgIHBsYXllcjEuYWN0aW9ucy5kcmF3Qm93LnN0b3AoKTtcbiAgICAgICAgICAgIHBsYXllcjEucGxheUFjdGlvbihcImlkbGVcIilcbiAgICAgICAgfVxuICAgIH1cblxuICAgIHBsYXllcjEubW92ZSA9IGZ1bmN0aW9uKG5leHRQb3MsIHJvdGF0aW9uPXBsYXllcjEuc2NlbmUucm90YXRpb24ueSl7XG4gICAgICAgIGlmKCFwbGF5ZXIxLmNvbGxpc2lvbkRldGVjdGVkKG5leHRQb3MpKXtcbiAgICAgICAgICAgIHBsYXllcjEuc2NlbmUucG9zaXRpb24uY29weShuZXh0UG9zKVxuICAgICAgICAgICAgcGxheWVyMS5zY2VuZS5yb3RhdGlvbi55ID0gcm90YXRpb25cbiAgICAgICAgICAgIGNhbWVyYS51cGRhdGVDYW1lcmEoKVxuICAgICAgICAgICAgc2VuZE1lc3NhZ2UoXG4gICAgICAgICAgICAgICAge1xuICAgICAgICAgICAgICAgICAgICBwbGF5ZXI6IHBsYXllclV1aWQsXG4gICAgICAgICAgICAgICAgICAgIHg6IHBsYXllcjEuc2NlbmUucG9zaXRpb24ueCxcbiAgICAgICAgICAgICAgICAgICAgeTogcGxheWVyMS5zY2VuZS5wb3NpdGlvbi55LFxuICAgICAgICAgICAgICAgICAgICB6OiBwbGF5ZXIxLnNjZW5lLnBvc2l0aW9uLnosXG4gICAgICAgICAgICAgICAgICAgIHJvdGF0aW9uOiByb3RhdGlvbixcbiAgICAgICAgICAgICAgICAgICAgYWN0aW9uOiBwbGF5ZXIxLmFjdGl2ZUFjdGlvblxuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIClcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIHBsYXllcjEudmVsb2NpdHkuc2V0KDAsMCwwKVxuICAgICAgICB9XG4gICAgfVxuXG4gICAgcGxheWVyMS5pc1J1bm5pbmcgPSBmdW5jdGlvbigpe1xuICAgICAgICBpZiAocGxheWVyMS5hY3RpdmVBY3Rpb24pIHtcbiAgICAgICAgICAgIHJldHVybiBwbGF5ZXIxLmFjdGl2ZUFjdGlvbi50b0xvd2VyQ2FzZSgpLmluY2x1ZGVzKFwicnVuXCIpXG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIGZhbHNlXG4gICAgfVxuXG4gICAgZnVuY3Rpb24gZ2V0RGlyZWN0aW9uKGlucHV0KSB7XG4gICAgICAgIHZhciBkaXJlY3Rpb24gPSBuZXcgVmVjdG9yMygpO1xuICAgICAgICBjYW1lcmEuZ2V0V29ybGREaXJlY3Rpb24oZGlyZWN0aW9uKVxuICAgICAgICBkaXJlY3Rpb24gPSBuZXcgVmVjdG9yMihkaXJlY3Rpb24ueCwgZGlyZWN0aW9uLnopIC8vIDNkIHogYmVjb21lcyAyZCB5XG4gICAgICAgIGRpcmVjdGlvbi5ub3JtYWxpemUoKS5tdWx0aXBseVNjYWxhcihtb3ZlbWVudFNwZWVkKTtcbiAgICAgICAgdmFyIHg9MCwgeT0wIC8vIHRoZXNlIGFyZSB0aGUgaW5wdXREaXJlY3Rpb25zXG4gICAgICAgIGlmIChpbnB1dC50b3VjaC54IT0wICYmIGlucHV0LnRvdWNoLnkhPTApIHtcbiAgICAgICAgICAgIHZhciBkaXIgPSBuZXcgVmVjdG9yMihpbnB1dC50b3VjaC54LCBpbnB1dC50b3VjaC55KS5ub3JtYWxpemUoKVxuICAgICAgICAgICAgeCA9IGRpci54XG4gICAgICAgICAgICB5ID0gZGlyLnlcbiAgICAgICAgfVxuICAgICAgICBpZiAoaW5wdXQua2V5Ym9hcmQuZm9yd2FyZCkge1xuICAgICAgICAgICAgeCArPSAwXG4gICAgICAgICAgICB5ICs9IDFcbiAgICAgICAgfVxuICAgICAgICBpZiAoaW5wdXQua2V5Ym9hcmQuYmFja3dhcmQpIHtcbiAgICAgICAgICAgIHggKz0gMFxuICAgICAgICAgICAgeSArPSAtMVxuICAgICAgICB9XG4gICAgICAgIGlmIChpbnB1dC5rZXlib2FyZC5sZWZ0KSB7XG4gICAgICAgICAgICB4ICs9IC0xXG4gICAgICAgICAgICB5ICs9IDBcbiAgICAgICAgfVxuICAgICAgICBpZiAoaW5wdXQua2V5Ym9hcmQucmlnaHQpIHtcbiAgICAgICAgICAgIHggKz0gMVxuICAgICAgICAgICAgeSArPSAwXG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIGRpcmVjdGlvbi5yb3RhdGVBcm91bmQobmV3IFZlY3RvcjIoKSwgTWF0aC5hdGFuMih4LCB5KSlcbiAgICB9XG5cbiAgICBwbGF5ZXIxLmFuaW1hdGUgPSBmdW5jdGlvbihkZWx0YSwgaW5wdXQpe1xuICAgICAgICB2YXIgbmV4dFBvcyA9IG5ldyBWZWN0b3IzKCk7XG4gICAgICAgIHZhciByb3RhdGlvbjtcbiAgICAgICAgaWYgKHBsYXllcjEuZmFsbGluZygpKSB7XG4gICAgICAgICAgICBwbGF5ZXIxLnN0YXRlID0gJ2ZhbGxpbmcnXG4gICAgICAgICAgICBwbGF5ZXIxLnZlbG9jaXR5LnkgLT0gZGVsdGEqMTBcbiAgICAgICAgICAgIG5leHRQb3MgPSBwbGF5ZXIxLnNjZW5lLnBvc2l0aW9uLmNsb25lKCkuYWRkKHBsYXllcjEudmVsb2NpdHkuY2xvbmUoKS5tdWx0aXBseVNjYWxhcihkZWx0YSkpXG4gICAgICAgICAgICBwbGF5ZXIxLm1vdmUobmV4dFBvcylcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIHBsYXllcjEudmVsb2NpdHkuc2V0KDAsMCwwKVxuICAgICAgICAgICAgaWYgKGlucHV0LmtleWJvYXJkLnNwYWNlKSB7XG4gICAgICAgICAgICAgICAgcGxheWVyMS5qdW1wKCk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBpZiAoKGlucHV0LnRvdWNoLnghPTAmJmlucHV0LnRvdWNoLnkhPTApIHx8IGlucHV0LmtleWJvYXJkLmZvcndhcmQgfHwgaW5wdXQua2V5Ym9hcmQuYmFja3dhcmQgfHwgaW5wdXQua2V5Ym9hcmQubGVmdCB8fCBpbnB1dC5rZXlib2FyZC5yaWdodCkge1xuICAgICAgICAgICAgICAgIHZhciBkaXJlY3Rpb24gPSBnZXREaXJlY3Rpb24oaW5wdXQpXG4gICAgICAgICAgICAgICAgbmV4dFBvcy56ID0gcGxheWVyMS5zY2VuZS5wb3NpdGlvbi56ICsgZGlyZWN0aW9uLnk7XG4gICAgICAgICAgICAgICAgbmV4dFBvcy54ID0gcGxheWVyMS5zY2VuZS5wb3NpdGlvbi54ICsgZGlyZWN0aW9uLng7XG4gICAgICAgICAgICAgICAgcm90YXRpb24gPSBNYXRoLmF0YW4yKGRpcmVjdGlvbi54LCBkaXJlY3Rpb24ueSlcbiAgICAgICAgICAgICAgICBwbGF5ZXIxLnZlbG9jaXR5LnggPSAobmV4dFBvcy54LXBsYXllcjEuc2NlbmUucG9zaXRpb24ueCkvZGVsdGFcbiAgICAgICAgICAgICAgICBwbGF5ZXIxLnZlbG9jaXR5LnogPSAobmV4dFBvcy56LXBsYXllcjEuc2NlbmUucG9zaXRpb24ueikvZGVsdGFcblxuICAgICAgICAgICAgICAgIC8vIGZvciBtb3ZpbmcgdXAvZG93biBzbG9wZXNcbiAgICAgICAgICAgICAgICAvLyBhbHNvIHdvcnRoIG1lbnRpb25pbmcgdGhhdCB0aGUgcGxheWVycyBtb3ZlbWVudCBkaXN0YW5jZSB3aWxsIGluY3JlYXNlIGFzIGl0IGdvZXMgdXBoaWxsLCB3aGljaCBzaG91bGQgcHJvYmFibHkgYmUgZml4ZWQgZXZlbnR1YWxseVxuICAgICAgICAgICAgICAgIG5leHRQb3MueSA9IHBsYXllcjEuc2NlbmUucG9zaXRpb24ueVxuICAgICAgICAgICAgICAgIHZhciBvcmlnaW4gPSBuZXcgVmVjdG9yMyhuZXh0UG9zLngsIG5leHRQb3MueSsxLCBuZXh0UG9zLnopXG4gICAgICAgICAgICAgICAgdmFyIHNsb3BlUmF5ID0gbmV3IFJheWNhc3RlcihvcmlnaW4sIG5ldyBWZWN0b3IzKDAsIC0xLCAwKSlcbiAgICAgICAgICAgICAgICB2YXIgdG9wID0gc2xvcGVSYXkuaW50ZXJzZWN0T2JqZWN0cyhjb2xsaWRhYmxlRW52aXJvbm1lbnQsIHRydWUpO1xuICAgICAgICAgICAgICAgIGlmICh0b3AubGVuZ3RoPjApe1xuICAgICAgICAgICAgICAgICAgICAvLyB0aGUgMC4wMSBpcyBraW5kYSBoYWNreSB0YmhcbiAgICAgICAgICAgICAgICAgICAgbmV4dFBvcy55ID0gdG9wWzBdLnBvaW50LnkrMC4wMVxuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICBcbiAgICAgICAgICAgICAgICBwbGF5ZXIxLm1vdmUobmV4dFBvcywgcm90YXRpb24pXG4gICAgICAgICAgICAgICAgaWYgKCFwbGF5ZXIxLmlzUnVubmluZygpKSB7XG4gICAgICAgICAgICAgICAgICAgIGlmIChwbGF5ZXIxLmJvd1N0YXRlID09IFwiZXF1aXBwZWRcIikge1xuICAgICAgICAgICAgICAgICAgICAgICAgcGxheWVyMS5wbGF5QWN0aW9uKCdydW5XaXRoQm93JylcbiAgICAgICAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHBsYXllcjEucGxheUFjdGlvbigncnVubmluZycpXG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9IGVsc2UgaWYgKHBsYXllcjEuaXNSdW5uaW5nKCkpIHtcbiAgICAgICAgICAgICAgICBwbGF5ZXIxLnBsYXlBY3Rpb24oJ2lkbGUnKVxuICAgICAgICAgICAgfVxuICAgICAgICAgICAgaWYgKGlucHV0LmtleWJvYXJkLnNwYWNlKSB7XG4gICAgICAgICAgICAgICAgbmV4dFBvcyA9IHBsYXllcjEuc2NlbmUucG9zaXRpb24uY2xvbmUoKS5hZGQocGxheWVyMS52ZWxvY2l0eS5jbG9uZSgpLm11bHRpcGx5U2NhbGFyKGRlbHRhKSlcbiAgICAgICAgICAgICAgICBwbGF5ZXIxLm1vdmUobmV4dFBvcylcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgIH1cblxuICAgIHBsYXllcjEuZXF1aXBCb3cgPSBmdW5jdGlvbigpIHtcbiAgICAgICAgcGxheWVyMS5ib3dTdGF0ZSA9IFwiZXF1aXBwZWRcIlxuICAgICAgICBwbGF5ZXIxLnBsYXlBY3Rpb24oXCJlcXVpcEJvd1wiKVxuICAgICAgICAvLyB0aGlzIGlzIGEgaGFjayBiZWNhdXNlIEknbSB0b28gbGF6eSB0byBmaWd1cmUgb3V0IGhvdyB0byBhbmltYXRlIHRoaXMgaW4gYmxlbmRlclxuICAgICAgICBwbGF5ZXIxLnNjZW5lLmNoaWxkcmVuWzBdLmNoaWxkcmVuWzFdLnZpc2libGUgPSBmYWxzZVxuICAgICAgICBwbGF5ZXIxLnNjZW5lLmNoaWxkcmVuWzBdLmNoaWxkcmVuWzJdLnZpc2libGUgPSB0cnVlXG4gICAgfVxuXG4gICAgcGxheWVyMS51bmVxdWlwQm93ID0gZnVuY3Rpb24oKSB7XG4gICAgICAgIHBsYXllcjEuc2NlbmUuY2hpbGRyZW5bMF0uY2hpbGRyZW5bMl0udmlzaWJsZSA9IGZhbHNlXG4gICAgICAgIHBsYXllcjEuc2NlbmUuY2hpbGRyZW5bMF0uY2hpbGRyZW5bMV0udmlzaWJsZSA9IHRydWVcbiAgICAgICAgcGxheWVyMS5ib3dTdGF0ZSA9IFwidW5lcXVpcHBlZFwiO1xuICAgIH1cblxuICAgIHBsYXllcjEudGFrZURhbWFnZSA9IGZ1bmN0aW9uKCkge1xuICAgICAgICBwbGF5ZXIxLnNjZW5lLnBvc2l0aW9uLnkgLT0yMFxuICAgIH1cblxuICAgIHBsYXllcjEudW5lcXVpcEJvdygpXG4gICAgcGxheWVyMS5wbGF5QWN0aW9uKCdpZGxlJylcbn0pO1xuXG5leHBvcnQgeyBwbGF5ZXIxLCBwbGF5ZXJVdWlkLCBtaXhlciB9IiwiaW1wb3J0IHtBbmltYXRpb25NaXhlciwgVmVjdG9yMywgTWVzaCwgQm94R2VvbWV0cnl9IGZyb20gJ3RocmVlJ1xuXG5pbXBvcnQge2xvYWRlcn0gZnJvbSAnLi9sb2FkZXInXG5pbXBvcnQge3NjZW5lfSBmcm9tICcuL3NjZW5lJ1xuaW1wb3J0IHtpbml0QWN0aW9uc30gZnJvbSAnLi9hcmNoZXInXG5pbXBvcnQgcGxheWVyWCBmcm9tICcuLi9tb2RlbHMvYmVuamkuZ2xiJ1xuaW1wb3J0IHtzZW5kTWVzc2FnZX0gZnJvbSAnLi93ZWJzb2NrZXQnO1xuXG52YXIgcGxheWVycyA9IHt9O1xudmFyIHJvc3RlciA9IHt9XG52YXIgcGxheWVySGl0Qm94ZXMgPSBbXVxuXG5wbGF5ZXJzLmFsbCA9IGZ1bmN0aW9uKCkge1xuICAgIHJldHVybiByb3N0ZXI7XG59XG5cbnBsYXllcnMuZ2V0ID0gKHV1aWQpID0+IHtcbiAgICByZXR1cm4gcm9zdGVyW3V1aWRdXG59XG5cbnBsYXllcnMuYWRkID0gZnVuY3Rpb24odXVpZCwgcG9zaXRpb24pIHtcbiAgICAvLyB0aGlzIGlzIGEgaGFja3kgd2F5IHRvIG1ha2Ugc3VyZSB0aGUgcGxheWVyIG1vZGVsIGlzbid0IGxvYWRlZCBtdWx0aXBsZSB0aW1lc1xuICAgIHJvc3Rlclt1dWlkXSA9ICdsb2FkaW5nJ1xuICAgIGxvYWRlci5sb2FkKHBsYXllclgsIGZ1bmN0aW9uKHBsYXllcikge1xuICAgICAgICByb3N0ZXJbdXVpZF0gPSBwbGF5ZXI7IC8vIHRoaXMgbmVlZHMgdG8gaGFwcGVuIGZpcnN0LCBwcmV0dHkgc3VyZVxuICAgICAgICBpbml0QWN0aW9ucyhuZXcgQW5pbWF0aW9uTWl4ZXIocGxheWVyLnNjZW5lKSwgcGxheWVyKTtcbiAgICAgICAgaWYgKHBvc2l0aW9uKSB7XG4gICAgICAgICAgICBwbGF5ZXJzLm1vdmUodXVpZCwgcG9zaXRpb24sIDApXG4gICAgICAgIH1cbiAgICAgICAgc2NlbmUuYWRkKCBwbGF5ZXIuc2NlbmUgKTtcbiAgICAgICAgcGxheUFjdGlvbihwbGF5ZXIsIFwiaWRsZVwiKVxuXG4gICAgICAgIHZhciBoaXRCb3ggPSBuZXcgTWVzaChuZXcgQm94R2VvbWV0cnkoMC41LCAyLCAwLjUpKTtcbiAgICAgICAgaGl0Qm94LnBvc2l0aW9uLnkgKz0gMVxuICAgICAgICBoaXRCb3gubWF0ZXJpYWwudmlzaWJsZSA9IGZhbHNlXG4gICAgICAgIHBsYXllci5zY2VuZS5hZGQoaGl0Qm94KVxuICAgICAgICBoaXRCb3gucGxheWVyVXVpZCA9IHV1aWRcbiAgICAgICAgcGxheWVySGl0Qm94ZXMucHVzaChoaXRCb3gpXG4gICAgfSk7XG59XG5cbnBsYXllcnMuaW5pdCA9IGZ1bmN0aW9uKG5ld1BsYXllcnMpIHtcbiAgICBPYmplY3Qua2V5cyhuZXdQbGF5ZXJzKS5mb3JFYWNoKFxuICAgICAgICAocGxheWVyVXVpZCkgPT4ge1xuICAgICAgICAgICAgcGxheWVycy5hZGQocGxheWVyVXVpZCwgbmV3IFZlY3RvcjMoXG4gICAgICAgICAgICAgICAgbmV3UGxheWVyc1twbGF5ZXJVdWlkXS54LFxuICAgICAgICAgICAgICAgIG5ld1BsYXllcnNbcGxheWVyVXVpZF0ueSxcbiAgICAgICAgICAgICAgICBuZXdQbGF5ZXJzW3BsYXllclV1aWRdLnopKTtcbiAgICAgICAgfSlcbn1cblxucGxheWVycy5tb3ZlID0gZnVuY3Rpb24ocGxheWVyVXVpZCwgcG9zLCByb3RhdGlvbiwgYWN0aW9uKSB7XG4gICAgdmFyIHBsYXllciA9IHJvc3RlcltwbGF5ZXJVdWlkXVxuICAgIHBsYXllci5zY2VuZS5wb3NpdGlvbi5jb3B5KHBvcylcbiAgICBwbGF5ZXIuc2NlbmUucm90YXRpb24ueSA9IHJvdGF0aW9uXG4gICAgcGxheUFjdGlvbihwbGF5ZXIsIGFjdGlvbilcbn1cblxuZnVuY3Rpb24gcGxheUFjdGlvbihwbGF5ZXIsIGFjdGlvbikge1xuICAgIGlmIChwbGF5ZXIuYWN0aW9ucyAmJiBwbGF5ZXIuYWN0aW9uc1thY3Rpb25dKSB7XG4gICAgICAgIGlmIChwbGF5ZXIuYWN0aXZlQWN0aW9uKSB7XG4gICAgICAgICAgICBpZiAocGxheWVyLmFjdGl2ZUFjdGlvbiAhPSBhY3Rpb24pIHtcbiAgICAgICAgICAgICAgICBwbGF5ZXIuYWN0aW9uc1twbGF5ZXIuYWN0aXZlQWN0aW9uXS5zdG9wKClcbiAgICAgICAgICAgIH0gZWxzZSAge1xuICAgICAgICAgICAgICAgIHJldHVyblxuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICAgIHBsYXllci5hY3Rpb25zW2FjdGlvbl0ucmVzZXQoKS5wbGF5KClcbiAgICAgICAgcGxheWVyLmFjdGl2ZUFjdGlvbiA9IGFjdGlvblxuICAgIH1cbn1cblxuZnVuY3Rpb24gYW5pbWF0ZVBsYXllcnMoZGVsdGEpIHtcbiAgICBPYmplY3Qua2V5cyhyb3N0ZXIpLmZvckVhY2goXG4gICAgICAgIChwbGF5ZXJVdWlkKSA9PiB7XG4gICAgICAgICAgICBpZiAocm9zdGVyW3BsYXllclV1aWRdLm1peGVyKSB7XG4gICAgICAgICAgICAgICAgcm9zdGVyW3BsYXllclV1aWRdLm1peGVyLnVwZGF0ZShkZWx0YSlcbiAgICAgICAgICAgIH1cbiAgICAgICAgfSlcbn1cblxuZnVuY3Rpb24gcGxheWVyQWN0aW9uKHBsYXllclV1aWQsIGFjdGlvbikge1xuICAgIHZhciBwbGF5ZXIgPSByb3N0ZXJbcGxheWVyVXVpZF1cbiAgICBpZiAocGxheWVyKSB7XG4gICAgICAgIHBsYXlBY3Rpb24ocGxheWVyLCBhY3Rpb24pXG4gICAgfVxufVxuXG5mdW5jdGlvbiBraWxsUGxheWVyKHBsYXllclV1aWQpIHtcbiAgICBzZW5kTWVzc2FnZSh7XG4gICAgICAgIHBsYXllcjogcGxheWVyVXVpZCxcbiAgICAgICAgZGFtYWdlOiAxMDBcbiAgICB9KVxufVxuXG5leHBvcnQgeyBwbGF5ZXJzLCBhbmltYXRlUGxheWVycywgcGxheWVyQWN0aW9uLCBwbGF5ZXJIaXRCb3hlcywga2lsbFBsYXllciB9IiwiaW1wb3J0IHtXZWJHTFJlbmRlcmVyfSBmcm9tICd0aHJlZScgXG5cbi8vIG1ha2UgYW50aWFsaWFzIGEgc2V0dGluZyBldmVudHVhbGx5XG52YXIgcmVuZGVyZXIgPSBuZXcgV2ViR0xSZW5kZXJlcih7IGFudGlhbGlhczogdHJ1ZSB9KTtcbnJlbmRlcmVyLnNldENsZWFyQ29sb3IoXCIjZTVlNWU1XCIpO1xucmVuZGVyZXIuc2V0UGl4ZWxSYXRpbyggd2luZG93LmRldmljZVBpeGVsUmF0aW8gKTtcbnJlbmRlcmVyLnNldFNpemUoIHdpbmRvdy5pbm5lcldpZHRoLCB3aW5kb3cuaW5uZXJIZWlnaHQpO1xucmVuZGVyZXIuZ2FtbWFPdXRwdXQgPSB0cnVlO1xucmVuZGVyZXIuZ2FtbWFGYWN0b3IgPSAyLjI7XG5cbmV4cG9ydCAge3JlbmRlcmVyIH0iLCJpbXBvcnQgeyBTY2VuZSwgSGVtaXNwaGVyZUxpZ2h0LCBEaXJlY3Rpb25hbExpZ2h0IH0gZnJvbSAndGhyZWUnXG5cbmltcG9ydCB7IGxvYWRlciB9IGZyb20gJy4vbG9hZGVyJ1xuaW1wb3J0IGVudiBmcm9tICcuLi9tb2RlbHMvZW52LmdsYidcblxudmFyIHNjZW5lID0gbmV3IFNjZW5lKCk7XG52YXIgY29sbGlkYWJsZUVudmlyb25tZW50ID0gW11cblxubG9hZGVyLmxvYWQoZW52LCBmdW5jdGlvbiAoZ2x0Zikge1xuICAgIHZhciBtZXNoID0gZ2x0Zi5zY2VuZTtcbiAgICBtZXNoLnBvc2l0aW9uLnkgLT0xMFxuICAgIHNjZW5lLmFkZChtZXNoKTtcbiAgICBjb2xsaWRhYmxlRW52aXJvbm1lbnQucHVzaChtZXNoKVxufSk7XG5cbnNjZW5lLmFkZChnZXRIZW1pc3BoZXJlTGlnaHQoKSk7XG5zY2VuZS5hZGQoZ2V0RGlyZWN0aW9uYWxMaWdodCgpKTtcblxuZnVuY3Rpb24gZ2V0SGVtaXNwaGVyZUxpZ2h0KCkge1xuICAgIHZhciBoZW1pTGlnaHQgPSBuZXcgSGVtaXNwaGVyZUxpZ2h0KCAweGZmZmZmZiwgMHhmZmZmZmYsIDAuNiApO1xuICAgIGhlbWlMaWdodC5jb2xvci5zZXRIU0woIDAuNiwgMSwgMC42ICk7XG4gICAgaGVtaUxpZ2h0Lmdyb3VuZENvbG9yLnNldEhTTCggMC4wOTUsIDEsIDAuNzUgKTtcbiAgICBoZW1pTGlnaHQucG9zaXRpb24uc2V0KCAwLCA1MCwgMCApO1xuICAgIGhlbWlMaWdodC52aXNpYmxlID0gdHJ1ZTtcbiAgICByZXR1cm4gaGVtaUxpZ2h0O1xufVxuXG5mdW5jdGlvbiBnZXREaXJlY3Rpb25hbExpZ2h0KCkge1xuICAgIHZhciBkaXJMaWdodCA9IG5ldyBEaXJlY3Rpb25hbExpZ2h0KCAweGZmZmZmZiwgMSApO1xuICAgIGRpckxpZ2h0LmNvbG9yLnNldEhTTCggMC4xLCAxLCAwLjk1ICk7XG4gICAgZGlyTGlnaHQucG9zaXRpb24uc2V0KCAtIDEsIDEuNzUsIDEgKTtcbiAgICBkaXJMaWdodC5wb3NpdGlvbi5tdWx0aXBseVNjYWxhciggMzAgKTtcbiAgICBkaXJMaWdodC5jYXN0U2hhZG93ID0gdHJ1ZTtcbiAgICBkaXJMaWdodC5zaGFkb3cubWFwU2l6ZS53aWR0aCA9IDIwNDg7XG4gICAgZGlyTGlnaHQuc2hhZG93Lm1hcFNpemUuaGVpZ2h0ID0gMjA0ODtcbiAgICB2YXIgZCA9IDUwO1xuICAgIGRpckxpZ2h0LnNoYWRvdy5jYW1lcmEubGVmdCA9IC0gZDtcbiAgICBkaXJMaWdodC5zaGFkb3cuY2FtZXJhLnJpZ2h0ID0gZDtcbiAgICBkaXJMaWdodC5zaGFkb3cuY2FtZXJhLnRvcCA9IGQ7XG4gICAgZGlyTGlnaHQuc2hhZG93LmNhbWVyYS5ib3R0b20gPSAtIGQ7XG4gICAgZGlyTGlnaHQuc2hhZG93LmNhbWVyYS5mYXIgPSAzNTAwO1xuICAgIGRpckxpZ2h0LnNoYWRvdy5iaWFzID0gLSAwLjAwMDE7XG4gICAgZGlyTGlnaHQudmlzaWJsZSA9IHRydWU7XG4gICAgcmV0dXJuIGRpckxpZ2h0O1xufVxuXG5leHBvcnQgeyBzY2VuZSwgY29sbGlkYWJsZUVudmlyb25tZW50IH0iLCJleHBvcnQgZnVuY3Rpb24gdXVpZCgpIHtcbiAgICByZXR1cm4gJ3h4eHh4eHh4LXh4eHgtNHh4eC15eHh4LXh4eHh4eHh4eHh4eCcucmVwbGFjZSgvW3h5XS9nLCBmdW5jdGlvbihjKSB7XG4gICAgICAgIHZhciByID0gTWF0aC5yYW5kb20oKSAqIDE2IHwgMCwgdiA9IGMgPT0gJ3gnID8gciA6IChyICYgMHgzIHwgMHg4KTtcbiAgICAgICAgcmV0dXJuIHYudG9TdHJpbmcoMTYpO1xuICAgIH0pO1xufSIsImltcG9ydCB7IFZlY3RvcjMgfSBmcm9tICd0aHJlZSdcblxuaW1wb3J0IHsgcGxheWVycywgcGxheWVyQWN0aW9uIH0gZnJvbSAnLi9wbGF5ZXJzJ1xuaW1wb3J0IHsgcGxheWVyMSwgcGxheWVyVXVpZCB9IGZyb20gJy4vcGxheWVyMSdcbmltcG9ydCB7IHNjZW5lIH0gZnJvbSAnLi9zY2VuZSdcbmltcG9ydCB7IGFkZE90aGVyUGxheWVyQXJyb3cgfSBmcm9tICcuL2Fycm93J1xuXG4vLyB2YXIgdXJsID0gJ3dzOi8vbG9jYWxob3N0OjE4MTgxJ1xudmFyIHVybCA9ICd3czovL2VjMi0xOC0xOTEtMTM2LTI1MC51cy1lYXN0LTIuY29tcHV0ZS5hbWF6b25hd3MuY29tOjE4MTgxJ1xuY29uc3Qgd3MgPSBuZXcgV2ViU29ja2V0KHVybCk7XG5cbndzLm9ub3BlbiA9IGZ1bmN0aW9uIG9wZW4oKSB7XG4gICAgc2VuZE1lc3NhZ2Uoe21lc3NhZ2U6IFwic3VwIGZ1Y2tlclwifSlcbn07XG5cbndzLm9ubWVzc2FnZSA9IGZ1bmN0aW9uIG9uTWVzc2FnZShtZXNzYWdlKSB7XG4gICAgdmFyIG1lc3NhZ2UgPSBKU09OLnBhcnNlKG1lc3NhZ2UuZGF0YSlcbiAgICBpZiAobWVzc2FnZS5wbGF5ZXJzKSB7XG4gICAgICAgIHBsYXllcnMuaW5pdChtZXNzYWdlLnBsYXllcnMpO1xuICAgIH1cbiAgICBpZiAobWVzc2FnZS5wbGF5ZXIpIHtcbiAgICAgICAgdmFyIHBsYXllciA9IG1lc3NhZ2UucGxheWVyO1xuICAgICAgICBpZiAocGxheWVyID09IHBsYXllclV1aWQpIHtcbiAgICAgICAgICAgIGlmIChtZXNzYWdlLmRhbWFnZSkge1xuICAgICAgICAgICAgICAgIHBsYXllcjEudGFrZURhbWFnZShtZXNzYWdlLmRhbWFnZSlcbiAgICAgICAgICAgIH1cbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIGlmICghcGxheWVycy5nZXQocGxheWVyKSkge1xuICAgICAgICAgICAgICAgIHBsYXllcnMuYWRkKHBsYXllciwgbmV3IFZlY3RvcjMobWVzc2FnZS54LCBtZXNzYWdlLnksIG1lc3NhZ2UueikpXG4gICAgICAgICAgICB9IGVsc2UgaWYgKG1lc3NhZ2Uuc3RhdHVzPT09J2Rpc2Nvbm5lY3RlZCcpIHtcbiAgICAgICAgICAgICAgICAvLyBwbGF5ZXIgZGlzY29ubmVjdGVkLCByZW1vdmVcbiAgICAgICAgICAgICAgICBzY2VuZS5yZW1vdmUocGxheWVycy5nZXQocGxheWVyKS5zY2VuZSlcbiAgICAgICAgICAgICAgICBkZWxldGUgcGxheWVycy5nZXQocGxheWVyKVxuICAgICAgICAgICAgfSBlbHNlIGlmIChwbGF5ZXJzLmdldChwbGF5ZXIpLnNjZW5lICYmIG1lc3NhZ2UueCAmJiBtZXNzYWdlLnkgJiYgbWVzc2FnZS56ICYmIG1lc3NhZ2Uucm90YXRpb24gJiYgbWVzc2FnZS5hY3Rpb24pIHtcbiAgICAgICAgICAgICAgICBwbGF5ZXJzLm1vdmUocGxheWVyLCBuZXcgVmVjdG9yMyhtZXNzYWdlLngsIG1lc3NhZ2UueSwgbWVzc2FnZS56KSwgbWVzc2FnZS5yb3RhdGlvbiwgbWVzc2FnZS5hY3Rpb24pXG4gICAgICAgICAgICAgICAgcGxheWVycy5nZXQocGxheWVyKS5zdGF0ZSA9ICdtb3ZpbmcnXG4gICAgICAgICAgICB9IGVsc2UgaWYgKG1lc3NhZ2UuYWN0aW9uKSB7XG4gICAgICAgICAgICAgICAgcGxheWVyQWN0aW9uKHBsYXllciwgbWVzc2FnZS5hY3Rpb24pXG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICB9IGVsc2UgaWYgKG1lc3NhZ2UuYXJyb3cpIHtcbiAgICAgICAgYWRkT3RoZXJQbGF5ZXJBcnJvdyhtZXNzYWdlLmFycm93KVxuICAgIH1cbn1cblxuZnVuY3Rpb24gc2VuZE1lc3NhZ2UobWVzc2FnZSkge1xuICAgIHdzLnNlbmQoSlNPTi5zdHJpbmdpZnkobWVzc2FnZSkpXG59XG5cbmV4cG9ydCB7IHdzLCBzZW5kTWVzc2FnZSB9Il0sInNvdXJjZVJvb3QiOiIifQ==