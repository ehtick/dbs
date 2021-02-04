import * as Diurnal from './lib/diurnal.js/diurnal.js';
import {XYZLoader} from './lib/three.js/XYZLoader.js';

import FileLoaderControl from './FileLoaderControl.js';
import SelectionControl from './SelectionControl.js';
import View from './View.js';
import XYZObject from './XYZObject.js';


Diurnal.bind();

const view = new View();

const display = geometry => {
  const obj = new XYZObject(geometry);
  view.displayXYZObject(obj);
  new SelectionControl(obj, obj.shape.sourceBounds, obj.shape.viewBounds, zoom => {
      view.focus(zoom);
    });
};

const selectElt = document.querySelector("select[name='sources']");
selectElt.addEventListener('change', () => {
    new XYZLoader().load(selectElt.value, display);
  });
new XYZLoader().load(selectElt.value, display);

const fileLoaderElt = document.getElementById('fileLoader');
const fileCtrl = new FileLoaderControl(fileLoaderElt, loadedXyz => {
    display(new XYZLoader().parse(loadedXyz));
  });


function handleHash() {
  let hash = location.hash.substr(1);
}
window.addEventListener('hashchange', handleHash);
handleHash();

