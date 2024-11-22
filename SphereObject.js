import { Color, PointsMaterial } from "three";
import { SphereGeometry, Points } from "./AppImport.js";

export default class SphereObject extends Points {
  constructor() {
    super();
    const sphere = new SphereGeometry(30, 65, 66);
    const material = new PointsMaterial({
      transparent: true,
      size: 0.3,
      color: new Color(250 / 255, 155 / 255, 190 / 255),
      sizeAttenuation: true,
    });
    this.geometry = sphere;
    this.material = material;
    this.scale.set(1, 0.05, 1);
    this.translateY(-20);
  }
}
