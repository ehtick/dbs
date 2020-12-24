export default class Form {
  constructor(orbitProps) {
    const tau = Math.PI * 2;
    const tauInDeg = 360;
    const elementMaxes = {
      siderealOrbitPeriod: 7.8184256184e9,
      eccentricity: 1,
      inclination: tauInDeg,
      longitudeOfAscendingNode: tauInDeg,
      longitudeOfPericenter: tauInDeg,
      meanLongitude: tauInDeg,
      semiMajorAxis: 5.86966e12,
    };
    document.onSlider = (sliderElt, propName, maxValue) => {
      const value = sliderElt.value / 100 * elementMaxes[propName];
      orbitProps[propName] = document.forms.elts[propName].value = value;
      show(orbitProps);
    }
    document.onInput = (inputElt, propName, ma) => {
      orbitProps[propName] = inputElt.value;
      document.forms.elts[propName + '-slider'].value = inputElt.value / elementMaxes[propName] * 100;
      show(orbitProps);
    }
    propsTable.innerHTML = '';
    for (let propName in elementMaxes) {
      const maxValue = elementMaxes[propName];
      const propsTable = document.getElementById('propsTable');
      const value = orbitProps[propName];
      const sliderValue = value / maxValue * 100;
      propsTable.innerHTML +=
        `<tr>
           <td>${propName}:
           <td><input type="range" min="0" max="100" name="${propName}-slider" value="${sliderValue}"
                  oninput="document.onSlider(this, '${propName}')"/>
           <td><input name="${propName}" value="${value}" oninput="document.onInput(this, '${propName}')"/>
         </tr>`;
    }
  }
}
