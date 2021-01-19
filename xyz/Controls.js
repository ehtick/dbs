/**
 * Setup the input sliders and text fields with min/max bounds.
 */
export default class Controls {
  constructor() {}


  init(viewBounds, onZoomChangeCb) {
    this.onZoomChangeCb = onZoomChangeCb;
    const minX = viewBounds[0];
    const minY = viewBounds[1];
    const maxX = viewBounds[2];
    const maxY = viewBounds[3];
    const width = maxX - minX;
    const height = maxY - minY;
    const maxRadius = Math.min(width, height);
    // These max values must be >0 and a number.
    const radiusParams = {
      X: [minX, maxX],
      Y: [minY, maxY],
      Radius: [0, maxRadius]
    };
    this.setupFormControls('radius', radiusParams);

    const boxParams = {
      Xmin: [minX, maxX],
      Ymin: [minY, maxY],
      Xmax: [minX, maxX],
      Ymax: [minY, maxY]
    };
    this.setupFormControls('box', boxParams);
  }


  processBounds(bounds) {
    // TODO: check for 0, safeguard against strings in inputs
    let boxBounds = bounds;
    if (Number.isFinite(bounds.Radius)) {
      const r = parseFloat(bounds.Radius);
      boxBounds = {
        Xmin: bounds.X - r,
        Ymin: bounds.Y - r,
        Xmax: bounds.X + r,
        Ymax: bounds.Y + r
      };
    }
    requestAnimationFrame(() => {
        this.onZoomChangeCb(boxBounds);
      })
  }


  setupFormControls(formName, params) {
    const form = document.forms[formName];
    if (!form) {
      throw new Error(`Form "${form}" not found`);
    }
    const bounds = {};
    for (let propName in params) {
      bounds[propName] = 0;
    }
    form.onSlider = (sliderElt, propName) => {
      const min = params[propName][0];
      const max = params[propName][1];
      const value = min + (sliderElt.value / 100 * (max - min));
      bounds[propName] = parseFloat(form[propName].value = value);
      this.processBounds(bounds);
    }
    form.onInput = (inputElt, propName) => {
      const min = params[propName][0];
      const max = params[propName][1];
      let inVal = parseFloat(clip(min, max, parseFloat(inputElt.value)));
      if (Number.isNaN(inVal)) {
        inputElt.value = '';
        inVal = 0;
      }
      bounds[propName] = inVal;
      //console.log(`inVal(${inVal}, type(${typeof inVal}))`);
      form[propName + '-slider'].value = (inVal - min) / (max - min) * 100;
      this.processBounds(bounds);
    }
    const controlsTable = document.createElement('table');
    const button = form.querySelector('button');
    form.insertBefore(controlsTable, button);
    for (let propName in params) {
      const min = params[propName][0];
      const max = params[propName][1];
      const value = bounds[propName];
      const sliderValue = 0;//value / maxValue * 100;
      //console.log('sliderValue:', sliderValue);
      controlsTable.innerHTML +=
        `<tr>
           <td>${propName}:</td>
           <td>
              <input type="range" min="0" max="100" name="${propName}-slider" value="${sliderValue}"
                  oninput="document.forms['${formName}'].onSlider(this, '${propName}')"/>
              <input name="${propName}" value="${value}"
                  oninput="document.forms['${formName}'].onInput(this, '${propName}')"/>
                               <span class="bounds">[&nbsp;${min}&nbsp;,&nbsp;${max}&nbsp;]</span>
           </td>
         </tr>`;
    }
    button.onclick = () => {
      this.processBounds(bounds);
      return false;
    }
  }
}


function clip(min, max, val) {
  return Math.min(Math.max(val, min), max);
}
