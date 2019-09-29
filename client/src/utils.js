import {Geometry, Vector3, LineBasicMaterial, Line, BoxGeometry, Mesh, MeshBasicMaterial} from 'three'
import {scene} from './scene'

function uuid() {
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
        var r = Math.random() * 16 | 0, v = c == 'x' ? r : (r & 0x3 | 0x8);
        return v.toString(16);
    });
}


const displayCollisionLines = true
const displayCollisionPoint = true

function addCollisionLine(nextPos, vert) {
    if (displayCollisionLines){
        var geometry = new Geometry();
        geometry.vertices.push(nextPos.clone().add(vert), nextPos);
        var material = new LineBasicMaterial({color: 0xff0000});
        var line = new Line( geometry, material )
        line.name = "collision line"
        scene.add(line)
    }
}

function removeCollisionLines(player1) {
    if (displayCollisionLines, displayCollisionPoint){
        scene.children.forEach((child) => {
            if (child.name === "collision line") {
                scene.remove(child)
            }
            if (child.name === "fuck face") {
                scene.remove(child)
            }
        })
    }
}

function showCollisionPoint(point) {
    if (displayCollisionPoint) {
        var geo = new BoxGeometry(0.1, 0.1, 0.1);
        var mat = new MeshBasicMaterial({color: 0x34eb43});
        var collPoint = new Mesh(geo, mat);
        collPoint.name = "fuck face";
        scene.add(collPoint)
        collPoint.position.copy(point)
    }
}

export {uuid, addCollisionLine, removeCollisionLines, showCollisionPoint}