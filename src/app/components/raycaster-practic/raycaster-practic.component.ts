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
// models
import { IWindowSizes } from '@app/core/models/three-editor.model';
@Component({
  selector: 'app-raycaster-practic',
  templateUrl: './raycaster-practic.component.html',
  styleUrls: ['./raycaster-practic.component.scss'],
})
export class RaycasterPracticComponent implements OnInit, AfterViewInit {
  @ViewChild('webgl', { static: true }) private webglEl!: ElementRef;
  private scene!: THREE.Scene;
  private renderer!: THREE.WebGLRenderer;
  private camera!: THREE.PerspectiveCamera;
  private gui!: dat.GUI;
  private clock = new THREE.Clock();
  private sphere1!: THREE.Mesh;
  private sphere2!: THREE.Mesh;
  private sphere3!: THREE.Mesh;
  private raycaster!: THREE.Raycaster;
  private mouse = new THREE.Vector2();
  private sizes: IWindowSizes = {
    width: window.innerWidth,
    height: window.innerHeight,
  };
  private currentIntersect: THREE.Intersection<
    THREE.Object3D<THREE.Event>
  > | null = null;

  constructor(
    private initThreeScene: InitThreeSceneService,
    private datGuiService: DatGuiService,
    private textureLoaderService: TextureLoaderService
  ) {}

  @HostListener('window:resize')
  private onRisize() {
    this.sizes = this.initThreeScene.onResize();
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
    this.camera.position.set(0.14, 0.24, 3);
    this.gui = this.datGuiService.gui;

    this.addLight();
    this.addObjects();
    this.addRaycaster();
    controls.update();
    this.update();
  }

  addLight() {
    const ambientLight = new THREE.AmbientLight(0xffffff, 1);
    this.scene.add(ambientLight);
  }

  addObjects() {
    this.sphere1 = new THREE.Mesh(
      new THREE.SphereBufferGeometry(0.5, 16, 16),
      new THREE.MeshBasicMaterial({ color: '#ff0000' })
    );

    this.sphere2 = new THREE.Mesh(
      new THREE.SphereBufferGeometry(0.5, 16, 16),
      new THREE.MeshBasicMaterial({ color: '#ff0000' })
    );
    this.sphere2.position.set(2, 0, 0);

    this.sphere3 = new THREE.Mesh(
      new THREE.SphereBufferGeometry(0.5, 16, 16),
      new THREE.MeshBasicMaterial({ color: '#ff0000' })
    );
    this.sphere3.position.set(-2, 0, 0);
    this.scene.add(this.sphere1, this.sphere2, this.sphere3);
  }

  addRaycaster() {
    this.raycaster = new THREE.Raycaster();
    /*  const rayOrigin = new THREE.Vector3(-3, 0, 0);
    const rayDirection = new THREE.Vector3(10, 0, 0);
    rayDirection.normalize();
    raycaster.set(rayOrigin, rayDirection);

    const intersect = raycaster.intersectObject(this.sphere2);
    console.log(intersect);

    const intersects = raycaster.intersectObjects([
      this.sphere1,
      this.sphere2,
      this.sphere3,
    ]);
    console.log(intersects); */
  }

  @HostListener('window:mousemove', ['$event'])
  private onMouseMove(event: MouseEvent) {
    this.mouse.x = (event.clientX / this.sizes.width) * 2 - 1;
    this.mouse.y = -(event.clientY / this.sizes.height) * 2 + 1;
  }

  @HostListener('window:click', ['$event'])
  private onClick(event: MouseEvent) {
    if (this.currentIntersect) {
      switch (this.currentIntersect.object) {
        case this.sphere1:
          console.log('click on sphere 1');
          break;
        case this.sphere2:
          console.log('click on sphere 2');
          break;
        case this.sphere3:
          console.log('click on sphere 3');
          break;
      }
    }
  }

  update() {
    this.initThreeScene.animate$.subscribe((res) => {
      const elapsedTime = this.clock.getElapsedTime();
      this.sphere1.position.y = Math.sin(elapsedTime * 0.3) * 1.5;
      this.sphere2.position.y = Math.sin(elapsedTime * 0.8) * 1.5;
      this.sphere3.position.y = Math.sin(elapsedTime * 1.4) * 1.5;

      this.raycaster.setFromCamera(this.mouse, this.camera);

      const objectToTest = [this.sphere1, this.sphere2, this.sphere3];

      const intersects = this.raycaster.intersectObjects(objectToTest);

      objectToTest.forEach((item) => {
        const material = item.material as THREE.MeshBasicMaterial;
        material.color.set('#ff0000');
      });

      if (intersects.length) {
        if (this.currentIntersect === null) {
          console.log('mouse enter');
        }
        this.currentIntersect = intersects[0];
      } else {
        if (this.currentIntersect) {
          console.log('mouse leave');
        }
        this.currentIntersect = null;
      }
      if (intersects[0]) {
        const mesh = intersects[0].object as THREE.Mesh;
        const material = mesh.material as THREE.MeshBasicMaterial;
        material.color.set('#0000ff');
      }
      /*
      const rayOrigin = new THREE.Vector3(-3, 0, 0);
      const rayDirection = new THREE.Vector3(1, 0, 0).normalize();

      this.raycaster.set(rayOrigin, rayDirection); */
    });
  }

  ngOnInit(): void {}

  ngAfterViewInit(): void {
    this.initScene();
  }
}
