import {Geometry, Vector3, LineBasicMaterial, Line, FontLoader, TextGeometry, Mesh, MeshStandardMaterial, Group} from 'three'

import fontJson from '../fonts/rubik.json'

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

const font = new FontLoader().parse(fontJson)
function createTextMesh(lines, color, fontSize, position) {
    let textGroup = new Group()
    var i = 0
    lines.forEach((line) => {
        let geo = new TextGeometry(line, {
            font: font,
            size: fontSize,
            height: 0.1
        });
        let textMesh = new Mesh(geo, new MeshStandardMaterial({color: color}))
        textMesh.position.y -= (i*(fontSize+0.1))
        textGroup.add(textMesh)
        i++
    })
    textGroup.position.copy(position)
    return textGroup
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

function randomVector() {
    let v = new Vector3(Math.random()-0.5, Math.random()-0.5, Math.random()-0.5)
    v.normalize()
    return v
}

function initTouchElements(elements) {
    elements.forEach((element) => {
        var mc = new Hammer.Manager(element, {recognizers:[[Hammer.Pinch, { enable: true }]]})
        if (element.id == "menu-button") {
            mc.add(new Hammer.Tap());
            mc.on("tap", function() {
                pause()
            });
        }
    })
}

export {uuid, addCollisionLine, removeCollisionLines, showSpatialIndexLines, localVector, getAnimation, eachDo, getRandom, initTouchElements, createTextMesh, randomVector}
