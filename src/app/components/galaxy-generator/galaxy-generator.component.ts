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
// services
import { InitThreeSceneService } from '@app/core/services/init-three-scene.service';
import { DatGuiService } from '@app/core/services/dat-gui/dat-gui.service';
import { TextureLoaderService } from '@app/core/services/loaders/texture-loader.service';

@Component({
  selector: 'app-galaxy-generator',
  templateUrl: './galaxy-generator.component.html',
  styleUrls: ['./galaxy-generator.component.scss'],
})
export class GalaxyGeneratorComponent implements OnInit, AfterViewInit {
  @ViewChild('webgl', { static: true }) private webglEl!: ElementRef;
  private scene!: THREE.Scene;
  private renderer!: THREE.WebGLRenderer;
  private camera!: THREE.PerspectiveCamera;
  private gui!: dat.GUI;
  private clock = new THREE.Clock();
  private parameters = {
    count: 100000,
    size: 0.01,
    radius: 5,
    branches: 3,
    spin: 1,
    randomness: 0.2,
    randomnessPower: 3,
    insideColor: '#ff6030',
    outsideColor: '#1b3984',
  };
  // galayx
  private geometry!: THREE.BufferGeometry;
  private pointMaterial!: THREE.PointsMaterial;
  private points!: THREE.Points<THREE.BufferGeometry, THREE.PointsMaterial>;

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

    this.addLight();
    // this.addObjects();
    this.generateGalaxy();
    this.addGui();
    controls.update();
    this.update();
  }

  addLight() {
    const ambientLight = new THREE.AmbientLight(0xffffff, 1);
    this.scene.add(ambientLight);
  }

  addObjects() {
    const box = new THREE.Mesh(
      new THREE.BoxBufferGeometry(1, 1, 1),
      new THREE.MeshBasicMaterial({ color: '#fff' })
    );
    this.scene.add(box);
  }

  generateGalaxy = () => {
    if (this.points) {
      this.geometry.dispose();
      this.pointMaterial.dispose();
      this.scene.remove(this.points);
    }
    this.geometry = new THREE.BufferGeometry();
    const position = new Float32Array(this.parameters.count * 3);
    const colors = new Float32Array(this.parameters.count * 3);
    const colorInside = new THREE.Color(this.parameters.insideColor);
    const colorOutside = new THREE.Color(this.parameters.outsideColor);

    position.forEach((item, index) => {
      const index3 = index * 3;
      // Position
      const radius = Math.random() * this.parameters.radius;

      const mixedColor = colorInside.clone();
      mixedColor.lerp(colorOutside, radius / this.parameters.radius);

      const spinAngle = radius * this.parameters.spin;
      const branchAngle =
        ((index % this.parameters.branches) / this.parameters.branches) *
        Math.PI *
        2;
      const randomX =
        Math.pow(Math.random(), this.parameters.randomnessPower) *
        (Math.random() < 0.5 ? 1 : -1);
      const randomY =
        Math.pow(Math.random(), this.parameters.randomnessPower) *
        (Math.random() < 0.5 ? 1 : -1);
      const randomZ =
        Math.pow(Math.random(), this.parameters.randomnessPower) *
        (Math.random() < 0.5 ? 1 : -1);
      position[index3] = Math.cos(branchAngle + spinAngle) * radius + randomX;
      position[index3 + 1] = randomY;
      position[index3 + 2] =
        Math.sin(branchAngle + spinAngle) * radius + randomZ;

      // Color
      colors[index3] = mixedColor.r;
      colors[index3 + 1] = mixedColor.g;
      colors[index3 + 2] = mixedColor.b;
    });
    this.geometry.setAttribute(
      'position',
      new THREE.BufferAttribute(position, 3)
    );
    this.geometry.setAttribute('color', new THREE.BufferAttribute(colors, 3));

    this.pointMaterial = new THREE.PointsMaterial({
      size: this.parameters.size,
      sizeAttenuation: true,
      depthWrite: false,
      blending: THREE.AdditiveBlending,
      vertexColors: true,
    });
    this.points = new THREE.Points(this.geometry, this.pointMaterial);
    this.scene.add(this.points);
  };

  addGui() {
    // gui
    this.datGuiService.gui
      .add(this.parameters, 'count')
      .min(100)
      .max(1000000)
      .step(100)
      .onFinishChange(this.generateGalaxy);
    this.datGuiService.gui
      .add(this.parameters, 'size')
      .min(0.001)
      .max(0.1)
      .step(0.001)
      .onFinishChange(this.generateGalaxy);

    this.datGuiService.gui
      .add(this.parameters, 'radius')
      .min(0.01)
      .max(20)
      .step(0.01)
      .onFinishChange(this.generateGalaxy);
    this.datGuiService.gui
      .add(this.parameters, 'branches')
      .min(2)
      .max(20)
      .step(1)
      .onFinishChange(this.generateGalaxy);
    this.datGuiService.gui
      .add(this.parameters, 'spin')
      .min(-5)
      .max(5)
      .step(0.001)
      .onFinishChange(this.generateGalaxy);
    this.datGuiService.gui
      .add(this.parameters, 'randomness')
      .min(-5)
      .max(5)
      .step(0.001)
      .onFinishChange(this.generateGalaxy);
    this.datGuiService.gui
      .add(this.parameters, 'randomnessPower')
      .min(1)
      .max(10)
      .step(0.001)
      .onFinishChange(this.generateGalaxy);
    this.datGuiService.gui
      .addColor(this.parameters, 'insideColor')
      .onFinishChange(this.generateGalaxy);
    this.datGuiService.gui
      .addColor(this.parameters, 'outsideColor')
      .onFinishChange(this.generateGalaxy);
  }

  update() {
    this.initThreeScene.animate$.subscribe((res) => {});
  }

  ngOnInit(): void {}

  ngAfterViewInit(): void {
    this.initScene();
  }
}
