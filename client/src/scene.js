import { Scene, HemisphereLight, DirectionalLight, TextureLoader, MeshBasicMaterial, BoxGeometry, Mesh, BackSide } from 'three'

import { loader } from './loader'
import env from '../models/battle_planet.glb'
import yellowcloud_ft from '../skybox/yellowcloud_ft.jpg'
import yellowcloud_bk from '../skybox/yellowcloud_bk.jpg'
import yellowcloud_up from '../skybox/yellowcloud_up.jpg'
import yellowcloud_dn from '../skybox/yellowcloud_dn.jpg'
import yellowcloud_rt from '../skybox/yellowcloud_rt.jpg'
import yellowcloud_lf from '../skybox/yellowcloud_lf.jpg'

var scene = new Scene();
var collidableEnvironment = []

loader.load(env, function (gltf) {
    var mesh = gltf.scene;
    mesh.position.y -=10
    scene.add(mesh);
    collidableEnvironment.push(mesh)
});

let materialArray = [];  
materialArray.push(new MeshBasicMaterial( { map: new TextureLoader().load(yellowcloud_ft) }));
materialArray.push(new MeshBasicMaterial( { map: new TextureLoader().load(yellowcloud_bk) }));
materialArray.push(new MeshBasicMaterial( { map: new TextureLoader().load(yellowcloud_up) }));
materialArray.push(new MeshBasicMaterial( { map: new TextureLoader().load(yellowcloud_dn) }));
materialArray.push(new MeshBasicMaterial( { map: new TextureLoader().load(yellowcloud_rt) }));
materialArray.push(new MeshBasicMaterial( { map: new TextureLoader().load(yellowcloud_lf) }));
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