import {
  Component,
  OnInit,
  HostListener,
  ElementRef,
  ViewChild,
  AfterViewInit,
} from '@angular/core';
// three libs
import * as THREE from 'three';
import * as dat from 'lil-gui';
import { gsap } from 'gsap';
// services
import { InitThreeSceneService } from '@app/core/services/init-three-scene.service';
import { DatGuiService } from '@app/core/services/dat-gui/dat-gui.service';
import { TextureLoaderService } from '@app/core/services/loaders/texture-loader.service';
// models
import { IWindowSizes } from '@app/core/models/three-editor.model';

@Component({
  selector: 'app-portfolio',
  templateUrl: './portfolio.component.html',
  styleUrls: ['./portfolio.component.scss'],
})
export class PortfolioComponent implements OnInit, AfterViewInit {
  @ViewChild('webgl', { static: true }) private webglEl!: ElementRef;
  private scene!: THREE.Scene;
  private renderer!: THREE.WebGLRenderer;
  private camera!: THREE.PerspectiveCamera;
  private gui!: dat.GUI;
  private clock = new THREE.Clock();
  private raycaster!: THREE.Raycaster;
  private mouse = new THREE.Vector2();
  private sizes: IWindowSizes = {
    width: window.innerWidth,
    height: window.innerHeight,
  };
  private parameters = {
    materialColor: '#ffeded',
  };
  private gradientTexture!: THREE.Texture;
  private toonMaterial!: THREE.MeshToonMaterial;
  private objectDistance = 4;
  private sectionMeshes!: THREE.Mesh[];
  private scrollY = 0;
  private cursor = {
    x: 0,
    y: 0,
  };
  private cameraGroup!: THREE.Group;
  private previousTime = 0;
  private particalMaterial!: THREE.PointsMaterial;
  private currentSection = 0;
  constructor(
    private initThreeScene: InitThreeSceneService,
    private datGuiService: DatGuiService,
    private textureLoaderService: TextureLoaderService
  ) {}

  @HostListener('window:resize')
  private onRisize() {
    this.sizes = this.initThreeScene.onResize();
  }

  @HostListener('window:scroll')
  private onScroll() {
    this.scrollY = window.scrollY;
    const newSection = Math.round(this.scrollY / this.sizes.height);
    if (newSection !== this.currentSection) {
      this.currentSection = newSection;
      gsap.to(this.sectionMeshes[this.currentSection].rotation, {
        duration: 1.5,
        ease: 'power2.inOut',
        x: '+=6',
        y: '+=3',
        z: '+=1',
      });
    }
  }

  @HostListener('window:mousemove', ['$event'])
  private onMouseMove(event: MouseEvent) {
    this.cursor.x = event.clientX / this.sizes.width - 0.5;
    this.cursor.y = event.clientY / this.sizes.height - 0.5;
  }

  initScene() {
    const { scene, camera, renderer } = this.initThreeScene.initScene(
      this.webglEl.nativeElement,
      true
    );
    this.cameraGroup = new THREE.Group();
    this.scene = scene;
    this.camera = camera;
    this.scene.add(this.cameraGroup);
    this.cameraGroup.add(this.camera);

    this.renderer = renderer;
    this.renderer.shadowMap.enabled = false;
    this.renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    this.camera.position.set(0.14, 0.24, 3);
    this.gui = this.datGuiService.gui;

    this.addLight();
    this.loadTexture();
    this.addObjects();
    this.createParticles();
    this.gui.addColor(this.parameters, 'materialColor').onChange(() => {
      this.toonMaterial.color.set(this.parameters.materialColor);
      this.particalMaterial.color.set(this.parameters.materialColor);
    });
    this.update();
  }

  loadTexture() {
    this.gradientTexture =
      this.textureLoaderService.getTextureByPath('/gradients/3.jpg');
    this.gradientTexture.magFilter = THREE.NearestFilter;
  }

  addLight() {
    /* const ambientLight = new THREE.AmbientLight(0xffffff, 1);
    this.scene.add(ambientLight); */
    const directionalLight = new THREE.DirectionalLight('#ffffff', 1);
    directionalLight.position.set(1, 1, 0);
    this.scene.add(directionalLight);
  }

  addObjects() {
    this.toonMaterial = new THREE.MeshToonMaterial({
      color: this.parameters.materialColor,
      gradientMap: this.gradientTexture,
    });
    const box = new THREE.Mesh(
      new THREE.BoxBufferGeometry(1, 1, 1),
      this.toonMaterial
    );

    const mesh1 = new THREE.Mesh(
      new THREE.TorusGeometry(1, 0.4, 16, 60),
      this.toonMaterial
    );

    const mesh2 = new THREE.Mesh(
      new THREE.ConeGeometry(1, 2, 32),
      this.toonMaterial
    );

    const mesh3 = new THREE.Mesh(
      new THREE.TorusKnotGeometry(0.8, 0.35, 100, 16),
      this.toonMaterial
    );

    mesh1.position.y = -this.objectDistance * 0;
    mesh2.position.y = -this.objectDistance * 1;
    mesh3.position.y = -this.objectDistance * 2;

    mesh1.position.x = 2;
    mesh2.position.x = -2;
    mesh3.position.x = 2;

    this.scene.add(mesh1, mesh2, mesh3);

    this.sectionMeshes = [mesh1, mesh2, mesh3];
  }

  createParticles() {
    const particleCount = 2000;
    const positions = new Float32Array(particleCount * 3);
    for (let i = 0; i < particleCount; i++) {
      positions[i * 3 + 0] = (Math.random() - 0.5) * 50;
      positions[i * 3 + 1] =
        this.objectDistance * 0.4 -
        Math.random() * this.objectDistance * this.sectionMeshes.length;
      positions[i * 3 + 2] = (Math.random() - 0.5) * 50;
    }
    const particleGeometry = new THREE.BufferGeometry();
    particleGeometry.setAttribute(
      'position',
      new THREE.BufferAttribute(positions, 3)
    );

    // Material
    this.particalMaterial = new THREE.PointsMaterial({
      color: this.parameters.materialColor,
      sizeAttenuation: true,
      size: 0.03,
    });

    // Points
    const particles = new THREE.Points(particleGeometry, this.particalMaterial);
    this.scene.add(particles);
  }

  update() {
    this.initThreeScene.animate$.subscribe((res) => {
      const elapsedTime = this.clock.getElapsedTime();
      const deltaTime = elapsedTime - this.previousTime;
      this.previousTime = elapsedTime;
      // camera
      this.camera.position.y =
        (-this.scrollY / this.sizes.height) * this.objectDistance;
      const parallaxX = this.cursor.x;
      const parallaxY = -this.cursor.y;
      this.cameraGroup.position.x +=
        (parallaxX - this.cameraGroup.position.x) * deltaTime;
      this.cameraGroup.position.y +=
        (parallaxY - this.cameraGroup.position.y) * deltaTime;
      for (const mesh of this.sectionMeshes) {
        mesh.rotation.x += deltaTime * 0.1;
        mesh.rotation.y += deltaTime * 0.12;
      }
    });
  }

  ngOnInit(): void {}

  ngAfterViewInit(): void {
    this.initScene();
  }
}
