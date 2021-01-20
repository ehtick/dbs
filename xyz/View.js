import * as THREE from '../js/lib/three.js/three.module.js';
import {MapControls} from '../js/lib/three.js/OrbitControls.js';

import Fullscreen from '../js/fullscreen.js';
import XYZObject from './XYZObject.js';


const zoomBoxOpacity = 0.3;

/**
 * Display XYZObject and active section selection.  Defaults to
 * binding DOM elt '#view'.
 */
export default class View extends THREE.Scene {
  constructor(container = document.querySelector('#view')) {
    super();
    if (!container) {
      throw new Error('View container not found');
    }
    this.container = container;
    this.width = container.innerWidth;
    this.height = container.innerHeight;
    this.camera = new THREE.PerspectiveCamera(45, this.width / this.height, 0.1, 1e4);
    this.camera.position.set(0, 3e1, 1.5e2);
    this.add(this.camera);
    this.add(new THREE.AxesHelper);
    this.background = new THREE.Color(0xbfd1e5);
    const light = new THREE.PointLight();
    // TODO: better shadows.
    // https://github.com/mrdoob/three.js/issues/8238
    // https://github.com/mrdoob/three.js/pull/15670
    light.castShadow = true;
    light.intensity = zoomBoxOpacity;
    light.shadow.camera.near = 0.5;
    light.shadow.camera.far = 250;
    light.shadow.camera.width = 256;
    light.shadow.camera.height = 256;
    light.position.set(-5e1, 1e2, -5e1);
    this.add(light);
    this.light = light;
    const shadowLight = light.clone();
    shadowLight.castShadow = false;
    shadowLight.intensity = 1.0 - zoomBoxOpacity;
    this.add(shadowLight);
    this.renderer = new THREE.WebGLRenderer({antialias: true});
    this.renderer.shadowMap.enabled = true;
    //TODO: check about the mobile thing
    //renderer.setPixelRatio(window.devicePixelRatio);
    this.renderer.setSize(this.width, this.height);
    container.appendChild(this.renderer.domElement);
    this.controls = new MapControls(this.camera, this.renderer.domElement);
    this.fs = new Fullscreen(container, () => {
        this.onWindowResize();
      });
    this.onWindowResize();
    this.animate();
    document.view = this;
    this.zoomBox = null;
  }


  displayXYZObject(xyzObj) {
    if (this.xyzObj) {
      this.remove(this.xyzObj);
    }
    this.add(xyzObj);
    this.xyzObj = xyzObj;
    this.light.target = xyzObj;
  }


  focus(zoomBounds) {
    if (zoomBounds == null)
      throw new Error('zoomBounds null');
    const viewBounds = this.xyzObj.children[0].bounds;
    const viewWidth = viewBounds[2] - viewBounds[0];
    const viewDepth = viewBounds[3] - viewBounds[1];
    const xOff = viewBounds[0] - zoomBounds.Xmin;
    const yOff = viewBounds[1] - zoomBounds.Ymin;
    const width = Math.max(1, zoomBounds.Xmax - zoomBounds.Xmin) / 2;
    const height = 20; // TODO: get it from xyz height?
    const depth = Math.max(1, zoomBounds.Ymax - zoomBounds.Ymin) / 2;
    //console.log(`width(${width}) depth(${depth})`, viewBounds, zoomBounds);
    const geometry = new THREE.BoxGeometry(width, height, depth);
    geometry.center();
    const material = new THREE.MeshBasicMaterial({
        color: 0xffffff, transparent: true, opacity: zoomBoxOpacity});
    const box = new THREE.Mesh(geometry, material);
    box.castShadow = true;
    box.receiveShadow = true;
    const wireBox = box.clone();
    wireBox.castShadow = false;
    wireBox.receiveShadow = false;
    wireBox.material = new THREE.MeshBasicMaterial({
        color: 0xccccff, transparent: true, opacity: zoomBoxOpacity, wireframe: true});
    box.add(wireBox);
    if (this.zoomBox) {
      this.remove(this.zoomBox);
    }
    this.add(this.zoomBox = box);
    box.position.x = (viewWidth / -2) - xOff + depth;
    box.position.z = -((viewDepth / -2) - yOff + depth);
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


