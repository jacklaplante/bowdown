import {WebGLRenderer} from 'three' 

// make antialias a setting eventually
var renderer = new WebGLRenderer({ antialias: true, alpha: true });
renderer.setClearColor("#e5e5e5");
if (screen.width < screen.height) {
    renderer.setSize( window.innerHeight, window.innerWidth);
} else {
    renderer.setSize( window.innerWidth, window.innerHeight);
}
renderer.setPixelRatio( window.devicePixelRatio );
renderer.gammaOutput = true;
renderer.gammaFactor = 2.2;

export  {renderer }