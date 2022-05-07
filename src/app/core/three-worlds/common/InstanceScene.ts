import { Subscription } from 'rxjs';
// utils
import Sizes from '@core/helpers/utils/Sizes';
import Time from '@core/helpers/utils/Time';
import Debug from '@core/helpers/utils/Debug';
// threejs
import * as THREE from 'three';
// camera
import Camera from '@core/helpers/renderer/Camera';
// renderer
import Renderer from '@core/helpers/renderer/Renderer';
// resources
import Resources from '@core/helpers/utils/Resources';
import { SourcePathData } from '@app/core/models/helpers-code-structuring/source.model';
// scene instance
import SceneBus from '@core/helpers/common/SceneBus';

declare global {
  interface Window {
    experience: any;
  }
}

let instance: InstanceScene;

export default class InstanceScene {
  protected subscription: Subscription = new Subscription();
  canvas!: HTMLCanvasElement;
  scene!: THREE.Scene;
  sizes!: Sizes;
  camera: Camera;
  renderer: Renderer;
  time: Time;
  resources!: Resources;
  debug: Debug;

  constructor(canvas: HTMLCanvasElement, source: SourcePathData[]) {
    const sceneBus = new SceneBus();
    sceneBus.canvas = canvas;
    instance = this;
    // add to global
    window.experience = this;
    // add canvas
    this.canvas = canvas;
    // init canvas size and update
    this.sizes = new Sizes();
    sceneBus.sizes = this.sizes;
    this.debug = new Debug();
    sceneBus.debug = this.debug;
    // init camera scene
    this.scene = new THREE.Scene();
    sceneBus.scene = this.scene;
    this.time = new Time();
    sceneBus.time = this.time;
    this.resources = new Resources(source);
    sceneBus.resources;
    // add camera
    this.camera = new Camera();
    sceneBus.camera = this.camera;
    this.renderer = new Renderer();
    sceneBus.renderer = this.renderer;
    this.onSubscribe();
  }

  onSubscribe() {
    this.subscription.add(this.time.onAnimationFrame$.subscribe(this.update));
  }

  static getInstance() {
    return instance;
  }

  private resize = () => {
    this.camera.resize();
    this.renderer.resize();
  };

  private update = () => {
    this.camera.update();
    this.renderer.update();
  };

  onDestroy() {
    this.sizes.onDestroy();
    this.subscription.unsubscribe();
    this.scene.traverse((child) => {
      if (child instanceof THREE.Mesh) {
        child.geometry.dispose();
        Object.values(child.material).forEach((val) => {
          const value = val as any;
          if (value && typeof value.dispose === 'function') {
            value.dispose();
          }
        });
      }
    });
    this.camera.controls.dispose();
    this.renderer.instance.dispose();
    if (this.debug.active) {
      this.debug.ui.destroy();
    }
  }
}
