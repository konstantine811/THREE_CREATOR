import {
  Component,
  HostListener,
  OnInit,
  ViewChild,
  ElementRef,
  AfterViewInit,
} from '@angular/core';
// threejs
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';
import { FontLoader } from 'three/examples/jsm/loaders/FontLoader';
import { TextGeometry } from 'three/examples/jsm/geometries/TextGeometry';
// dat gui
import * as dat from 'lil-gui';
// fonts
import typeFaceFont from '@assets/fonts/json/Roboto/Roboto-Black.json';
// services
import { InitThreeSceneService } from '../../core/services/init-three-scene.service';
import { TextureLoaderService } from '../../core/services/loaders/texture-loader.service';

@Component({
  selector: 'app-three-text',
  templateUrl: './three-text.component.html',
  styleUrls: ['./three-text.component.scss'],
})
export class ThreeTextComponent implements OnInit, AfterViewInit {
  @ViewChild('webgl', { static: true }) private webglEl!: ElementRef;
  private scene!: THREE.Scene;
  private renderer!: THREE.WebGLRenderer;
  private camera!: THREE.PerspectiveCamera;
  private cubeMesh!: THREE.Mesh;
  private count = 0;
  private gui!: dat.GUI;
  private matcapTexture!: THREE.Texture;
  private matcapMaterial!: THREE.MeshMatcapMaterial;

  constructor(
    private initThreeScene: InitThreeSceneService,
    private textureLoaderService: TextureLoaderService
  ) {}

  @HostListener('window:resize')
  private onRisize() {
    this.initThreeScene.onResize();
  }

  loadFont() {
    const fontLoader = new FontLoader();
    fontLoader.load('assets/fonts/json/Roboto/Roboto-Black.json', (font) => {
      const bevelSize = 0.01;
      const bevelThickness = 0.003;
      const textSize = 0.5;
      const textGeometry = new TextGeometry('Constantine Abramov', {
        font,
        size: textSize,
        height: 0.1,
        curveSegments: 15,
        bevelEnabled: true,
        bevelThickness,
        bevelSize,
        bevelOffset: 0,
        bevelSegments: 10,
      });

      /* textGeometry.computeBoundingBox();
      if (textGeometry) {
        textGeometry.translate(
          this.computeTextTranslate(
            textGeometry.boundingBox?.max.x as number,
            bevelSize,
            textSize
          ),
          this.computeTextTranslate(
            textGeometry.boundingBox?.max.y as number,
            bevelSize,
            textSize
          ),
          this.computeTextTranslate(
            textGeometry.boundingBox?.max.z as number,
            bevelThickness,
            textSize
          )
        );
      }

      textGeometry.computeBoundingBox();
      console.log(textGeometry.boundingBox); */

      textGeometry.center();
      const text = new THREE.Mesh(textGeometry, this.matcapMaterial);
      this.scene.add(text);
    });
  }

  addDonuts() {
    const donutGeometry = new THREE.BoxBufferGeometry(0.3, 0.2, 0.2);
    for (let i = 0; i < 100; i++) {
      const donut = new THREE.Mesh(donutGeometry, this.matcapMaterial);
      donut.position.x = (Math.random() - 0.5) * 10;
      donut.position.y = (Math.random() - 0.5) * 10;
      donut.position.z = (Math.random() - 0.5) * 10;

      donut.rotation.x = Math.random() * Math.PI;
      donut.rotation.y = Math.random() * Math.PI;
      const scale = Math.random();
      donut.scale.set(scale, scale, scale);
      this.scene.add(donut);
    }
  }

  computeTextTranslate(maxN: number, bevelSize: number, size: number): number {
    return -(maxN - bevelSize) * size;
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
    // this.addObjects();
    // this.update();
    // axis helper
    this.loadFont();
    this.addDonuts();
    this.camera.position.set(3.5, 0.78, 4.9);
    controls.update();
    this.update();
  }

  addObjects() {
    const geometry = new THREE.BoxGeometry(5, 5, 5);
    const material = new THREE.MeshBasicMaterial({
      color: new THREE.Color('rgb(255, 155, 25)'),
    });
    this.cubeMesh = new THREE.Mesh(geometry, material);
    this.scene.add(this.cubeMesh);
  }

  update() {
    this.initThreeScene.animate$.subscribe((res) => {
      /*   this.cubeMesh.rotation.x += 0.01;
      this.cubeMesh.rotation.y += 0.02; */
    });
  }

  ngOnInit(): void {}

  ngAfterViewInit(): void {
    this.initScene();
  }
}
