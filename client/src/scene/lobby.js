import {BoxGeometry, Mesh, MeshStandardMaterial, DoubleSide, Group, PlaneBufferGeometry, Vector3} from 'three'

import {createTextMesh} from '../utils'
import {touchControlsText, mouseKeyboardControlsText, cyan} from '../constants'

const lobby = new Group()

lobby.platform = new Mesh(new BoxGeometry(500,4,500), new MeshStandardMaterial({color: 0x253031, side: DoubleSide}));
lobby.platform.position.y = -5
lobby.add(lobby.platform)
lobby.faceWorldBox = new Mesh(new BoxGeometry(4,4,4), new MeshStandardMaterial({color: cyan, side: DoubleSide}))
lobby.faceWorldBox.position.z-=10
lobby.faceWorldBox.position.y-=2
lobby.add(lobby.faceWorldBox)
lobby.loadingText = createTextMesh(['loading'], cyan, 1, new Vector3(-4, 0, -8))
lobby.add(lobby.loadingText)

let menu = new Group()
let menuPlane = new Mesh(new PlaneBufferGeometry(100, 100), new MeshStandardMaterial({color: 0xC6E0FF}))
menu.add(menuPlane)

let touchControlsMesh = createTextMesh(touchControlsText, cyan, 1, new Vector3(-10, 13, 0))
menu.add(touchControlsMesh)
let mouseKeyboardControlsMesh = createTextMesh(mouseKeyboardControlsText, cyan, 1, new Vector3(-10, 13, 0))
menu.add(mouseKeyboardControlsMesh)

let gameInfoMesh = createTextMesh(
  ["Follow progress on",
  "twitter @bowdownIO",
  "If you have feedback email:",
  "bowdown.feedback@gmail.com"], 0x7b5dba, 1, new Vector3(5, 1, 1))
gameInfoMesh.rotateOnAxis(new Vector3(0,1,0), -Math.PI/4)
menu.add(gameInfoMesh)

lobby.showControls = function() {
  let touch = (window.usingTouchControls == true)
  touchControlsMesh.visible = touch
  mouseKeyboardControlsMesh.visible = !touch
}
lobby.showControls();
menu.position.z -= 20
lobby.add(menu)




export default lobby