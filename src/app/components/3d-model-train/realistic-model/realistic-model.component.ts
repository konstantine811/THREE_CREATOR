import {
  Component,
  OnInit,
  HostListener,
  ViewChild,
  ElementRef,
  AfterViewInit,
} from '@angular/core';
// three libs
import * as THREE from 'three';
import * as dat from 'lil-gui';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader';
// services
import { InitThreeSceneService } from '@app/core/services/init-three-scene.service';
import { DatGuiService } from '@app/core/services/dat-gui/dat-gui.service';
import { TextureLoaderService } from '@app/core/services/loaders/texture-loader.service';
import { RequestDataService } from '@app/core/services/request-data/request-data.service';

@Component({
  selector: 'app-realistic-model',
  templateUrl: './realistic-model.component.html',
  styleUrls: ['./realistic-model.component.scss'],
})
export class RealisticModelComponent implements OnInit, AfterViewInit {
  @ViewChild('webgl', { static: true }) private webglEl!: ElementRef;
  private scene!: THREE.Scene;
  private renderer!: THREE.WebGLRenderer;
  private camera!: THREE.PerspectiveCamera;
  private gui!: dat.GUI;
  private clock = new THREE.Clock();
  private gltfLoader!: GLTFLoader;
  private environmentMap!: THREE.CubeTexture;
  private debugObject: {
    envMapIntensity: number;
  } = {} as any;

  constructor(
    private initThreeScene: InitThreeSceneService,
    private datGuiService: DatGuiService,
    private textureLoaderService: TextureLoaderService,
    private requestDataService: RequestDataService
  ) {}

  @HostListener('window:resize')
  private onRisize() {
    this.initThreeScene.onResize();
  }

  initScene() {
    const { scene, camera, controls, renderer } = this.initThreeScene.initScene(
      this.webglEl.nativeElement
    );
    this.scene = scene;
    this.camera = camera;

    this.camera.position.set(2, 2, 2);

    controls.enableDamping = true;
    controls.update();

    this.renderer = renderer;

    this.renderer.physicallyCorrectLights = true;
    this.renderer.outputEncoding = THREE.sRGBEncoding;
    this.renderer.toneMapping = THREE.ReinhardToneMapping;
    this.renderer.toneMappingExposure = 2;
    this.gui = this.datGuiService.gui;
    this.gui
      .add(this.renderer, 'toneMappingExposure')
      .min(0.5)
      .max(5)
      .step(0.1);
    this.gui
      .add(this.renderer, 'toneMapping', {
        No: THREE.NoToneMapping,
        Linear: THREE.LinearToneMapping,
        Reinhard: THREE.ReinhardToneMapping,
        Cineon: THREE.CineonToneMapping,
        ACESFilmic: THREE.ACESFilmicToneMapping,
      })
      .onFinishChange(() => {
        this.renderer.toneMapping = Number(this.renderer.toneMapping);
        this.updateAllMaterials();
      });

    this.gltfLoader = new GLTFLoader();

    this.addModel();

    // this.addObject();
    this.addLight();
    this.addGround();
    // add update environments
    this.debugObject.envMapIntensity = 3;
    this.gui
      .add(this.debugObject, 'envMapIntensity')
      .min(0)
      .max(10)
      .onChange(() => {
        this.updateAllMaterials();
      });
    this.addEnvironmentsTexture();
  }

  updateAllMaterials() {
    this.scene.traverse((child) => {
      if (
        child instanceof THREE.Mesh &&
        child.material instanceof THREE.MeshStandardMaterial
      ) {
        // child.material.envMap = this.environmentMap;
        child.material.envMapIntensity = this.debugObject.envMapIntensity;
        child.material.needsUpdate = true;
        child.castShadow = true;
        child.receiveShadow = true;
      }
    });
  }

  addObject() {
    const testSphere = new THREE.Mesh(
      new THREE.SphereBufferGeometry(1, 32, 32),
      new THREE.MeshStandardMaterial()
    );
    this.scene.add(testSphere);
  }

  addGround() {
    const ground = new THREE.Mesh(
      new THREE.PlaneBufferGeometry(100, 100, 1),
      new THREE.MeshStandardMaterial({
        color: new THREE.Color('#111111'),
      })
    );
    ground.position.set(0, -4, 0);
    ground.rotation.x = -Math.PI * 0.5;
    this.scene.add(ground);
  }

  addModel() {
    this.gltfLoader.load(
      'assets/3d/models/FlightHelmet/glTF/FlightHelmet.gltf',
      (model) => {
        model.scene.scale.set(10, 10, 10);
        model.scene.position.set(0, -4, 0);
        model.scene.rotation.y = Math.PI * 0.5;
        this.scene.add(model.scene);

        this.gui
          .add(model.scene.rotation, 'y')
          .min(-Math.PI)
          .max(Math.PI)
          .step(0.001)
          .name('rotation');
        this.updateAllMaterials();
      }
    );
  }

  addEnvironmentsTexture() {
    const cubeTextureLoader = new THREE.CubeTextureLoader();
    const path = '/assets/textures/environmentMaps/0/';
    this.environmentMap = cubeTextureLoader.load([
      `${path}px.jpg`,
      `${path}nx.jpg`,
      `${path}py.jpg`,
      `${path}ny.jpg`,
      `${path}pz.jpg`,
      `${path}nz.jpg`,
    ]);
    this.environmentMap.encoding = THREE.sRGBEncoding;
    this.scene.background = this.environmentMap;
    this.scene.environment = this.environmentMap;
  }

  addLight() {
    const directionalLight = new THREE.DirectionalLight('#ffffff', 3);
    directionalLight.position.set(0.25, 3, -2.25);
    directionalLight.shadow.camera.far = 15;
    directionalLight.shadow.mapSize.set(1024, 1024);
    directionalLight.shadow.normalBias = 0.05;
    const directionalLightHelper = new THREE.CameraHelper(
      directionalLight.shadow.camera
    );
    this.scene.add(directionalLightHelper);
    this.gui
      .add(directionalLight.position, 'x')
      .min(-10)
      .max(10)
      .name('lightX');
    this.gui
      .add(directionalLight.position, 'y')
      .min(-10)
      .max(10)
      .name('lightY');
    this.gui
      .add(directionalLight.position, 'z')
      .min(-10)
      .max(10)
      .name('lightZ');
    this.gui
      .add(directionalLight, 'intensity')
      .min(0)
      .max(10)
      .name('lightIntensity');
    directionalLight.castShadow = true;
    this.scene.add(directionalLight);
  }

  update() {
    let previousTime = 0;
    this.initThreeScene.animate$.subscribe((res) => {
      const elapsedTime = this.clock.getElapsedTime();
      const deltaTime = elapsedTime - previousTime;
      previousTime = elapsedTime;
    });
  }

  ngOnInit(): void {}

  ngAfterViewInit(): void {
    this.initScene();
  }
}
