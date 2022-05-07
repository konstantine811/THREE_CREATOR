import {
  AfterViewInit,
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
  selector: 'app-particles',
  templateUrl: './particles.component.html',
  styleUrls: ['./particles.component.scss'],
})
export class ParticlesComponent implements OnInit, AfterViewInit {
  @ViewChild('webgl', { static: true }) private webglEl!: ElementRef;
  private scene!: THREE.Scene;
  private renderer!: THREE.WebGLRenderer;
  private camera!: THREE.PerspectiveCamera;
  private gui!: dat.GUI;
  private clock = new THREE.Clock();
  private particles!: THREE.Points;
  private particlesGeometry!: THREE.BufferGeometry;
  private count!: number;

  constructor(
    private initThreeScene: InitThreeSceneService,
    private datGuiService: DatGuiService,
    private textureLoaderService: TextureLoaderService
  ) {}

  @HostListener('window:resize')
  private onRisize() {}

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
    this.addObjects();
    controls.update();
    this.update();
  }

  addLight() {
    const ambientLight = new THREE.AmbientLight(0xffffff, 1);
    this.gui.add(ambientLight, 'intensity', 0, 1, 0.001);
    this.scene.add(ambientLight);
  }

  addObjects() {
    // texture
    const particleTexture =
      this.textureLoaderService.getTextureByPath('/particles/4.png');
    // Particles
    this.particlesGeometry = new THREE.BufferGeometry();
    this.count = 200000;
    const position = new Float32Array(this.count * 3);
    const colors = new Float32Array(this.count * 3);
    for (let i = 0; i < this.count * 3; i++) {
      position[i] = (Math.random() - 0.5) * 400;
      colors[i] = Math.random();
    }
    this.particlesGeometry.setAttribute(
      'position',
      new THREE.BufferAttribute(position, 3)
    );
    this.particlesGeometry.setAttribute(
      'color',
      new THREE.BufferAttribute(colors, 3)
    );
    const particlesMaterial = new THREE.PointsMaterial({
      size: 0.2,
      sizeAttenuation: true,
      // color: new THREE.Color('#ff88cc'),
      transparent: true,
      alphaMap: particleTexture,
      // alphaTest: 0.001,
      // depthTest: false,
      depthWrite: false,
      blending: THREE.AdditiveBlending,
      vertexColors: true,
    });
    this.particles = new THREE.Points(
      this.particlesGeometry,
      particlesMaterial
    );

    this.scene.add(this.particles);
  }

  update() {
    const animSpeed = 0.001;
    this.initThreeScene.animate$.subscribe((res) => {
      const elapsedTime = this.clock.getElapsedTime();
      for (let i = 0; i < this.count; i++) {
        const i3 = i * 3;
        const x = this.particlesGeometry.attributes.position.array[i3];
        (this.particlesGeometry.attributes.position.array[i3 + 1] as number) =
          Math.sin(elapsedTime + x * 100);
        this.particlesGeometry.attributes.position.needsUpdate = true;
      }
      // Update particles
      // this.particles.rotation.y = -elapsedTime * 0.02;
    });
  }

  ngOnInit(): void {}

  ngAfterViewInit(): void {
    this.initScene();
    this.initThreeScene.onResize();
  }
}
