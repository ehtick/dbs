import * as THREE from '../js/lib/three.js/three.module.js';
import { MapControls } from '../js/lib/three.js/OrbitControls.js';
import Fullscreen from '../js/fullscreen.js';

import XYZObject from './XYZObject.js';


export default class View extends THREE.Scene {
  constructor(container, xyzLoadCb) {
    super();
    this.container = container;
    this.width = container.innerWidth;
    this.height = container.innerHeight;
    this.camera = new THREE.PerspectiveCamera(45, this.width / this.height, 0.1, 1e4);
    this.camera.position.set(0, 3e1, 1.5e2);
    this.add(this.camera);
    this.add(new THREE.AxesHelper);
    this.background = new THREE.Color(0xbfd1e5);
    const light = new THREE.PointLight();
    light.castShadow = true;
    light.shadow.mapSize.width = 512; // default
    light.shadow.mapSize.height = 512; // default
    light.shadow.camera.near = 0.5; // default
    light.shadow.camera.far = 500; // default
    light.position.set(-1e2, 1e2, 1e2);
    document.light = light;
    this.add(light);
    this.xyz = new XYZObject('sample.xyz', xyzLoadCb);
    this.add(this.xyz);
    this.renderer = new THREE.WebGLRenderer();
    this.renderer.shadowMap.enabled = true;
    this.renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    //TODO: check about the mobile thing
    //renderer.setPixelRatio(window.devicePixelRatio);
    this.renderer.setSize(this.width, this.height);
    container.appendChild(this.renderer.domElement);
    this.controls = new MapControls(this.camera, this.renderer.domElement);
    this.fs = new Fullscreen(container, () => {
        this.onWindowResize();
      });
    //window.addEventListener('resize', onWindowResize, false);
    this.onWindowResize();
    this.animate();
    document.view = this;
    this.zoomBox = null;
  }


  focus(zoomBounds) {
    const width = Math.max(1, zoomBounds.Xmax - zoomBounds.Xmin);
    const height = 20; // TODO: get it from xyz height
    const depth = Math.max(1, zoomBounds.Ymax - zoomBounds.Ymin);
    //console.log(`width(${width}) height(${height}) depth(${depth})`, zoomBounds);
    const geometry = new THREE.BoxGeometry(width, height, depth);
    const material = new THREE.MeshBasicMaterial({color: 0x00ff00, transparent: true, opacity: 0.3});
    const mesh = new THREE.Mesh(geometry, material);
    mesh.castShadow = true;
    //mesh.receiveShadow = true;
    const viewBounds = this.xyz.children[0].bounds;
    const xOff = zoomBounds.Xmin - viewBounds[0];
    const yOff = zoomBounds.Ymin - viewBounds[1];
    mesh.position.x = xOff;
    mesh.position.z = yOff;
    //console.log(xOff, yOff, viewBounds, zoomBounds);
    if (this.zoomBox) {
      this.remove(this.zoomBox);
    }
    this.add(mesh);
    this.zoomBox = mesh;
  }


  animate() {
    this.controls.update();
    this.renderer.render(this, this.camera);
    requestAnimationFrame(() => {
        this.animate();
      });
  }


  onWindowResize() {
    if (this.fs.isFullscreen()) {
      this.width = window.innerWidth;
      this.height = window.innerHeight;
    } else {
      this.width = this.container.offsetWidth;
      this.height = this.container.offsetHeight;
    }
    this.camera.aspect = this.width / this.height;
    this.camera.updateProjectionMatrix();
    this.renderer.setSize(this.width, this.height);
  }
}


