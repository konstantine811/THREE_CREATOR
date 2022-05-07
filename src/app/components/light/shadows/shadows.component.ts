import {
  Component,
  ElementRef,
  HostListener,
  OnInit,
  ViewChild,
} from '@angular/core';
// three libs
import * as THREE from 'three';
import * as dat from 'lil-gui';
// services
import { InitThreeSceneService } from '@app/core/services/init-three-scene.service';
import { DatGuiService } from '@app/core/services/dat-gui/dat-gui.service';
import { TextureLoaderService } from '@app/core/services/loaders/texture-loader.service';

@Component({
  selector: 'app-shadows',
  templateUrl: './shadows.component.html',
  styleUrls: ['./shadows.component.scss'],
})
export class ShadowsComponent implements OnInit {
  @ViewChild('webgl', { static: true }) private webglEl!: ElementRef;
  private scene!: THREE.Scene;
  private renderer!: THREE.WebGLRenderer;
  private camera!: THREE.PerspectiveCamera;
  private gui!: dat.GUI;
  private sphere!: THREE.Mesh;
  private backShadow!: THREE.Texture;
  private simpleShadow!: THREE.Texture;
  private sphereShadow!: THREE.Mesh;
  private clock = new THREE.Clock();

  constructor(
    private initThreeScene: InitThreeSceneService,
    private datGuiService: DatGuiService,
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
    this.renderer.shadowMap.enabled = false;
    this.renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    this.camera.position.set(3.22, 3.38, 4.48);
    this.gui = this.datGuiService.gui;

    // load texture
    this.backShadow = this.textureLoaderService.getTextureByPath(
      '/circle_shadow/bakedShadow.jpg'
    );
    this.simpleShadow = this.textureLoaderService.getTextureByPath(
      '/circle_shadow/simpleShadow.jpg'
    );
    this.addLight();
    this.addObjects();
    controls.update();
    this.update();
  }

  addLight() {
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.3);
    this.gui.add(ambientLight, 'intensity', 0, 1, 0.001);
    this.scene.add(ambientLight);

    // directional light
    const directionalLight = new THREE.DirectionalLight(0xffffff, 0.3);
    directionalLight.position.set(2, 2, -1);
    directionalLight.castShadow = true;
    directionalLight.shadow.mapSize.width = 1024;
    directionalLight.shadow.mapSize.height = 1024;
    directionalLight.shadow.camera.near = 1;
    directionalLight.shadow.camera.far = 6;
    directionalLight.shadow.camera.top = 2;
    directionalLight.shadow.camera.right = 2;
    directionalLight.shadow.camera.left = -2;
    directionalLight.shadow.camera.bottom = -2;
    directionalLight.shadow.radius = 10;

    this.gui.add(directionalLight, 'intensity', 0, 1, 0.001);
    this.datGuiService.addGuiFolderXYZ(
      'Directional position',
      directionalLight.position,
      -5,
      5,
      0.001
    );
    this.scene.add(directionalLight);

    const directionalLightCameraHelper = new THREE.CameraHelper(
      directionalLight.shadow.camera
    );
    directionalLightCameraHelper.visible = false;
    this.gui
      .add(directionalLightCameraHelper, 'visible')
      .name('is visible light direct helper');
    this.scene.add(directionalLightCameraHelper);

    // add spot light
    const spotLight = new THREE.SpotLight(0xffffff, 0.3, 10, Math.PI * 0.3);
    spotLight.castShadow = true;
    spotLight.shadow.mapSize.set(1024, 1024);
    spotLight.shadow.camera.fov = 30;
    spotLight.shadow.camera.near = 1;
    spotLight.shadow.camera.far = 6;

    spotLight.position.set(0, 2, 2);
    this.scene.add(spotLight);
    this.scene.add(spotLight.target);

    const spotLightCameraHelper = new THREE.CameraHelper(
      spotLight.shadow.camera
    );
    spotLightCameraHelper.visible = false;
    this.gui.add(spotLightCameraHelper, 'visible').name('is spotlight helper');
    this.scene.add(spotLightCameraHelper);

    // point light
    const pointLight = new THREE.PointLight(0xffffff, 0.3);
    pointLight.castShadow = true;
    pointLight.position.set(-1, 1, 0);
    this.datGuiService.addGuiFolderXYZ(
      'Point light position',
      pointLight.position
    );
    pointLight.shadow.mapSize.set(1024, 1024);
    pointLight.shadow.camera.near = 0.1;
    pointLight.shadow.camera.far = 5;
    this.scene.add(pointLight);

    const pointLightCameraHelper = new THREE.CameraHelper(
      pointLight.shadow.camera
    );
    pointLightCameraHelper.visible = false;
    this.gui.add(pointLightCameraHelper, 'visible').name('is point light');
    this.scene.add(pointLightCameraHelper);
  }

  addObjects() {
    const material = new THREE.MeshStandardMaterial();
    material.roughness = 0.7;
    this.gui.add(material, 'metalness', 0, 1, 0.001);
    this.gui.add(material, 'roughness', 0, 1, 0.001);
    this.sphere = new THREE.Mesh(
      new THREE.SphereGeometry(0.5, 32, 32),
      material
    );
    this.sphere.castShadow = true;
    this.datGuiService.addGuiFolderXYZ('Sphere position', this.sphere.position);

    const plane = new THREE.Mesh(new THREE.PlaneGeometry(5, 5), material);
    plane.rotation.x = -Math.PI * 0.5;
    plane.position.y = -0.5;
    plane.receiveShadow = true;
    this.scene.add(this.sphere, plane);

    // sphere shadow
    this.sphereShadow = new THREE.Mesh(
      new THREE.PlaneBufferGeometry(1.5, 1.5),
      new THREE.MeshBasicMaterial({
        color: 0x000000,
        transparent: true,
        alphaMap: this.simpleShadow,
      })
    );
    this.sphereShadow.rotation.x = -Math.PI * 0.5;
    this.sphereShadow.position.y = plane.position.y + 0.01;
    this.scene.add(this.sphereShadow);
  }

  update() {
    const animSpeed = 0.001;
    this.initThreeScene.animate$.subscribe((res) => {
      const elapsedTime = this.clock.getElapsedTime();
      this.sphere.position.x = Math.cos(elapsedTime) * 1.5;
      this.sphere.position.z = Math.sin(elapsedTime) * 1.5;
      this.sphere.position.y = Math.abs(Math.sin(elapsedTime * 3));

      // update the shadow
      this.sphereShadow.position.x = Math.cos(elapsedTime) * 1.5;
      this.sphereShadow.position.z = Math.sin(elapsedTime) * 1.5;
      const material = this.sphereShadow.material as THREE.MeshBasicMaterial;
      material.opacity = (1 - this.sphere.position.y) * 0.7;
    });
  }

  ngOnInit(): void {}

  ngAfterViewInit() {
    this.initScene();
  }
}
