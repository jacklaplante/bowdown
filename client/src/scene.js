import { Scene, HemisphereLight, DirectionalLight, TextureLoader, MeshBasicMaterial, BoxGeometry, Mesh, BackSide } from 'three'

import { loader } from './loader'
import env from '../models/battle_planet.glb'
import heather_ft from '../skybox/heather_ft.jpg'
import heather_bk from '../skybox/heather_bk.jpg'
import heather_up from '../skybox/heather_up.jpg'
import heather_dn from '../skybox/heather_dn.jpg'
import heather_rt from '../skybox/heather_rt.jpg'
import heather_lf from '../skybox/heather_lf.jpg'

var scene = new Scene();
var collidableEnvironment = []

loader.load(env, function (gltf) {
    var mesh = gltf.scene;
    mesh.position.y -=10
    scene.add(mesh);
    collidableEnvironment.push(mesh)
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
let skyboxGeo = new BoxGeometry(1000, 1000, 1000);
let skybox = new Mesh( skyboxGeo, materialArray );
scene.add( skybox );

scene.add(getHemisphereLight());
scene.add(getDirectionalLight());

function getHemisphereLight() {
    var hemiLight = new HemisphereLight( 0xffffff, 0x9bc9a7 );
    hemiLight.color.setHSL( 0.6, 1, 0.8 );
    hemiLight.groundColor.setHSL( 0.095, 1, 0.75 );
    hemiLight.position.set( 0, 50, 0 );
    hemiLight.visible = true;
    return hemiLight;
}

function getDirectionalLight() {
    var dirLight = new DirectionalLight();
    dirLight.color.setHSL( 0.1, 1, 0.95 );
    dirLight.position.set( - 1, 1.75, 1 );
    dirLight.position.multiplyScalar( 30 );
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

export { scene, collidableEnvironment }