import { Component, ElementRef, HostListener, ViewChild } from '@angular/core';
import { AfterViewInit } from '@angular/core';
// threejs
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';
import { Font, FontLoader } from 'three/examples/jsm/loaders/FontLoader';
import { TextGeometry } from 'three/examples/jsm/geometries/TextGeometry';
// fonts
import typeFaceFont from '@assets/fonts/json/Roboto/Roboto-Black.json';
// services
import { InitThreeSceneService } from '@app/core/services/init-three-scene.service';
import { TextureLoaderService } from '@app/core/services/loaders/texture-loader.service';
import { FontLoaderService } from '@app/core/services/loaders/font-loader.service';
import {
  IThreeEditGeometryEvent,
  IThreeEditMaterialEvent,
} from '@app/core/models/three-editor.model';
import {
  ThreeGeometry,
  THREE_GEOMETRY_TYPES,
} from '@app/core/configs/three-editor.config';
// dat gui
import * as dat from 'lil-gui';

@Component({
  selector: 'app-three-text-editor',
  templateUrl: './three-text-editor.component.html',
  styleUrls: ['./three-text-editor.component.scss'],
})
export class ThreeTextEditorComponent implements AfterViewInit {
  @ViewChild('webgl', { static: true }) private webglEl!: ElementRef;
  private scene!: THREE.Scene;
  private renderer!: THREE.WebGLRenderer;
  private camera!: THREE.PerspectiveCamera;
  private matcapMaterial!: THREE.MeshMatcapMaterial;
  private matcapMaterials: {
    [key in ThreeGeometry]: THREE.MeshMatcapMaterial;
  } = {} as any;
  private currentFont!: Font;
  private textMesh!: THREE.Mesh;
  private group!: THREE.Group;
  isAnim = false;
  rangeVal = 10;
  readonly threeGeometry = THREE_GEOMETRY_TYPES;
  private gui!: dat.GUI;
  private groupCube!: THREE.Group;
  private translateCount = 0;
  private transformTranslate = 0.01;

  constructor(
    private initThreeScene: InitThreeSceneService,
    private textureLoaderService: TextureLoaderService,
    private fontLoaderService: FontLoaderService
  ) {}

  @HostListener('window:resize')
  @HostListener('window:orientationchange')
  private onRisize() {
    this.initThreeScene.onResize();
  }

  addText(txt = 'Constantine Abramov') {
    if (this.textMesh) {
      this.scene.remove(this.textMesh);
    }
    const bevelSize = 0.01;
    const bevelThickness = 0.003;
    const textSize = 0.5;
    const textGeometry = new TextGeometry(txt, {
      font: this.currentFont,
      size: textSize,
      height: 0.1,
      curveSegments: 15,
      bevelEnabled: true,
      bevelThickness,
      bevelSize,
      bevelOffset: 0,
      bevelSegments: 10,
    });
    textGeometry.center();
    this.textMesh = new THREE.Mesh(textGeometry, this.matcapMaterial);
    this.scene.add(this.textMesh);
  }

  async initScene() {
    const { scene, camera, controls, renderer } = this.initThreeScene.initScene(
      this.webglEl.nativeElement
    );
    this.scene = scene;
    this.camera = camera;
    this.renderer = renderer;
    const matcapTexture =
      this.textureLoaderService.getTextureByPath('/matcaps/8.png');
    this.matcapMaterial = new THREE.MeshMatcapMaterial({
      matcap: matcapTexture,
    });
    // add gui
    this.gui = new dat.GUI();
    // create material for each geometries
    this.threeGeometry.forEach((item) => {
      this.matcapMaterials[item.geometryName] = new THREE.MeshMatcapMaterial({
        matcap: matcapTexture,
      });
    });
    this.group = new THREE.Group();
    this.scene.add(this.group);
    this.camera.position.set(3.5, 0.78, 4.9);
    controls.update();
    this.currentFont = await this.fontLoaderService.loadFont(
      '/json/Roboto/Roboto-Black.json'
    );
    this.addText();
    this.addCube();
    this.update();
  }

  update() {
    this.initThreeScene.animate$.subscribe((res) => {
      if (this.isAnim) {
        this.group.traverse((obj) => {
          if (obj.type === 'Mesh') {
            obj.rotation.x += 0.01;
            obj.rotation.y += 0.02;
          }
        });
      }
    });
  }

