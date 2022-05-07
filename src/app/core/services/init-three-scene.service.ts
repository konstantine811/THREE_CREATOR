import { Injectable } from '@angular/core';
import { Observable, ReplaySubject } from 'rxjs';
// threejs
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';
// models
import { IWindowSizes } from '../models/three-editor.model';

@Injectable({
  providedIn: 'root',
})
export class InitThreeSceneService {
  private scene!: THREE.Scene;
  private renderer!: THREE.WebGLRenderer;
  private camera!: THREE.PerspectiveCamera;
  private _animate$: ReplaySubject<null> = new ReplaySubject(1);

  constructor() {}

  get animate$(): Observable<null> {
    return this._animate$;
  }

  onResize(): IWindowSizes {
    this.camera.aspect = window.innerWidth / window.innerHeight;
    this.camera.updateProjectionMatrix();
    this.renderer.setSize(window.innerWidth, window.innerHeight);
    this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    return {
      width: window.innerWidth,
      height: window.innerHeight,
    };
  }

  initScene(el = document.body, transparent = false) {
    this.scene = new THREE.Scene();
    if (!transparent) {
      this.scene.background = new THREE.Color(0x202123);
    }
    this.camera = new THREE.PerspectiveCamera(
      75,
      window.innerWidth / window.innerHeight,
      0.01,
      30000
    );
    this.camera.position.set(0, 1, 100);

    this.renderer = new THREE.WebGLRenderer({
      canvas: el,
      preserveDrawingBuffer: true,
      alpha: transparent,
      antialias: true,
    });
    this.renderer.setSize(window.innerWidth, window.innerHeight);
    this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    this.renderer.shadowMap.enabled = true;
    this.renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    const controls = new OrbitControls(this.camera, this.renderer.domElement);
    this.animate();

    return {
      scene: this.scene,
      renderer: this.renderer,
      camera: this.camera,
      controls,
    };
  }

  private animate = (): void => {
    requestAnimationFrame(this.animate);
    this._animate$.next();
    // rerender
    this.renderer.render(this.scene, this.camera);
  };
}
