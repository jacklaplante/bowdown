import {Geometry, LineBasicMaterial, Line} from 'three'

import {scene} from './scene'

function updateCrown(player) {
    if (player.kingOfCrown) {
        if (player.kingOfCrownPointer) {
            scene.remove(player.kingOfCrownPointer)
        }
        var geometry = new Geometry();
        var material = new LineBasicMaterial({color: 0xfffae8, linewidth: 20});
        var pos = player.gltf.scene.position.clone()
        geometry.vertices.push(pos, pos.clone().multiplyScalar(500));
        var line = new Line(geometry, material)
        scene.add(line)
        player.kingOfCrownPointer = line
    }
}

export {updateCrown}