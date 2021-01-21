import Controls from './Controls.js';
import View from './View.js';
import XYZObject from './XYZObject.js';

/** Currently control options are just for display. */
const sources = [{
    displayText: 'Canton Zürich (sample)',
    filename: 'zurich-sample.xyz'
  },
  {
    displayText: 'Test points',
    filename: 'test.xyz'
  }];
const testSources = [sources[0]];
const controls = new Controls(testSources);
const view = new View();
const xyzObj = new XYZObject(testSources[0].filename, obj => {
    view.displayXYZObject(obj);
    controls.setXYZObject(xyzObj);
    controls.init(obj.shape.sourceBounds, obj.shape.viewBounds, zoom => {
        view.focus(zoom);
      });
  });

function handleHash() {
  let hash = location.hash.substr(1);
}
window.addEventListener('hashchange', handleHash);
handleHash();