  addCube() {
    const width = 0.3;
    const count = 100;
    const offset = 0.02;
    this.groupCube = new THREE.Group();
    this.scene.add(this.groupCube);
    for (let x = 0; x <= count; x++) {
      for (let z = 0; z <= count; z++) {
        const geometry = new THREE.BoxBufferGeometry(width, width, width);
        const mesh = new THREE.Mesh(geometry, this.matcapMaterial);
        const xOffset = x * (width + offset);
        const zOffset = z * (width + offset);
        // const yOffset = y * (width + offset);
        mesh.position.x = xOffset;
        // mesh.position.y = -yOffset;
        mesh.position.z = zOffset;
        this.groupCube.add(mesh);
        /* for (let y = 0; y <= count; y++) {

        } */
      }
    }
    this.groupCube.position.set(
      -(width * count) / 2,
      -(width * count) / 2,
      -(width * count) / 2
    );
  }

  changeTexture(path: string) {
    const matcapTexture = this.textureLoaderService.getTextureByPath(path);
    this.matcapMaterial.matcap = matcapTexture;
  }

  changeGeometryTexture(event: IThreeEditMaterialEvent) {
    const matcapTexture = this.textureLoaderService.getTextureByPath(
      event.path
    );
    this.matcapMaterials[event.geometryName].matcap = matcapTexture;
  }

  createGeometry(geometryName: ThreeGeometry): THREE.BufferGeometry {
    let geometry!: THREE.BufferGeometry;
    switch (geometryName) {
      case ThreeGeometry.cube:
        geometry = new THREE.BoxBufferGeometry(0.3, 0.2, 0.2);
        break;
      case ThreeGeometry.sphere:
        geometry = new THREE.SphereGeometry(0.75, 50, 50);
        break;
      case ThreeGeometry.torus:
        geometry = new THREE.TorusGeometry(0.3, 0.1, 20, 20);
        break;
    }
    return geometry;
  }

  addGeometry(event: IThreeEditGeometryEvent) {
    const geometry = this.createGeometry(event.geometryName);
    for (let i = 0; i < event.count; i++) {
      const mesh = new THREE.Mesh(
        geometry,
        this.matcapMaterials[event.geometryName]
      );
      mesh.position.x = (Math.random() - 0.5) * this.rangeVal;
      mesh.position.y = (Math.random() - 0.5) * this.rangeVal;
      mesh.position.z = (Math.random() - 0.5) * this.rangeVal;

      mesh.rotation.x = Math.random() * Math.PI;
      mesh.rotation.y = Math.random() * Math.PI;
      const scale = Math.random();
      mesh.scale.set(scale, scale, scale);
      mesh.name = event.geometryName;
      this.group.add(mesh);
    }
  }

  removeGeometry(event: IThreeEditGeometryEvent) {
    for (let i = 0; i < event.count; i++) {
      const obj = this.group.getObjectByName(
        event.geometryName
      ) as THREE.Object3D<THREE.Event>;
      if (obj) {
        this.group.remove(obj);
      }
    }
  }

  onChangeRangeVal(range: number) {
    this.rangeVal = range;
    this.group.traverse((box) => {
      if (box.type === 'Mesh') {
        box.position.x = (Math.random() - 0.5) * range;
        box.position.y = (Math.random() - 0.5) * range;
        box.position.z = (Math.random() - 0.5) * range;
      }
    });
  }

  onSaveFrame() {
    try {
      const strMime = 'image/jpeg';
      const strDownloadMime = 'image/octet-stream';
      const imgData = this.renderer.domElement.toDataURL(strMime);
      this.saveFile(imgData.replace(strMime, strDownloadMime), 'test.jpg');
    } catch (e) {
      console.error(e);
      return;
    }
  }

  saveFile(strData: string, filename: string) {
    const link = document.createElement('a');
    if (typeof link.download === 'string') {
      document.body.appendChild(link); //Firefox requires the link to be in the body
      link.download = filename;
      link.href = strData;
      link.click();
      document.body.removeChild(link); //remove the link when done
    }
  }

  ngAfterViewInit(): void {
    this.initScene();
  }
}
