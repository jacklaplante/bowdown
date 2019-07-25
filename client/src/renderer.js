import {WebGLRenderer} from 'three' 


export function initRenderer() {
    var renderer = new WebGLRenderer();
    renderer.setClearColor("#e5e5e5");
    renderer.setSize( window.innerWidth, window.innerHeight );
    return renderer;
}