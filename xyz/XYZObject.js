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
  }
}


function toShape(geometry) {
  const opts = {
    color: 'green',
    side: THREE.DoubleSide,
    wireframe: false,
    depthTest: true,
    transparent: true,
  };
  geometry.computeBoundingBox();
  const bb = geometry.boundingBox;
  const bounds = [bb.min.x, bb.min.y, bb.max.x, bb.max.y];
  geometry.center();
  //console.log('loaded xyz geometry: ', geometry, bounds);
  const material = new THREE.MeshPhongMaterial(opts);
  const xyzArr = geometry.attributes.position.array;
  // TODO: why are width and height swapped?
  const [height, width] = getDimensions(xyzArr);
  //console.log(`width: ${width}, height: ${height}`);
  const geom2 = new THREE.PlaneBufferGeometry(width, height, width - 1, height - 1);
  const position = geom2.getAttribute('position');
  const vertices = position.array;
  transferZ(xyzArr, vertices);
  const obj = new THREE.Mesh(geom2, material);
  obj.receiveShadow = true;
  //obj.castShadow = true;
  obj.bounds = bounds;
  obj.rotateX(Math.PI / 2);
  return obj;
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


// https://blog.mastermaps.com/2013/10/terrain-building-with-threejs.html
function transferZ(vertsA, vertsB) {
  if (vertsA.length != vertsB.length)
    throw new Error(`vertsA.length: ${vertsA.length} != vertsB.length: ${vertsB.length}`);
  if (vertsA.length % 3 != 0)
    throw new Error('Buffer length must be divisible by 3');
  for (let i = 0; i < vertsA.length; i += 3) {
    const z = vertsA[ i + 2 ];
    vertsB[ i + 2 ] = z;
  }
}
