import { Mesh, TextGeometry, THREE, FontLoader } from "./AppImport.js";
// import font from "./fonts/optimer_bold.typeface.json";

export default class TextPrimitive extends Mesh {
  constructor(text) {
    super();
    const loader = new FontLoader();
    loader.load(
      "fonts/optimer_bold.typeface.json",
      function (response) {
        this.geometry = new TextGeometry(text, {
          font: response,
          size: 1,
          height: 0,
          curveSegments: 5,
          bevelEnabled: true,
          bevelThickness: 0,
          bevelSize: 0,
          bevelSegments: 1,
        });
        this.material = new THREE.MeshBasicMaterial({
          color: 65535,
        });
        this.onLoad();
      }.bind(this)
    );
  }

  onLoad() {}
}
