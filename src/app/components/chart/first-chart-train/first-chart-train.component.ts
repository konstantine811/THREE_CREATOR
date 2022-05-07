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
import { RequestDataService } from '@app/core/services/request-data/request-data.service';

@Component({
  selector: 'app-first-chart-train',
  templateUrl: './first-chart-train.component.html',
  styleUrls: ['./first-chart-train.component.scss'],
})
export class FirstChartTrainComponent implements OnInit, AfterViewInit {
  @ViewChild('webgl', { static: true }) private webglEl!: ElementRef;
  private scene!: THREE.Scene;
  private renderer!: THREE.WebGLRenderer;
  private camera!: THREE.PerspectiveCamera;
  private gui!: dat.GUI;
  private clock = new THREE.Clock();
  private chartObject!: THREE.Object3D;

  private ConfigLine = {
    height: 500,
    width: 500,
    linesHeight: 10,
    linesWidth: 10,
    color: 0xaaaaaa,
  };

  private labels = {
    y: ['2%', '4%', '6%', '8%', '10%', '12%', '14%', '16%', '18%', '20%'],
    x: [
      '',
      "'14",
      "'13",
      "'12",
      "'11",
      "'10",
      "'09",
      "'08",
      "'07",
      "'06",
      "'05",
    ],
    z: [
      '1-month',
      '3-month',
      '6-month',
      '1-year',
      '2-year',
      '3-year',
      '5-year',
      '7-year',
      '10-year',
      '20-year',
      '30-year',
    ],
  };

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

    this.renderer = renderer;
    this.renderer.shadowMap.enabled = false;
    this.renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    this.gui = this.datGuiService.gui;
    const startPosition = new THREE.Vector3(0, 0, 3000);
    camera.position.set(startPosition.x, startPosition.y, startPosition.z);
    this.chartObject = new THREE.Object3D();
    this.camera.lookAt(this.chartObject.position);
    this.scene.add(this.chartObject);

    controls.update();

