import { Scene, HemisphereLight, DirectionalLight, DirectionalLightHelper, TextureLoader, MeshBasicMaterial, BoxGeometry, Mesh, BackSide, Quaternion, Vector3, AxesHelper, MeshStandardMaterial, DoubleSide, Group} from 'three'

import {createTextMesh} from '../utils'

const lobby = new Group()

lobby.platform = new Mesh(new BoxGeometry(500,4,500), new MeshStandardMaterial({color: 0xd1736b, side: DoubleSide}));
lobby.platform.position.y = -5
lobby.add(lobby.platform)
lobby.faceWorldBox = new Mesh(new BoxGeometry(4,4,4), new MeshStandardMaterial({color: 0x030bfc, side: DoubleSide}))
lobby.faceWorldBox.position.z-=5
lobby.faceWorldBox.position.y-=2
lobby.add(lobby.faceWorldBox)
lobby.loadingText = createTextMesh('loading', 0x030bfc)
lobby.loadingText.position.z -= 3
lobby.loadingText.position.x -= 4
lobby.add(lobby.loadingText)


export default lobby