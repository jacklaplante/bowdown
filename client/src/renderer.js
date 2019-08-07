import {WebGLRenderer} from 'three' 

// make antialias a setting eventually
var renderer = new WebGLRenderer({ antialias: true });
renderer.setClearColor("#e5e5e5");
renderer.setPixelRatio( window.devicePixelRatio );
renderer.setSize( window.innerWidth, window.innerHeight );
renderer.gammaOutput = true;
renderer.gammaFactor = 2.2;

export  {renderer }