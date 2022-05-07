// utils
import Sizes from '../utils/Sizes';
// common
import SceneBus from '../common/SceneBus';
// threejs
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';

export default class Camera {
  private sceneBus: SceneBus;
  private sizes: Sizes;
  private canvas: HTMLCanvasElement;
  private scene: THREE.Scene;
  instance!: THREE.PerspectiveCamera;
  controls!: OrbitControls;

  constructor() {
    this.sceneBus = SceneBus.getSceneInstance();
    const { scene, sizes, canvas } = this.sceneBus;
    this.sizes = sizes;
    this.canvas = canvas;
    this.scene = scene;
    this.setInstance();
    this.setOrbitControls();
  }

  private setInstance() {
    this.instance = new THREE.PerspectiveCamera(
      35,
      this.sizes.width / this.sizes.height,
      0.1,
      1000
    );
    this.instance.position.set(6, 4, 8);
    this.scene.add(this.instance);
  }

  private setOrbitControls() {
    this.controls = new OrbitControls(this.instance, this.canvas);
    this.controls.enableDamping = true;
  }

  resize() {
    this.instance.aspect = this.sizes.width / this.sizes.height;
    this.instance.updateProjectionMatrix();
  }

  update() {
    this.controls.update();
  }
}
