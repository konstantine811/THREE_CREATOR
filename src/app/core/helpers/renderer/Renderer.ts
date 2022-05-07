import SceneBus from '../common/SceneBus';
import Camera from './Camera';
// utils
import Sizes from '../utils/Sizes';
// threejs
import * as THREE from 'three';

export default class Renderer {
  private sceneBus: SceneBus;
  private sizes: Sizes;
  private scene: THREE.Scene;
  private camera: Camera;
  private canvas: HTMLCanvasElement;
  instance!: THREE.WebGLRenderer;

  constructor() {
    this.sceneBus = SceneBus.getSceneInstance();
    const { sizes, scene, camera, canvas } = this.sceneBus;
    this.canvas = canvas;
    this.sizes = sizes;
    this.scene = scene;
    this.camera = camera;
    this.setInstance();
  }

  private setInstance() {
    this.instance = new THREE.WebGLRenderer({
      canvas: this.canvas,
      antialias: true,
    });

    this.instance.physicallyCorrectLights = true;
    this.instance.outputEncoding = THREE.sRGBEncoding;
    this.instance.toneMapping = THREE.CineonToneMapping;
    this.instance.toneMappingExposure = 1.75;
    this.instance.shadowMap.enabled = true;
    this.instance.shadowMap.type = THREE.PCFSoftShadowMap;
    this.instance.setClearColor('#211d20');
    this.instance.setSize(this.sizes.width, this.sizes.height);
    this.instance.setPixelRatio(this.sizes.pixelRatio);
  }

  resize() {
    this.instance.setSize(this.sizes.width, this.sizes.height);
    this.instance.setPixelRatio(this.sizes.pixelRatio);
  }

  update() {
    this.instance.render(this.scene, this.camera.instance);
  }
}
