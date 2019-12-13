const fs = require('fs');
const THREE = global.THREE = require('three');
global.TextDecoder = require('util').TextDecoder;
global.window = {}
require('three/examples/js/loaders/GLTFLoader.js');

const content = fs.readFileSync('../shared/lowild.glb');
const loader = new THREE.GLTFLoader();

const scene = new THREE.Scene();
loader.parse(trimBuffer(content), '', ( gltf ) => {
  scene.add(gltf.scene)
}, _ => console.log(":)"))

function trimBuffer ( buffer ) {
  const { byteOffset, byteLength } = buffer;
  return buffer.buffer.slice( byteOffset, byteOffset + byteLength );
}

module.exports = scene