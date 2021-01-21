import Controls from './Controls.js';
import View from './View.js';
import XYZObject from './XYZObject.js';

/** Currently control options are just for display. */
const sources = [{
    displayText: 'Canton Zürich',
    filename: 'zurich-sample.xyz'
  },
  {
    displayText: 'Test points',
    filename: 'test.xyz'
  }];
const controls = new Controls(sources);
const view = new View();
const xyzObj = new XYZObject(sources[0].filename, obj => {
    view.displayXYZObject(obj);
    controls.setXYZObject(xyzObj);
    controls.init(obj.shape.bounds, zoom => {
        view.focus(zoom);
      });
  });

function handleHash() {
  let hash = location.hash.substr(1);
}
window.addEventListener('hashchange', handleHash);
handleHash();
