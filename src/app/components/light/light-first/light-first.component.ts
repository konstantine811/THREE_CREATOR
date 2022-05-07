import {
  Component,
  ElementRef,
  HostListener,
  OnInit,
  ViewChild,
} from '@angular/core';
// threejs
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';
import { RectAreaLightHelper } from 'three/examples/jsm/helpers/RectAreaLightHelper';
// dat gui
import * as dat from 'lil-gui';
// services
import { InitThreeSceneService } from '@app/core/services/init-three-scene.service';
import { TextureLoaderService } from '@app/core/services/loaders/texture-loader.service';

@Component({
  selector: 'app-light-first',
  templateUrl: './light-first.component.html',
  styleUrls: ['./light-first.component.scss'],
})
export class LightFirstComponent implements OnInit {
  @ViewChild('webgl', { static: true }) private webglEl!: ElementRef;
  private scene!: THREE.Scene;
  private renderer!: THREE.WebGLRenderer;
  private camera!: THREE.PerspectiveCamera;
  private gui!: dat.GUI;
  private matcapTexture!: THREE.Texture;
  private matcapMaterial!: THREE.MeshMatcapMaterial;
  private sphere!: THREE.Mesh;
  private cube!: THREE.Mesh;
  private torus!: THREE.Mesh;
  private spotLightHelper!: THREE.SpotLightHelper;

  constructor(
    private initThreeScene: InitThreeSceneService,
    private textureLoaderService: TextureLoaderService
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

    this.renderer = renderer;
    this.gui = new dat.GUI();
    this.matcapTexture =
      this.textureLoaderService.getTextureByPath('/matcaps/8.png');
    this.matcapMaterial = new THREE.MeshMatcapMaterial({
      matcap: this.matcapTexture,
    });

    this.addLight();
    this.addObjects();

    this.camera.position.set(3.22, 3.38, 4.48);
    this.addGuiFolderXYZ('Camera rotation', this.camera.position);
    controls.update();
    this.update();
  }

  addLight() {
    const ambientColor = '#ffffff';
    const ambientLight = new THREE.AmbientLight();
    ambientLight.intensity = 0.5;
    ambientLight.color = new THREE.Color(ambientColor);
    this.gui.add(ambientLight, 'intensity', 0, 1, 0.01);
    this.gui
      .addColor({ color: ambientColor }, 'color')
      .onChange((colorValue: string) => {
        ambientLight.color = new THREE.Color(colorValue);
      });
    this.scene.add(ambientLight);

    // directional light
    const directionalColor = '#00fffc';
    const directionalLight = new THREE.DirectionalLight();
    directionalLight.intensity = 0.3;
    directionalLight.color = new THREE.Color(directionalColor);
    const directionFolder = this.gui.addFolder('directional Light');
    directionFolder.add(directionalLight, 'intensity', 0, 1, 0.001);
    directionalLight.position.set(-4.2, 2.7, -0.2);
    this.addGuiFolderXYZ('Directional position', directionalLight.position);
    directionFolder
      .addColor({ color: directionalColor }, 'color')
      .onChange((colorVal: string) => {
        directionalLight.color = new THREE.Color(colorVal);
      });
    this.scene.add(directionalLight);
    const directionalLightHelper = new THREE.DirectionalLightHelper(
      directionalLight,
      0.2
    );
    this.scene.add(directionalLightHelper);

    // hemishpere light
    const hemisphereLight = new THREE.HemisphereLight(0xff0000, 0x0000ff, 0.3);
    hemisphereLight.position.set(-1.1, 2.7, 0.2);
    this.addGuiFolderXYZ('Hemisphere position', hemisphereLight.position);
    const hemishpereLightHelper = new THREE.HemisphereLightHelper(
      hemisphereLight,
      0.2
    );
    this.scene.add(hemishpereLightHelper);
    this.scene.add(hemisphereLight);

    // point light
    const pointLight = new THREE.PointLight(0xff9000, 0.5, 3);
    pointLight.position.set(2.4, 1.1, 3.3);
    this.addGuiFolderXYZ('Point light position', pointLight.position);
    const pointLightHelper = new THREE.PointLightHelper(pointLight);
    this.scene.add(pointLightHelper);
    this.scene.add(pointLight);

    // rect light
    const rectAreaLight = new THREE.RectAreaLight(0x4e00ff, 2, 1, 1);
    const rectAreaLightHelper = new RectAreaLightHelper(rectAreaLight);
    rectAreaLight.position.set(-3.3, 0.7, 3.3);
    rectAreaLight.lookAt(new THREE.Vector3());
    this.scene.add(rectAreaLight);
    this.scene.add(rectAreaLightHelper);
    this.addGuiFolderXYZ('Rect light position', rectAreaLight.position);

    // spot light
    const spotLight = new THREE.SpotLight(
      0x78ff00,
      0.5,
      10,
      Math.PI * 0.1,
      0.25,
      1
    );
    spotLight.position.set(0, 2, 3);
    this.spotLightHelper = new THREE.SpotLightHelper(spotLight, 0.2);
    this.addGuiFolderXYZ('Spot light position', spotLight.position);
    this.scene.add(this.spotLightHelper);
    this.scene.add(spotLight);
  }

  addObjects() {
    const planeGeometry = new THREE.PlaneBufferGeometry(10, 10);
    const material = new THREE.MeshStandardMaterial();
    // material.roughness = 0.4;
    const yPosition = 1.3;

    const plane = new THREE.Mesh(planeGeometry, material);
    plane.rotation.x = -Math.PI * 0.5;
    this.scene.add(plane);

    const sphereGeometry = new THREE.SphereBufferGeometry(1, 50, 50);
    this.sphere = new THREE.Mesh(sphereGeometry, material);
    this.sphere.position.set(-3, yPosition, 0);
    this.scene.add(this.sphere);

    const cubeGeometry = new THREE.BoxBufferGeometry(1.5, 1.5, 1.5);
    this.cube = new THREE.Mesh(cubeGeometry, material);
    this.cube.position.set(0, yPosition, 0);
    this.scene.add(this.cube);

    const torusGeometry = new THREE.TorusGeometry(0.9, 0.3, 30, 30);
    this.torus = new THREE.Mesh(torusGeometry, material);
    this.torus.position.set(3, yPosition, 0);
    this.scene.add(this.torus);
  }

  update() {
    const animSpeed = 0.001;
    this.initThreeScene.animate$.subscribe((res) => {
      this.cube.rotation.x += animSpeed;
      this.cube.rotation.y += animSpeed;

      this.torus.rotation.x += animSpeed;
      this.torus.rotation.y += animSpeed;

      this.spotLightHelper.update();
    });
  }

  addGuiFolderXYZ(
    folderName: string,
    position: THREE.Vector3,
    min = -10,
    max = 10,
    step = 0.1
  ) {
    const cameraGui = this.gui.addFolder(folderName);
    cameraGui.add(position, 'x', min, max, step);
    cameraGui.add(position, 'y', min, max, step);
    cameraGui.add(position, 'z', min, max, step);
  }

  onClick() {
    console.log(this.camera.position);
  }

  ngOnInit(): void {}

  ngAfterViewInit(): void {
    this.initScene();
  }
}
