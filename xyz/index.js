import Controls from './Controls.js';
import View from './View.js';
import XYZObject from './XYZObject.js';


const controls = new Controls();
const view = new View();
const xyzObj = new XYZObject('sample.xyz', obj => {
    view.setObj(obj);
    controls.init(obj.shape.bounds, zoomBounds => {
        view.focus(zoomBounds);
      });
  });

function handleHash() {
  let hash = location.hash.substr(1);
  //console.log('hash arg:', hash)
  //loader.loadPath(hash, onLoadCb, onDoneCb);
}
window.addEventListener('hashchange', handleHash);
handleHash();
