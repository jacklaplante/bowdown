import {Geometry, Vector3, LineBasicMaterial, Line} from 'three'

function uuid() {
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
        var r = Math.random() * 16 | 0, v = c == 'x' ? r : (r & 0x3 | 0x8);
        return v.toString(16);
    });
}


const displayCollisionLines = false

function addCollisionLine(player1, vert) {
    if (displayCollisionLines){
        var geometry = new Geometry();
        geometry.vertices.push(vert, new Vector3());
        var material = new LineBasicMaterial({color: 0xff0000});
        var line = new Line( geometry, material )
        line.name = "collision line"
        player1.gltf.scene.add(line);
    }
}

function removeCollisionLines(player1) {
    if (displayCollisionLines){
        player1.gltf.scene.children.forEach((child) => {
            if (child.name === "collision line") {
                player1.gltf.scene.remove(child)
            }
        })
    }
}

export {uuid, addCollisionLine, removeCollisionLines}