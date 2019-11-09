import {Geometry, LineBasicMaterial, Line, OctahedronGeometry, MeshBasicMaterial, Mesh, Vector3} from 'three'

import scene from './scene'

var kingOfCrownLine, kingOfCrownCube

function updateCrown(player) {
    if (kingOfCrownLine) {
        scene.remove(kingOfCrownLine)
    }
    if (player.kingOfCrown) {
        if (!kingOfCrownCube) {
            var coneGeometry = new OctahedronGeometry(0.5)
            var coneMaterial = new MeshBasicMaterial({color: 0xff5900})
            var cone = new Mesh(coneGeometry, coneMaterial)
            kingOfCrownCube = cone
            scene.add(cone)
        }
        var pos = player.gltf.scene.position.clone()
        var lineGeometry = new Geometry();
        var lineMaterial = new LineBasicMaterial({color: 0xff5900, linewidth: 20});
        lineGeometry.vertices.push(pos.clone().add(pos.clone().normalize().multiplyScalar(2)), pos.clone().multiplyScalar(500));
        var line = new Line(lineGeometry, lineMaterial)
        scene.add(line)
        kingOfCrownLine = line
        kingOfCrownCube.position.copy(pos.clone().normalize().multiplyScalar(pos.length()+2.5))
        kingOfCrownCube.rotation.copy(player.gltf.scene.rotation)
    }
}

export {updateCrown}