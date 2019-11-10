import { Scene, HemisphereLight, DirectionalLight, DirectionalLightHelper, TextureLoader, MeshBasicMaterial, BoxGeometry, Mesh, BackSide, Quaternion, Vector3, Raycaster } from 'three'

import { loader } from './loader'
import env from '../models/lowild.glb'
import heather_ft from '../skybox/yellowcloud_ft.jpg'
import heather_bk from '../skybox/yellowcloud_bk.jpg'
import heather_up from '../skybox/yellowcloud_up.jpg'
import heather_dn from '../skybox/yellowcloud_dn.jpg'
import heather_rt from '../skybox/yellowcloud_rt.jpg'
import heather_lf from '../skybox/yellowcloud_lf.jpg'

var scene = new Scene();
scene.loaded = false
var spatialIndex = []
var collidableEnvironment = []
const indexMod = 5 // if you change this you need to change it on the indexer too

loader.load(env, function (gltf) {
    var mesh = gltf.scene;
    mesh.position.y -=10 // if you change this you need to change it on the indexer too
    scene.add(mesh);
    for (var x=0; x < indexMod*2; x++) { // THERE WILL BE OVERLAP
        spatialIndex[x] = []
        for (var y=0; y < indexMod*2; y++) {
            spatialIndex[x][y] = []
            for (var z=0; z < indexMod*2; z++) {
                var dir = new Vector3(x-indexMod, y-indexMod, z-indexMod).normalize()
                var ray = new Raycaster(new Vector3(), dir)
                var collidable = ray.intersectObject(mesh, true)
                // spatialIndex[x][y].push(collidable)
                spatialIndex[x][y][z].push(collidable)
            }
        }
    }
    collidableEnvironment.push(mesh)
    scene.loaded = true
});

let materialArray = [];  
materialArray.push(new MeshBasicMaterial( { map: new TextureLoader().load(heather_ft) }));
materialArray.push(new MeshBasicMaterial( { map: new TextureLoader().load(heather_bk) }));
materialArray.push(new MeshBasicMaterial( { map: new TextureLoader().load(heather_up) }));
materialArray.push(new MeshBasicMaterial( { map: new TextureLoader().load(heather_dn) }));
materialArray.push(new MeshBasicMaterial( { map: new TextureLoader().load(heather_rt) }));
materialArray.push(new MeshBasicMaterial( { map: new TextureLoader().load(heather_lf) }));
for (let i = 0; i < 6; i++)
  materialArray[i].side = BackSide;
let skyboxGeo = new BoxGeometry(5000, 5000, 5000);
let skybox = new Mesh( skyboxGeo, materialArray );
scene.add( skybox );

scene.add(getHemisphereLight());
var directionalLight = getDirectionalLight();
if (process.env.NODE_ENV == 'development') {
    var helper = new DirectionalLightHelper(directionalLight)
    scene.add(helper)
}
scene.add(getDirectionalLight());

scene.animate = function(delta) {
    skybox.applyQuaternion(new Quaternion().setFromAxisAngle(new Vector3(0,1,0), delta/20))
}

scene.getCollidableEnvironment = function(positions) {
    if (positions) {
        var collidable = []
        positions.forEach((position) => {
            var pos = position.clone().normalize().multiplyScalar(indexMod)
            var collisions = spatialIndex[Math.floor(pos.x)+indexMod][Math.floor(pos.y)+indexMod][Math.floor(pos.z)+indexMod]
            collisions.forEach((collision) => {
                collidable.push(collision.object)
            })
        })
        return collidable
    }
    return collidableEnvironment
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