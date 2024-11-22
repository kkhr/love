/***
 * Bilibili: codeArt
 ***/
import { THREE, Curve } from "./AppImport.js";

export default class HeartCurve extends Curve {
  constructor(scale) {
    super();
    this.scale = scale;
  }
  getPoint(t, optionalTarget = new THREE.Vector3()) {
    const radian = t * Math.PI * 2;
    // const radian = ((t % 360) / 180.0) * Math.PI;
    let tx = 16 * Math.pow(Math.sin(radian), 3);
    let ty = -(
      14 * Math.cos(radian) -
      5 * Math.cos(2 * radian) -
      2 * Math.cos(3 * radian) -
      Math.cos(3 * radian)
    );
    let tz = 0;

    return optionalTarget.set(tx, ty, tz).multiplyScalar(this.scale);
  }
}
