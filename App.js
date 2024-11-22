import { THREE, OrbitControls } from "./AppImport.js";

class App {
  constructor(vector) {
    this.scene = new THREE.Scene();
    const e = window.innerWidth / window.innerHeight;
    this.camera = new THREE.PerspectiveCamera(70, e, 0.1, 1e3);
    this.camera.position.z = vector.z;
    this.light = null;

    var webRenderer = new THREE.WebGLRenderer({ antialias: !0 });
    this.renderer = webRenderer;
    this.renderer.setSize(window.innerWidth, window.innerHeight);
    this.renderer.setPixelRatio(window.devicePixelRatio);
    // this.control
    this.control = new OrbitControls(this.camera, this.renderer.domElement);
    this.control.enableDamping = true;
    window.addEventListener("resize", () => {
      (this.camera.aspect = window.innerWidth / window.innerHeight),
        this.camera.updateProjectionMatrix(),
        webRenderer.setSize(window.innerWidth, window.innerHeight),
        webRenderer.setPixelRatio(window.devicePixelRatio);
    });
    window.addEventListener("dblclick", () => {
      document.fullscreenElement
        ? document.exitFullscreen()
        : webRenderer.domElement.requestFullscreen();
    });
    document.body.appendChild(this.renderer.domElement);
  }

  addView(object3d) {
    this.scene.add(object3d);
  }

  render() {
    this.renderer.clear();
    this.renderer.render(this.scene, this.camera);
  }

  startAnimation(time) {
    this.renderer.setAnimationLoop((e) => {
      time(e);
      this.control.update();
      this.render();
    });
  }
}

export { THREE, App };
