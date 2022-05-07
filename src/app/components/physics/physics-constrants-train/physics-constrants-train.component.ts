import { Component, HostListener, OnInit } from '@angular/core';
// libs
import {
  AmmoPhysics,
  ExtendedObject3D,
  PhysicsLoader,
} from '@enable3d/ammo-physics';
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';
import { OBJLoader } from 'three/examples/jsm/loaders/OBJLoader';
import * as dat from 'lil-gui';
import Stats from 'three/examples/jsm/libs/stats.module';
import { FBXLoader } from 'three/examples/jsm/loaders/FBXLoader';
// seriveces
import { InitLightService } from '../services/light/init-light.service';

@Component({
  selector: 'app-physics-constrants-train',
  templateUrl: './physics-constrants-train.component.html',
  styleUrls: ['./physics-constrants-train.component.scss'],
})
export class PhysicsConstrantsTrainComponent implements OnInit {
  private scene!: THREE.Scene;
  private camera!: THREE.PerspectiveCamera;
  private renderer!: THREE.WebGLRenderer;
  private physics!: AmmoPhysics;
  private clock = new THREE.Clock();
  private objLoader!: OBJLoader;
  private fbxLoader!: FBXLoader;
  private gui!: dat.GUI;
  private stats!: Stats;
  private controls!: OrbitControls;
  private isDebug = true;

  constructor(private initLightService: InitLightService) {}

  @HostListener('window:resize')
  onResize() {
    this.camera.aspect = window.innerWidth / window.innerHeight;
    this.camera.updateProjectionMatrix();
    this.renderer.setSize(window.innerWidth, window.innerHeight);
    this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    return {
      width: window.innerWidth,
      height: window.innerHeight,
    };
  }

  initScene = () => {
    // scene
    this.scene = new THREE.Scene();
    this.scene.background = new THREE.Color(0xf0f0f0);

    // camera
    this.camera = new THREE.PerspectiveCamera(
      50,
      window.innerWidth / window.innerHeight,
      0.1,
      1000
    );
    this.camera.position.set(10, 10, 20);
    // renderer
    this.renderer = new THREE.WebGLRenderer();
    this.renderer.setSize(window.innerWidth, window.innerHeight);
    document.body.appendChild(this.renderer.domElement);

    // dpr
    const DPR = window.devicePixelRatio;
    this.renderer.setPixelRatio(Math.min(2, DPR));

    // orbit controls
    this.controls = new OrbitControls(this.camera, this.renderer.domElement);

    // physics
    this.physics = new AmmoPhysics(this.scene);

    // gui
    this.gui = new dat.GUI();
    this.gui
      .add(this, 'isDebug')
      .onChange(() => {
        this.enableDebug();
      })
      .setValue(true);
    const lightFolder = this.gui.addFolder('Light').close();
    // static ground
    this.addGround();
    this.addBox();
    this.gui.add(this, 'addBox');

    this.stats = Stats();

    // add light
    this.initLightService.addAmbientLight(
      this.scene,
      lightFolder,
      '#212121',
      0.19
    );

    this.initLightService.addDirectionalLight(this.scene, lightFolder);
    this.initLightService.addSpotLight(this.scene, lightFolder);
    // this.addHemisphereLight();
    document.body.appendChild(this.stats.dom);

    this.animate();
  };

  enableDebug() {
    if (this.isDebug) {
      this.physics.debug?.enable();
    } else {
      this.physics.debug?.disable();
    }
  }

  addGround() {
    const boxColor = '#a1a1a1';
    const boxGeometry = new THREE.BoxBufferGeometry(200, 200, 1);
    const boxMaterial = new THREE.MeshStandardMaterial({ color: boxColor });
    this.gui
      .addColor({ color: boxColor }, 'color')
      .name('ground color')
      .onChange((colorValue: string) => {
        boxMaterial.color = new THREE.Color(colorValue);
      });
    const mesh = new THREE.Mesh(boxGeometry, boxMaterial);
    const physicsObject = new ExtendedObject3D();
    physicsObject.add(mesh);
    physicsObject.rotateX(Math.PI / 2);
    this.scene.add(physicsObject);
    this.physics.add.existing(physicsObject, {
      collisionFlags: 1,
      shape: 'concave',
      mass: 0,
    });
  }

  addBox() {
    const boxColor = '#ffffff';
    const boxGeometry = new THREE.BoxBufferGeometry(1, 1, 1);
    const boxMaterial = new THREE.MeshStandardMaterial({ color: boxColor });
    const mesh = new THREE.Mesh(boxGeometry, boxMaterial);
    const physicsObject = new ExtendedObject3D();
    physicsObject.add(mesh);
    physicsObject.position.set(0, 10, 0);
    this.scene.add(physicsObject);
    this.physics.add.existing(physicsObject);
  }

  animate = () => {
    requestAnimationFrame(this.animate);
    console.log(this.clock.getDelta());
    this.physics.update(this.clock.getDelta() * 1000);
    this.physics.updateDebugger();
    this.renderer.render(this.scene, this.camera);

    this.stats.update();
  };

  ngOnInit(): void {
    PhysicsLoader('./assets/ammo.js-main/builds', () => this.initScene());
  }
}
