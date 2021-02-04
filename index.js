import * as Diurnal from './xyz/lib/diurnal.js/diurnal.js';
import {XYZLoader} from './xyz/lib/three.js/XYZLoader.js';

import FileLoaderControl from './xyz/FileLoaderControl.js';
import View from './xyz/View.js';
import XYZObject from './xyz/XYZObject.js';
import {GLTFLoader} from './GLTFLoader.js';


Diurnal.bind();

const view = new View();

const display = geometry => {
  const obj = new XYZObject(geometry);
  view.displayXYZObject(obj);
};

new XYZLoader().load('./xyz/DTM_GRID_XYZ.xyz', display);

const loader = new GLTFLoader().setPath('../ifc/');
loader.load( '2003-ARC-1002-Bauprojekt-210202_Experiment.glb', function(gltf) {
    gltf.scene.traverse(function(child) {
        if (child.isMesh) {
          // TOFIX RoughnessMipmapper seems to be broken with WebGL 2.0
          // roughnessMipmapper.generateMipmaps( child.material );
        }
      });
    view.add(gltf.scene);
  });
