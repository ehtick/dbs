import * as THREE from '../js/lib/three.js/three.module.js';
import { XYZLoader } from '../js/lib/three.js/XYZLoader.js';
import TrackballControls from '../js/lib/three.js/TrackballControls.js';
import { OrbitControls, MapControls } from '../js/lib/three.js/OrbitControls.js';

let renderer, camera, scene, points, controls;

init();

function init() {
  camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 0.1, 1000);
  camera.position.set(0, 0, 50);
  scene = new THREE.Scene();
  scene.add(camera);

  const opts = {
    color: 'green',
    size: 1,
    sizeAttenuation: true,
    depthTest: true,
    transparent: true
  };

  const loader = new XYZLoader();
  loader.load('sample.xyz', geometry => {
      geometry.center();
      const material = new THREE.PointsMaterial(opts);
      points = new THREE.Points(geometry, material);
      points.rotateX(90);
      scene.add(points);
    });

  renderer = new THREE.WebGLRenderer();
  renderer.setPixelRatio(window.devicePixelRatio);
  renderer.setSize(window.innerWidth, window.innerHeight);
  document.body.appendChild(renderer.domElement);

  controls = new TrackballControls(camera, renderer.domElement);
  //controls = new OrbitControls(camera, renderer.domElement);
  controls.noZoom = false;
  controls.noPan = false;
  controls.staticMoving = false;
  controls.dynamicDampingFactor = 0.3;
  //controls.target = scene;
  controls.update();

  window.addEventListener( 'resize', onWindowResize, false);
}


function onWindowResize() {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize( window.innerWidth, window.innerHeight );
}

const clock = new THREE.Clock();
animate();
function animate() {
  requestAnimationFrame( animate );
  controls.update();
  /*
  const delta = clock.getDelta();
  if ( points ) {
    points.rotation.x += delta * 0.2;
    points.rotation.y += delta * 0.5;
    }*/
  renderer.render( scene, camera );
}