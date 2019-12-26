import {BoxGeometry, Mesh, MeshStandardMaterial, DoubleSide, Group, PlaneBufferGeometry} from 'three'

import {createTextMesh} from '../utils'

const lobby = new Group()

lobby.platform = new Mesh(new BoxGeometry(500,4,500), new MeshStandardMaterial({color: 0x253031, side: DoubleSide}));
lobby.platform.position.y = -5
lobby.add(lobby.platform)
lobby.faceWorldBox = new Mesh(new BoxGeometry(4,4,4), new MeshStandardMaterial({color: 0x0974A5, side: DoubleSide}))
lobby.faceWorldBox.position.z-=5
lobby.faceWorldBox.position.y-=2
lobby.add(lobby.faceWorldBox)
lobby.loadingText = createTextMesh(['loading'], 0x0974A5)
lobby.loadingText.position.z -= 3
lobby.loadingText.position.x -= 4
lobby.add(lobby.loadingText)

let menu = new Group()
let menuPlane = new Mesh(new PlaneBufferGeometry(100, 100), new MeshStandardMaterial({color: 0xC6E0FF}))
menu.add(menuPlane)

var controlsMesh
lobby.showControls = function() {
  let text
  if (window.usingTouchControls) {
    text = [
      "mobile controls",
      "Move",
      "  Touch movement on left side of screen",
      "Move Camera",
      "  Touch movement on right side of screen",
      "shoot Arrow",
      "  Target button (hold -> release)",
      "shoot Grapple",
      "  Grapple button (hold -> release)",
      "Jump",
      "  Green bar on bottom-right of screen"
    ]
  } else {
    text = [
      "mouse + keyboard controls",
      "move camera",
      "  mouse",
      "shoot arrow",
      "  Left click (hold -> release)",
      "shoot grapple",
      "  Right click (hold -> release)",
      "move",
      "  WASD",
      "jump",
      "  space",
      "sprint",
      "  Shift"
    ]
  }
  menu.remove(controlsMesh)
  controlsMesh = createTextMesh(text, 0x0974A5)
  controlsMesh.position.y += 13
  controlsMesh.position.x -= 10
  menu.add(controlsMesh)
}
lobby.showControls();
menu.add(controlsMesh)
menu.position.z -= 20
lobby.add(menu)




export default lobby