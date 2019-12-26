import {HemisphereLight, DirectionalLight} from 'three'

function letThereBeLight(scene) {
  var hemiLight = new HemisphereLight( 0xffffff, 0x9bc9a7 );
  hemiLight.color.setHSL( 0.6, 1, 0.8 );
  hemiLight.groundColor.setHSL( 0.095, 1, 0.75 );
  hemiLight.position.set(-690,-450,-240);
  hemiLight.visible = true;
  scene.add(hemiLight);
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
  scene.add(dirLight);
}

export default letThereBeLight