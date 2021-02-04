import * as THREE from './lib/three.js/three.module.js';
import XYZArray from './XYZArray.js';


/** Scene object to view XYZ file. */
export default class XYZObject extends THREE.Object3D {
  constructor(geometry) {
    super();
    this.origArr = [...geometry.attributes.position.array];
    this.srcArr = new XYZArray(this.origArr);
    const sourceBounds = new THREE.Box3;
    geometry.computeBoundingBox();
    sourceBounds.copy(geometry.boundingBox);
    this.shape = toPointsShape(this.srcArr.sourceArray, sourceBounds);
    this.add(this.shape);
  }


  extractSectionAsXYZ(s) {
    const arr = this.origArr;
    const lines = [`# ${new Date()}, exported from XYZ tool`];
    for (let i = 0; i < arr.length; i += 3) {
      const x = arr[i], y = arr[i + 1], z = arr[i + 2];
      //console.log(`evaling: ${x} ${y} ${z}`);
      if (x < s.Xmin || y < s.Ymin || x > s.Xmax || y > s.Ymax) {
        continue;
      }
      lines.push(`${x} ${y} ${z}`);
    }
    lines.push('');
    return lines.join('\n');
  }


  showSection(xMin, xMax, yMin, yMax) {
    if (this.section == null) {
      this.section = this.cutSection(xMin, xMax, yMin, yMax);
    }
    this.add(this.section);
  }
}


function toPointsShape(xyzArr, sourceBounds) {
  const numPoints = xyzArr.length / 3;
  const coords = new Float32Array(xyzArr.length);
  const colors = new Float32Array(xyzArr.length);
  const sizes = new Float32Array(numPoints);
  for (let i = 0; i < xyzArr.length; i += 3) {
    const xi = i, yi = i + 1, zi = i + 2;
    coords[xi] = xyzArr[xi];
    coords[yi] = xyzArr[yi];
    coords[zi] = xyzArr[zi];
    colors[yi] = 0xff;
    sizes[i / 3] = 1;
  }
  const geom = new THREE.BufferGeometry();
  geom.setAttribute('position', new THREE.BufferAttribute(coords, 3));
  //geom.setAttribute('color', new THREE.BufferAttribute(colors, 3));
  geom.setAttribute('size', new THREE.BufferAttribute(sizes, 1));
  geom.computeBoundingBox();
  geom.center();
  const groundMaterial = new THREE.PointsMaterial({
    color: 0x008800,
    sizeAttenuation: false,
    size: 1
  });
  const groundPoints = new THREE.Points(geom, groundMaterial);
  groundPoints.sortParticles = true;
  groundPoints.sourceBounds = sourceBounds;
  groundPoints.viewBounds = geom.boundingBox;
  groundPoints.rotateX(Math.PI / -2);
  return groundPoints;
}


function toShape(xyzArr, sourceBounds) {
  const [numX, numY] = xyzArr.computeArrayShape();
  //console.log(`numX:${numX} numY:${numY}`);
  const geom2 = new THREE.PlaneBufferGeometry(numX, numY, numX - 1, numY - 1);
  const position = geom2.getAttribute('position');
  const vertices = position.array;
  // TODO: there's probably methods in Geometry to do this.
  xyzArr.transferXYZ(vertices);
  geom2.center();
  geom2.computeBoundingBox();
  geom2.computeFaceNormals();
  geom2.computeVertexNormals();
  const obj = new THREE.Mesh(geom2, new THREE.MeshPhongMaterial({
    color: 'green', side: THREE.DoubleSide, shininess: 10, wireframe: false
  }));
  obj.receiveShadow = true;
  obj.sourceBounds = sourceBounds;
  obj.viewBounds = geom2.boundingBox;
  obj.rotateX(Math.PI / -2);
  return obj;
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
