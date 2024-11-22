/***
 * Bilibili: codeArt
 ***/
import { App, THREE } from "./App.js";
import HeartObject from "./HeartObject.js";
import TextPrimitive from "./TextPrimitive.js";
import SphereObject from "./SphereObject.js";

const app = new App(new THREE.Vector3(0, 0, 40));

const text = new TextPrimitive("Minji&Haerin");
text.onLoad = () => {
  text.geometry.computeBoundingBox();
  const max = text.geometry.boundingBox.max;
  text.position.set(-max.x / 2, -max.y / 2, -1);
  text.material.color = new THREE.Color(250 / 255.0, 179 / 255.0, 205 / 255.0);
};
app.addView(text);

const sphere = new SphereObject();
sphere.translateY(3);
app.addView(sphere);

const innerHeart = new HeartObject(true);
innerHeart.rotateZ(Math.PI);
innerHeart.scale.set(0.8, 0.85, 1);
app.addView(innerHeart);

const outsideHeart = new HeartObject(false);
outsideHeart.rotateZ(Math.PI);
outsideHeart.scale.set(0.95, 1, 1);
app.addView(outsideHeart);

app.startAnimation((time) => {
  if (time % 100) {
    sphere.rotateY(8);
  }

  innerHeart.animate(time);
  innerHeart.geometry.attributes.position.needsUpdate = true;
  outsideHeart.animate(time);
  outsideHeart.geometry.attributes.position.needsUpdate = true;
});

// const loader = new FontLoader();
// let font = undefined;
// loader.load("fonts/optimer_regular.typeface.json", function (response) {
//   // font = response;

//   // const textGeo = new TextGeometry("miao", {
//   //   font: font,
//   //   size: 1,
//   //   height: 1,
//   //   curveSegments: 10,
//   //   bevelEnabled: false,
//   // });
//   // textGeo.computeBoundingBox();

//   // const text = new Mesh(
//   //   textGeo,
//   //   new THREE.MeshBasicMaterial({
//   //     color: new THREE.Color(250 / 255.0, 179 / 255.0, 205 / 255.0),
//   //     transparent: true,
//   //     opacity: 0.75,
//   //   })
//   // );

//   // const max = text.geometry.boundingBox.max;
//   // text.position.set(-max.x / 2, -max.y / 2, -1);
//   // text.material.color = new THREE.Color(250 / 255.0, 179 / 255.0, 205 / 255.0);
// });
