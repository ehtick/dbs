import Controls from './Controls.js';
import View from './View.js';


const controls = new Controls();
const view = new View(document.querySelector('#view'), xyzBounds => {
    //    console.log('xyz bounds: ', xyzBounds);
    controls.init(xyzBounds, zoomBounds => {
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
