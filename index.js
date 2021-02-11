import * as Diurnal from './xyz/lib/diurnal.js/diurnal.js';
import * as THREE from './xyz/lib/three.js/three.module.js';
import {XYZLoader} from './xyz/lib/three.js/XYZLoader.js';

import FileLoaderControl from './xyz/FileLoaderControl.js';
import View from './xyz/View.js';
import XYZObject from './xyz/XYZObject.js';
import {GLTFLoader} from './GLTFLoader.js';


Diurnal.bind();

const r = 20, TAU = 2.0 * Math.PI, START = Date.now(), PRE_ROT = Math.PI / 2;
const view = new View(document.querySelector('#view'), (v) => {
    const time = (Date.now() - START) / 20000;
    const x = r * Math.cos(time * TAU - PRE_ROT);
    const y = 20;
    const z = r * Math.sin(time * TAU - PRE_ROT);
    //console.log(`x:${x} y:${y} z:${z}`);
    v.light.position.set(x, 20, z);
  });
view.camera.position.set(0, 10, 30);
view.light.add(new THREE.AxesHelper);
view.add(new THREE.AmbientLight(0x333333));


const fontLoader = new THREE.FontLoader();
fontLoader.load('fonts/helvetiker_regular.typeface.json', font => {
    const geometry = new THREE.TextGeometry( 'buildrs', {
        font: font,
        size: 10,
        height: 5,
        curveSegments: 3,
        bevelEnabled: true,
        bevelThickness: 1,
        bevelSize: 1,
	bevelOffset: -0.5,
        bevelSegments: 2
      });
    const buildrs = new THREE.Mesh(geometry, new THREE.MeshPhongMaterial({
        color: 0xabcdef, shininess: 10, wireframe: false
      }));
    buildrs.position.x = -20;
    buildrs.position.z = -20;
    view.add(buildrs);
  });


const display = geometry => {
  const obj = new XYZObject(geometry, false);
  view.displayXYZObject(obj);
};

new XYZLoader().load('./lawn.xyz', display);

const onErr = error => {
  console.error('Error loading: ', error);
};

const loader = new GLTFLoader();

const houseXOffset = -10;
const loadRedCarpet = () => {
  const carpet = new THREE.Mesh(
      new THREE.BoxGeometry(1, 0.05, 21),
      new THREE.MeshBasicMaterial({color: 0xff0000}));
  carpet.position.x = houseXOffset / 3.8;
  carpet.position.z = 13.5;
  view.add(carpet);
};


const loadHouse = () => {
  loader.load('./small_house/scene.gltf', gltf => {
    const scene = gltf.scene;
    window.house = scene;
    scene.position.x = houseXOffset;
    scene.position.y = 4;
    scene.traverse(child => {
        if (child.material) {
          child.material.wireframe = true;
        }
        if (typeof child.castShadow == 'boolean') {
          child.castShadow = true;
          child.receiveShadow = false;
        }});
    view.add(scene);
    setTimeout(loadRedCarpet, 2000);
  }, undefined, onErr);
};

const loadTree = () => {
  loader.load('./maple_tree/tree.glb', gltf => {
    const scene = gltf.scene;
    scene.position.x = 5;
    scene.traverse(child => {
        if (typeof child.castShadow == 'boolean') {
          child.castShadow = true;
        }});
    view.add(scene);
    setTimeout(loadHouse, 3000);
  }, undefined, onErr);
};
loadTree();
