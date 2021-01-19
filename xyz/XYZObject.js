import * as THREE from '../js/lib/three.js/three.module.js';
import {XYZLoader} from '../js/lib/three.js/XYZLoader.js';


/** Scene object to view XYZ file. */
export default class XYZObject extends THREE.Object3D {
  constructor(xyzFilename, cb) {
    super();
    new XYZLoader().load(xyzFilename, geometry => {
        const xyzShape = toShape(geometry);
        this.add(xyzShape);
        this.shape = xyzShape;
        cb(this);
    });
    this.section = null;
  }


  cutSection(xMin, xMax, yMin, yMax) {
    console.log('cutting from shape: ', this.shape.geometry);
    //const section = cutSection(this.shape.geometry.attributes.position.array, xMin, xMax, yMin, yMax);
    const width = xMax - xMin, height = yMax - yMin;
    const secGeom = new THREE.PlaneBufferGeometry(width, height, width - 1, height - 1);
    //const position = secGeom.getAttribute('position');
    //const vertices = position.array;
    /*
    console.log('section:', section);
    transferZ(section, vertices);*/
    const shape = new THREE.Mesh(secGeom, new THREE.MeshPhongMaterial({
          color: 'white',
          wireframe: true,
          side: THREE.DoubleSide,
          transparent: true,
          depthTest: true,
          opacity: 0.5
        }));
    return shape;
  }


  showSection(xMin, xMax, yMin, yMax) {
    if (this.section == null) {
      this.section = this.cutSection(xMin, xMax, yMin, yMax);
    }
    this.add(this.section);
  }
}


function toShape(geometry) {
  geometry.computeBoundingBox();
  const bb = geometry.boundingBox;
  const bounds = [bb.min.x, bb.min.y, bb.max.x, bb.max.y];
  geometry.center();
  const xyzArr = geometry.attributes.position.array;
  let numX = 0;
  let firstY = xyzArr[1]; // TODO: assumes data sorted by Y
  for (let i = 3; i < xyzArr.length; i+=3) {
    const yi = i + 1;
    const y = xyzArr[yi];
    if (y != firstY) {
      numX = i / 3;
      break;
    }
  }
  const numY = xyzArr.length / 3 / numX;
  const [height, width] = getDimensions(xyzArr);
  const geom2 = new THREE.PlaneBufferGeometry(width, height, numX - 1, numY - 1);
  const position = geom2.getAttribute('position');
  const vertices = position.array;
  transferZ(xyzArr, vertices);
  geom2.computeFaceNormals();
  geom2.computeVertexNormals();
  const obj = new THREE.Mesh(geom2, new THREE.MeshPhongMaterial({
    color: 'green', side: THREE.DoubleSide, shininess: 10
  }));
  obj.receiveShadow = true;
  obj.bounds = bounds;
  obj.rotateX(Math.PI / -2);
  return obj;
}


// https://blog.mastermaps.com/2013/10/terrain-building-with-threejs.html
function transferZ(vertsA, vertsB) {
  if (vertsA.length != vertsB.length)
    throw new Error(`vertsA.length: ${vertsA.length} != vertsB.length: ${vertsB.length}`);
  if (vertsA.length % 3 != 0)
    throw new Error('Buffer length must be divisible by 3');
  for (let i = 0; i < vertsA.length; i += 3) {
    const xi = i;
    const yi = i + 1;
    const zi = i + 2;
    vertsB[xi] = vertsA[xi];
    vertsB[yi] = vertsA[yi];
    vertsB[zi] = vertsA[zi];
  }
}


function cutSection(xyz, xMin, xMax, yMin, yMax) {
  if (xyz.length < 3) {
    throw new Error('Empty data');
  }
  const out = [];
  for (let i = 0; i < xyz.length; i+=3) {
    const x = xyz[i];
    const y = xyz[i + 1];
    const z = xyz[i + 2];
    if (x >= xMin && x <= xMax
        && y >= yMin && y <= yMax) {
      out.push(x, y, z);
    }
  }
  return out;
}


function getDimensions(xyz) {
  if (xyz.length < 3) {
    throw new Error('Empty data');
  }
  let width, height;
  let y0 = xyz[1];
  for (let i = 0; i < xyz.length; i+=3) {
    const x = xyz[i];
    const y = xyz[i + 1];
    const z = xyz[i + 2];
    if (y != y0) {
      height = i / 3;
      width = (xyz.length / 3) / height;
      break;
    }
  }
  return [width, height];
}
