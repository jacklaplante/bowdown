import { Scene, HemisphereLight, DirectionalLight, DirectionalLightHelper, TextureLoader, MeshBasicMaterial, BoxGeometry, Mesh, BackSide, Quaternion, Vector3, AxesHelper, MeshStandardMaterial, DoubleSide} from 'three'

import { loader } from './loader'
import {connectToServer} from './websocket'

import spatialIndex from '../spatialIndex.json'

// const maps = require.context('../models/maps');

var scene = new Scene();
scene.loaded = false
var collidableEnvironment = []
const indexMod = 5 // if you change this you need to change it on the indexer too
var objects = {}

scene.triggers = []
let mesh = new Mesh(new BoxGeometry(20,4,20), new MeshStandardMaterial({color: 0x0bb09d, side: DoubleSide}));
mesh.position.y = -5
scene.add(mesh)
collidableEnvironment = [mesh]
scene.loaded = true
scene.gravityDirection = "down"
let faceWorldBox = new Mesh(new BoxGeometry(2,2,2), new MeshStandardMaterial({color: 0x030bfc, side: DoubleSide}))
faceWorldBox.position.z-=5
scene.triggers.push(faceWorldBox)
scene.add(faceWorldBox)
import(/* webpackMode: "lazy" */ '../models/maps/lowild.glb').then( file => {
    var lowild
    loader.load(file.default, (gltf) => {
        lowild = gltf.scene;
        lowild.children.forEach((child) => {
            if (objects[child.name]) throw "all object names bust be unique"
            objects[child.name] = child
        })
    })
    faceWorldBox.material.color.set(0x34eb58)
    faceWorldBox.trigger = function() {
        scene.add(lowild)        
        scene.gravityDirection = "center"
        collidableEnvironment = [lowild]
        scene.loadSkyBox()
        if (process.env.NODE_ENV == 'development') {
            connectToServer("ws://localhost:18181")
        } else {
            connectToServer("wss://ws.bowdown.io:18181")
        }
    }
})

scene.loadMap = function(map, gravityDirection) {
    scene.gravityDirection = gravityDirection
    loadingIndicator.add()
    loader.load(map, function (gltf) {
        loadingIndicator.remove()
        var mesh = gltf.scene;
        mesh.children.forEach((child) => {
            if (objects[child.name]) throw "all object names bust be unique"
            objects[child.name] = child
        })
        scene.add(mesh);
        collidableEnvironment = [mesh]
        scene.loaded = true
    }, function(bytes) {
        loadingIndicator.update(Math.round((bytes.loaded / bytes.total)*100) + "%")
    });
}

const loadingIndicator = {
    add: function() {
        var indicator = document.createElement("p")
        indicator.innerText = "loading map"
        indicator.id = "loading-indicator"
        document.body.append(indicator);
    },
    remove: function() {
        var indicator = document.getElementById("loading-indicator")
        if (indicator) {
            document.getElementById("loading-indicator").remove()
        }
    },
    update: function(percentString) {
        var indicator = document.getElementById("loading-indicator")
        if (indicator) {
            indicator.innerText = percentString
        }
    }
}

scene.loadSkyBox = function() {
    var materialArray = [];  
    ["ft", "bk", "up", "dn", "rt", "lf"].forEach((face) => {
        import(/* webpackMode: "lazy-once" */ `../skybox/bluecloud_${face}.jpg`).then(image => {
            let mat = new MeshBasicMaterial( { map: new TextureLoader().load(image.default) });
            mat.side = BackSide;
            materialArray.push(mat);
            if (materialArray.length == 6 && skybox == null) {
                for (let i = 0; i < 6; i++)
                    materialArray[i].side = BackSide;
                let skyboxGeo = new BoxGeometry(5000, 5000, 5000);
                skybox = new Mesh( skyboxGeo, materialArray );
                scene.add( skybox );
            }
        })
    })
}

scene.add(getHemisphereLight());
var directionalLight = getDirectionalLight();
if (process.env.NODE_ENV == 'development') {
    var lightHelper = new DirectionalLightHelper(directionalLight)
    scene.add(lightHelper)
    var axesHelper = new AxesHelper(5);
    scene.add(axesHelper)
}
scene.add(getDirectionalLight());

var skybox
scene.animate = function(delta) {
    if (skybox) {
        skybox.applyQuaternion(new Quaternion().setFromAxisAngle(new Vector3(0,1,0), delta/20))
    }
}

scene.getCollidableEnvironment = function(positions) {
    if (!scene.loaded) return []
    if (this.gravityDirection == "down") { // create spatial index for garden
        return collidableEnvironment
    }
    var collidable = []
    if (positions) {
        positions.forEach((position) => {
            var pos = position.clone().normalize().multiplyScalar(indexMod)
            var collisions = spatialIndex[Math.floor(pos.x)+indexMod][Math.floor(pos.y)+indexMod][Math.floor(pos.z)+indexMod]
            collisions.forEach((collision) => {
                if (objects[collision]) {
                    collidable.push(objects[collision])
                } else {
                    console.error(collision + " not found in objects, you need to recreate the spatialIndex")
                }
            })
        })
    }
    if (collidable.length == 0) {
        console.warn("detecting collisions against the entire world")
        collidable = collidableEnvironment
    }
    return collidable
}

function getHemisphereLight() {
    var hemiLight = new HemisphereLight( 0xffffff, 0x9bc9a7 );
    hemiLight.color.setHSL( 0.6, 1, 0.8 );
    hemiLight.groundColor.setHSL( 0.095, 1, 0.75 );
    hemiLight.position.set(-690,-450,-240);
    hemiLight.visible = true;
    return hemiLight;
}

function getDirectionalLight() {
    var dirLight = new DirectionalLight(0xffffff, 3);
    dirLight.color.setHSL( 0.1, 1, 0.95 );
    dirLight.position.set(230,150,80);
    dirLight.castShadow = true;
    dirLight.shadow.mapSize.width = 2048;
    dirLight.shadow.mapSize.height = 2048;
    var d = 50;
    dirLight.shadow.camera.left = - d;
    dirLight.shadow.camera.right = d;
    dirLight.shadow.camera.top = d;
    dirLight.shadow.camera.bottom = - d;
    dirLight.shadow.camera.far = 3500;
    dirLight.shadow.bias = - 0.0001;
    dirLight.visible = true;
    return dirLight;
}

export default scene