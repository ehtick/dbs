import Testing from '../js/lib/testing.js/testing.js';
import {assertEquals} from '../js/lib/testing.js/testing.js';

import XYZArray from './XYZArray.js';

const tests = new Testing();


function assertArraysEqual(a, b) {
  if (a === b) return true;
  if (a.length !== b.length) return false;
  for (let i = 0; i < a.length; i++) {
    if (a[i] !== b[i]) return false;
  }
  return true;
}


function check(expectX, expectY, arr) {
  console.log('check: ', arr);
  const xyzArr = new XYZArray(arr);
  const [numX, numY] = xyzArr.computeArrayShape();
  assertEquals(expectX, numX);
  assertEquals(expectY, numY);
  const dst = new Array(arr.length);
  dst.fill(0);
  xyzArr.transferXYZ(dst);
  assertArraysEqual(xyzArr.sourceArray, dst);
}


tests.add('findArrayShape rect', () => {
    check(1, 1, [0, 0, 0]);
    check(2, 1, [0, 0, 0,
                 1, 0, 0]);
    check(3, 1, [0, 0, 0,
                 1, 0, 0,
                 2, 0, 0]);
    check(2, 2, [0, 0, 0,
                 1, 0, 0,
                 0, 1, 0,
                 1, 1, 0]);
    check(2, 3, [0, 0, 0,
                 1, 0, 0,
                 0, 1, 0,
                 1, 1, 0,
                 0, 2, 0,
                 1, 2, 0]);
  });


tests.add('findArrayShape sparse', () => {
    check(2, 2, [0, 0, 0,
                 1, 0, 0,
                 0, 1, 0]);
  });


tests.run();