    this.addLight();
    this.addGrid();
    this.cretateDataChart();
    this.update();
  }

  cretateDataChart() {
    this.requestDataService.getChartData().subscribe((realData) => {
      console.log('realdata', realData);
      const colorsArr = [
        '#eef4f8',
        '#ddecf4',
        '#cce5f0',
        '#bcddec',
        '#aed5e7',
        '#a0cde2',
        '#94c5dc',
        '#89bcd6',
        '#7eb4d0',
        '#74abc9',
        '#6aa2c2',
        '#619abb',
        '#5892b4',
        '#4f8aad',
        '#4781a6',
        '#3f799f',
        '#3a7195',
        '#35688c',
        '#326082',
        '#2f5877',
        '#2c506c',
        '#243d52',
      ];
      const geometry = new THREE.PlaneGeometry(1000, 1000, 32, 32);

      const vertices = geometry.getAttribute('position');

      const faceColors = [];
      for (let i = 0; i <= vertices.array.length / 3; i++) {
        const color = new THREE.Color(
          colorsArr[Math.round(realData[i][2] * 1)]
        );
        faceColors.push(color.r, color.g, color.b);
        if (realData[i][2]) {
          vertices.setZ(i, realData[i][2] * 100);
        } else {
        }
      }
      console.log(faceColors);
      geometry.setAttribute(
        'color',
        new THREE.BufferAttribute(new Float32Array(faceColors), 3)
      );
      geometry.rotateX(-Math.PI * 0.5);
      console.log('face', geometry.getAttribute('colors'));
      geometry.translate(0, -this.ConfigLine.height, this.ConfigLine.width);
      const mesh = new THREE.Mesh(
        geometry,
        new THREE.MeshBasicMaterial({
          wireframe: true,
          color: 'orange',
          side: THREE.DoubleSide,
        })
      );
      this.scene.add(mesh);
    });
  }

  addLight() {
    const ambientLight = new THREE.AmbientLight(0xffffff, 1);
    this.scene.add(ambientLight);
  }

  addGrid() {
    const firstGrid = this.createGrid();
    const secondGrid = this.createGrid();
    secondGrid.rotation.set(0, Math.PI * 0.5, 0);
    secondGrid.position.set(this.ConfigLine.width, 0, this.ConfigLine.width);
    const thirdGrid = this.createGrid();
    thirdGrid.rotation.set(Math.PI * 0.5, 0, 0);
    thirdGrid.position.set(0, -this.ConfigLine.width, this.ConfigLine.width);
    // add label
    this.labelAxis();
  }

  createGrid(): THREE.Object3D {
    const material = new THREE.LineBasicMaterial({
      color: this.ConfigLine.color,
      opacity: 0.2,
    });

    const gridObject = new THREE.Object3D();
    const stepw = (2 * this.ConfigLine.width) / this.ConfigLine.linesWidth;
    const steph = (2 * this.ConfigLine.height) / this.ConfigLine.linesHeight;
    const points = [];

    for (
      let i = -this.ConfigLine.width;
      i <= this.ConfigLine.width;
      i += stepw
    ) {
      points.push(new THREE.Vector3(-this.ConfigLine.height, i, 0));
      points.push(new THREE.Vector3(this.ConfigLine.height, i, 0));
    }

    for (
      let i = -this.ConfigLine.height;
      i <= this.ConfigLine.height;
      i += steph
    ) {
      points.push(new THREE.Vector3(i, -this.ConfigLine.width, 0));
      points.push(new THREE.Vector3(i, this.ConfigLine.width, 0));
    }
    const geometryLine = new THREE.BufferGeometry().setFromPoints(points);
    const line = new THREE.LineSegments(geometryLine, material);
    gridObject.add(line);
    this.chartObject.add(gridObject);
    return gridObject;
  }

  labelAxis() {
    const stepw = (2 * this.ConfigLine.width) / this.ConfigLine.linesWidth;
    const xobj = new THREE.Object3D();
    this.labels.x.forEach((item, index) => {
      const label = this.makeTextSprite(item);
      label.position.set(0, stepw * index, 0);
      xobj.add(label);
    });
    xobj.position.set(-this.ConfigLine.height, -this.ConfigLine.width, 0);
    this.chartObject.add(xobj);

    const yobj = new THREE.Object3D();
    this.labels.y.forEach((item, index) => {
      const label = this.makeTextSprite(item);
      label.position.set(0, stepw * index, 0);
      yobj.add(label);
    });
    yobj.position.set(-this.ConfigLine.width, -this.ConfigLine.height, stepw);
    yobj.rotateX(Math.PI * 0.5);
    this.chartObject.add(yobj);

    const yobz = new THREE.Object3D();
    this.labels.z.forEach((item, index) => {
      const label = this.makeTextSprite(item);
      label.position.set(0, stepw * index, 0);
      yobz.add(label);
    });
    yobz.position.set(
      this.ConfigLine.width,
      -this.ConfigLine.height - 40,
      this.ConfigLine.width * 2
    );
    yobz.rotateZ(Math.PI * 0.5);
    this.chartObject.add(yobz);
  }

  makeTextSprite(message: string) {
    const fontface = 'Arial';
    const fontsize = 70;
    const borderThickness = 4;
    const canvas = document.createElement('canvas');
    const context = canvas.getContext('2d') as CanvasRenderingContext2D;
    context.font = 'Bold ' + fontsize + 'px ' + fontface;

    // get size data (height depends only on font size)
    context.measureText(message);

    context.lineWidth = borderThickness;
    // 1.4 is extra height factor for text below baseline: g,j,p,q.

    // text color
    context.fillStyle = 'rgba(255, 255, 255, 1.0)';

    context.fillText(message, borderThickness, fontsize + borderThickness);

    // canvas contents will be used for a texture
    var texture = new THREE.Texture(canvas);
    texture.needsUpdate = true;

    var spriteMaterial = new THREE.SpriteMaterial({ map: texture });
    var sprite = new THREE.Sprite(spriteMaterial);
    sprite.scale.set(100, 50, 1.0);
    return sprite;
  }

  update() {
    this.initThreeScene.animate$.subscribe((res) => {});
  }

  ngOnInit(): void {}

  ngAfterViewInit(): void {
    this.initScene();
  }
}
