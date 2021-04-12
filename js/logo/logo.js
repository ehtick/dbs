import View from '@buildrs/xyz/js/index/View.js';
import XYZObject from '@buildrs/xyz/js/index/XYZObject.js';
import * as THREE from 'three';
import {XYZLoader} from 'three/examples/jsm/loaders/XYZLoader.js';
import {GLTFLoader} from 'three/examples/jsm/loaders/GLTFLoader.js';
import {DRACOLoader} from 'three/examples/jsm/loaders/DRACOLoader.js';


const r = 20, TAU = 2.0 * Math.PI, START = Date.now(), PRE_ROT = Math.PI / 2;
let view;
function setupView(elt) {
  console.log('logo.js#setupView in container: ', elt);
  view = new View(elt, v => {
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
}


function showName(name, fontPath) {
  console.log('logo.js#showName');
  new THREE.FontLoader().load(fontPath, font => {
    console.log('logo.js#showName, got font: ', font);
    const geometry = new THREE.TextGeometry(name, {
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
}


function showLawn(path) {
  console.log('logo.js#showLawn');
  new XYZLoader().load(path, geometry => {
    console.log('logo.js#showLawn, got geometry:', geometry);
    const obj = new XYZObject(geometry, false);
    view.displayXYZObject(obj);
  }, undefined, onErr);
}


function onErr(error) {
  console.error('Error loading: ', error);
}


function loadTree(path, loader) {
  console.log('logo.js#loadTree');
  loader.load(path, gltf => {
    console.log('logo.js#loadTree, got gltf:', gltf);
    const scene = gltf.scene;
    scene.position.x = 5;
    scene.traverse(child => {
        if (typeof child.castShadow == 'boolean') {
          child.castShadow = true;
        }});
    view.add(scene);
  }, undefined, onErr);
}


function loadHouse(path, loader) {
  const houseXOffset = -10;
  const loadRedCarpet = () => {
    const carpet = new THREE.Mesh(
      new THREE.BoxGeometry(1, 0.05, 21),
      new THREE.MeshBasicMaterial({color: 0xff0000}));
    carpet.position.x = houseXOffset / 3.8;
    carpet.position.z = 13.5;
    view.add(carpet);
  };

  loader.load(path, gltf => {
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
}


export default function loadLogo(elt) {

  const prefix = './data';
  const font = prefix + '/fonts/helvetiker_regular.typeface.json';
  const lawnXyz = prefix + '/lawn.xyz';
  const treeModel = prefix + '/maple_tree/tree.glb';
  const houseModel = prefix + '/small_house/scene.gltf';

  setupView(elt);
  showName('buildrs', font);
  showLawn(lawnXyz);

  const loader = new GLTFLoader();
  const dracoLoader = new DRACOLoader();
  //dracoLoader.setDecoderPath(prefix + '/');
  loader.setDRACOLoader(dracoLoader);
  loadTree(treeModel, loader);
  loadHouse(houseModel, loader);
};

