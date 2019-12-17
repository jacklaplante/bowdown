import {Geometry, Vector3, LineBasicMaterial, Line} from 'three'

function uuid() {
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
        var r = Math.random() * 16 | 0, v = c == 'x' ? r : (r & 0x3 | 0x8);
        return v.toString(16);
    });
}

function localVector(v, pos, gravityDirection) {
    if (gravityDirection=="down") {
        return v
    } else {
        return pos.normalize().multiplyScalar(v.y)
    }
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

function showSpatialIndexLines(scene) { // if you use this make sure it's up to date with the tool.html
    var indexMod = 5;
    for (var x=0; x < indexMod*2; x++) {
        for (var y=0; y < indexMod*2; y++) {
          for (var z=0; z < indexMod*2; z++) {
            // for (var w=0; w < 10000; w++) {
                var geometry = new Geometry();
                // geometry.vertices.push(new Vector3(), new Vector3(x-indexMod+1/w, y-indexMod+1/w, z-indexMod+1/w).normalize().multiplyScalar(500));
                geometry.vertices.push(new Vector3(), new Vector3(x-indexMod, y-indexMod, z-indexMod).normalize().multiplyScalar(500));
                var material = new LineBasicMaterial({color: 0xff0000});
                var line = new Line( geometry, material )
                scene.add(line)
            // }
          }
        }
      }
}

function getAnimation(gltf, name){
    var result;
    gltf.animations.forEach((animation) => {
        if (animation.name===name) {
            result = animation
            return
        }
    })
    if (result == null) {
        console.error("animation: "+name+" cannot be found!")
    }
    return result
}

function eachDo(o, f) {
    Object.keys(o).forEach((key) => f(key))
}

function getRandom(arr) {
    return arr[Math.floor(Math.random()*arr.length)];
}

export {uuid, addCollisionLine, removeCollisionLines, showSpatialIndexLines, localVector, getAnimation, eachDo, getRandom}