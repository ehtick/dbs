export default class XYZArray {
  constructor(sourceArray) {
    if (sourceArray.length < 3 || sourceArray.length % 3 != 0) {
      throw new Error('Source array length must be mulitples of 3 and >= 3, but is: ' + sourceArray.length);
    }
    this.sourceArray = sourceArray;
  }


  computeArrayShape() {
    const src = this.sourceArray;
    const numPoints = src.length / 3;
    let lastY = src[1]; // TODO: assumes data sorted by Y
    let first = true, numX = numPoints, numY = 1;
    // First, scan the array to see what the X dimension is from the
    // first column.
    for (let i = 3; i < src.length; i += 3) {
      const y = src[i + 1];
      if (y != lastY) {
        numX = i / 3;
        numY = numPoints / numX;
        break;
      }
    }
    console.log(`after scan numX:${numX} numY:${numY}`);
    if (true) {
      return [numX, numY];
    }
    // Now, find bounding box.
    let minX = Infinity, minY = Infinity, maxX = -Infinity, maxY = -Infinity;
    for (let i = 0; i < src.length; i += 3) {
      const x = src[i];
      const y = src[i + 1];
      minX = Math.min(minX, x);
      minY = Math.min(minY, y);
      maxX = Math.max(maxX, x);
      maxY = Math.max(maxY, y);
    }
    if (minX == Infinity || minY == Infinity || maxX == -Infinity || maxY == -Infinity) {
      throw new Error(`Unbounded data in array: minX:${minX} minY:${minY} maxX:${maxX} maxY:${maxY}`);
    }
    console.log(`bounds minX:${minX} minY:${minY} maxX:${maxX} maxY:${maxY}`);

    for (let i = 3; i < src.length; i += 3) {
      const y = src[i + 1];
      if (y != lastY) {
        if (first) {
          first = false;
          numX = i / 3;
          numY = numPoints / numX;
        } else {
          const newNumX = i / 3;
          const newNumY = numPoints / numX;
          if (newNumX != numX)
            console.log(`i:${i} newNumX:${newNumX} != numX:${numX}`);
          if (newNumY != numY)
            console.log(`$:${i} newNumY:${newNumY} != numX:${numY}`);
          //this.fixupArray(src, numX, numY, newNumX, newNumY);
          throw new Error('Sparse data');
        }
      }
    }
    console.log(`numX:${numX} numY:${numY}`);
    return [numX, numY];
  }


  fixupArray(arr, offset, numX, numY, curNumX, curNumY) {
    const toInsert = new Float32Array(3 * 1);
    arr.splice(offset, 0, ...toInsert);
  }


  transferXYZ(dst) {
    const src = this.sourceArray;
    //if (dst.length != src.length) {
    //  throw new Error('dst.length != src.length');
    //}
    let y0 = src[1];
    let yCount = 0;
    for (let i = 0; i < src.length && i < dst.length; i += 3) {
      yCount++;
      const xi = i;
      const yi = i + 1;
      const zi = i + 2;
      const x = src[xi];
      const y = src[yi];
      const z = src[zi];
      if (y != y0) {
        console.log('found new y at yCount:' + yCount);
        yCount = 0;
        y0 = y;
      }
      dst[xi] = src[xi];
      dst[yi] = src[yi];
      dst[zi] = src[zi];
    }
  }
}
