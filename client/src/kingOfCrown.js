import {Geometry, LineBasicMaterial, Line, ConeGeometry, MeshBasicMaterial, Mesh} from 'three'

import {scene} from './scene'

function updateCrown(player) {
    if (player.kingOfCrown) {
        if (player.kingOfCrownLine) {
            scene.remove(player.kingOfCrownLine)
        }
        if (!player.kingOfCrownCone) {
            var coneGeometry = new ConeGeometry(0.5, 1, 9)
            var coneMaterial = new MeshBasicMaterial({color: 0xff5900})
            var cone = new Mesh(coneGeometry, coneMaterial)
            player.kingOfCrownCone = cone
            scene.add(cone)
        }
        var pos = player.gltf.scene.position.clone()
        var lineGeometry = new Geometry();
        var lineMaterial = new LineBasicMaterial({color: 0xff5900, linewidth: 20});
        lineGeometry.vertices.push(pos, pos.clone().multiplyScalar(500));
        var line = new Line(lineGeometry, lineMaterial)
        scene.add(line)
        player.kingOfCrownLine = line
        
        player.kingOfCrownCone.position.copy(pos)
        player.kingOfCrownCone.rotation.copy(player.gltf.scene.rotation)
    }
}

export {updateCrown}