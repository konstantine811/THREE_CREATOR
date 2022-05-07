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
  selector: 'app-haunted-house',
  templateUrl: './haunted-house.component.html',
  styleUrls: ['./haunted-house.component.scss'],
})
export class HauntedHouseComponent implements OnInit, AfterViewInit {
  @ViewChild('webgl', { static: true }) private webglEl!: ElementRef;
  private scene!: THREE.Scene;
  private renderer!: THREE.WebGLRenderer;
  private camera!: THREE.PerspectiveCamera;
  private gui!: dat.GUI;
  private sphere!: THREE.Mesh;
  private clock = new THREE.Clock();
  private house!: THREE.Group;
  private ghost1!: THREE.PointLight;
  private ghost2!: THREE.PointLight;
  private ghost3!: THREE.PointLight;

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

    // fog
    const fog = new THREE.Fog('#262837', 1, 15);
    this.scene.fog = fog;

    this.renderer = renderer;
    this.renderer.shadowMap.enabled = true;
    this.renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    this.camera.position.set(3.22, 3.38, 4.48);
    this.gui = this.datGuiService.gui;

    this.renderer.setClearColor('#262837');
    this.addLight();
    this.addObjects();
    controls.update();
    this.update();
  }

  addLight() {
    // Ambient light
    const ambientLight = new THREE.AmbientLight('#ffffff', 0.12);
    this.gui.add(ambientLight, 'intensity', 0, 1, 0.001);
    this.scene.add(ambientLight);

    // Directional light
    const moonLight = new THREE.DirectionalLight('#ffffff', 0.12);
    moonLight.position.set(4, 5, -2);
    this.gui.add(moonLight, 'intensity').min(0).max(1).step(0.001);
    this.gui.add(moonLight.position, 'x').min(-5).max(5).step(0.001);
    this.gui.add(moonLight.position, 'y').min(-5).max(5).step(0.001);
    this.gui.add(moonLight.position, 'z').min(-5).max(5).step(0.001);
    moonLight.castShadow = true;
    moonLight.shadow.mapSize.width = 256;
    moonLight.shadow.mapSize.height = 256;
    moonLight.shadow.camera.far = 7;
    this.scene.add(moonLight);

    // Door light
    const doorLight = new THREE.PointLight('#ff7d46', 1, 7);
    doorLight.position.set(0, 2.2, 2.7);
    doorLight.castShadow = true;
    doorLight.shadow.mapSize.width = 256;
    doorLight.shadow.mapSize.height = 256;
    doorLight.shadow.camera.far = 7;
    this.scene.add(doorLight);

    // Ghosts
    this.ghost1 = new THREE.PointLight('#ff00ff', 2, 3);
    this.ghost1.castShadow = true;
    this.ghost1.shadow.mapSize.width = 256;
    this.ghost1.shadow.mapSize.height = 256;
    this.ghost1.shadow.camera.far = 7;
    this.scene.add(this.ghost1);

    this.ghost2 = new THREE.PointLight('#00ffff', 2, 3);
    this.ghost2.castShadow = true;
    this.ghost2.shadow.mapSize.width = 256;
    this.ghost2.shadow.mapSize.height = 256;
    this.ghost2.shadow.camera.far = 7;
    this.scene.add(this.ghost2);

    this.ghost3 = new THREE.PointLight('#ffff00', 2, 3);
    this.ghost3.castShadow = true;
    this.ghost3.shadow.mapSize.width = 256;
    this.ghost3.shadow.mapSize.height = 256;
    this.ghost3.shadow.camera.far = 7;
    this.scene.add(this.ghost3);
  }

  addObjects() {
    const grassColorTexture = this.textureLoaderService.getTextureByPath(
      '/hounted_house_textures/grass/color.jpg'
    );
    const grassAmbientOcclusionTexture =
      this.textureLoaderService.getTextureByPath(
        '/hounted_house_textures/grass/ambientOcclusion.jpg'
      );
    const grassNormalTexture = this.textureLoaderService.getTextureByPath(
      '/hounted_house_textures/grass/normal.jpg'
    );
    const grassRoughnessTexture = this.textureLoaderService.getTextureByPath(
      '/hounted_house_textures/grass/roughness.jpg'
    );
    grassColorTexture.repeat.set(8, 8);
    grassAmbientOcclusionTexture.repeat.set(8, 8);
    grassNormalTexture.repeat.set(8, 8);
    grassRoughnessTexture.repeat.set(8, 8);

    grassColorTexture.wrapS = THREE.RepeatWrapping;
    grassAmbientOcclusionTexture.wrapS = THREE.RepeatWrapping;
    grassNormalTexture.wrapS = THREE.RepeatWrapping;
    grassRoughnessTexture.wrapS = THREE.RepeatWrapping;

    grassColorTexture.wrapT = THREE.RepeatWrapping;
    grassAmbientOcclusionTexture.wrapT = THREE.RepeatWrapping;
    grassNormalTexture.wrapT = THREE.RepeatWrapping;
    grassRoughnessTexture.wrapT = THREE.RepeatWrapping;
    const material = new THREE.MeshStandardMaterial({
      map: grassColorTexture,
      aoMap: grassAmbientOcclusionTexture,
      normalMap: grassNormalTexture,
      roughnessMap: grassRoughnessTexture,
    });
    const plane = new THREE.Mesh(new THREE.PlaneGeometry(20, 20), material);
    plane.geometry.setAttribute(
      'uv2',
      new THREE.Float32BufferAttribute(plane.geometry.attributes.uv.array, 2)
    );
    plane.rotation.x = -Math.PI * 0.5;
    plane.position.y = 0;
    plane.receiveShadow = true;
    this.scene.add(plane);

    this.addHouse();
  }

  addHouse() {
    this.house = new THREE.Group();
    this.scene.add(this.house);

    // walls
    // texture bricks
    const bricksColorTexture = this.textureLoaderService.getTextureByPath(
      '/hounted_house_textures/bricks/color.jpg'
    );
    const bricksAmbientOcclusionTexture =
      this.textureLoaderService.getTextureByPath(
        '/hounted_house_textures/bricks/ambientOcclusion.jpg'
      );
    const bricksNormalTexture = this.textureLoaderService.getTextureByPath(
      '/hounted_house_textures/bricks/normal.jpg'
    );
    const bricksRoughnessTexture = this.textureLoaderService.getTextureByPath(
      '/hounted_house_textures/bricks/roughness.jpg'
    );
    const walls = new THREE.Mesh(
      new THREE.BoxBufferGeometry(4, 2.5, 4),
      new THREE.MeshStandardMaterial({
        map: bricksColorTexture,
        aoMap: bricksAmbientOcclusionTexture,
        normalMap: bricksNormalTexture,
        roughnessMap: bricksRoughnessTexture,
      })
    );
    walls.geometry.setAttribute(
      'uv2',
      new THREE.Float32BufferAttribute(walls.geometry.attributes.uv.array, 2)
    );
    walls.position.y = 1.25;
    walls.castShadow = true;
    this.house.add(walls);

    // Roof
    const roof = new THREE.Mesh(
      new THREE.ConeBufferGeometry(3.5, 1, 4),
      new THREE.MeshStandardMaterial({ color: '#b35f45' })
    );
    roof.position.y = 2.5 + 0.5;
    roof.rotation.y = Math.PI * 0.25;
    roof.castShadow = true;
    this.house.add(roof);

    // Door
    // texture material
    const doorColorTexture =
      this.textureLoaderService.getTextureByPath('/door/color.jpg');
    const doorAlphaTexture =
      this.textureLoaderService.getTextureByPath('/door/alpha.jpg');
    const doorAmbientOcclusionTexture =
      this.textureLoaderService.getTextureByPath('/door/ambientOcclusion.jpg');
    const doorHeightTexture =
      this.textureLoaderService.getTextureByPath('/door/height.jpg');
    const doorNormalTexture =
      this.textureLoaderService.getTextureByPath('/door/normal.jpg');
    const doorMetalnessTexture = this.textureLoaderService.getTextureByPath(
      '/door/metalness.jpg'
    );
    const doorRoughnessTexture = this.textureLoaderService.getTextureByPath(
      '/door/roughness.jpg'
    );
    const door = new THREE.Mesh(
      new THREE.PlaneBufferGeometry(2.2, 2.2, 100, 100),
      new THREE.MeshStandardMaterial({
        map: doorColorTexture,
        alphaMap: doorAlphaTexture,
        transparent: true,
        aoMap: doorAmbientOcclusionTexture,
        displacementMap: doorHeightTexture,
        displacementScale: 0.1,
        normalMap: doorNormalTexture,
        metalnessMap: doorMetalnessTexture,
        roughnessMap: doorRoughnessTexture,
      })
    );
    door.geometry.setAttribute(
      'uv2',
      new THREE.Float32BufferAttribute(door.geometry.attributes.uv.array, 2)
    );
    door.position.z = 2 + 0.01;
    door.position.y = 1;
    this.house.add(door);

    // Bushes
    const bushGeometry = new THREE.SphereBufferGeometry(1, 16, 16);
    const bushMaterial = new THREE.MeshStandardMaterial({ color: '#89c854' });

    const bush1 = new THREE.Mesh(bushGeometry, bushMaterial);
    bush1.scale.set(0.5, 0.5, 0.5);
    bush1.position.set(0.8, 0.2, 2.2);
    bush1.castShadow = true;

    const bush2 = new THREE.Mesh(bushGeometry, bushMaterial);
    bush2.scale.set(0.25, 0.25, 0.25);
    bush2.position.set(1.4, 0.1, 2.1);
    bush2.castShadow = true;

    const bush3 = new THREE.Mesh(bushGeometry, bushMaterial);
    bush3.scale.set(0.4, 0.4, 0.4);
    bush3.position.set(-0.8, 0.1, 2.2);
    bush3.castShadow = true;

    const bush4 = new THREE.Mesh(bushGeometry, bushMaterial);
    bush4.scale.set(0.15, 0.15, 0.15);
    bush4.position.set(-1, 0.05, 2.6);
    bush4.castShadow = true;

    this.house.add(bush1, bush2, bush3, bush4);

    // Graves
    const graves = new THREE.Group();
    this.scene.add(graves);

    const graveGeometry = new THREE.BoxBufferGeometry(0.6, 0.8, 0.2);
    const graveMaterial = new THREE.MeshStandardMaterial({ color: '#b2b6b1' });
    for (let i = 0; i < 50; i++) {
      const angle = Math.random() * Math.PI * 2;
      const radius = 4 + Math.random() * 6;
      const x = Math.sin(angle) * radius;
      const z = Math.cos(angle) * radius;
      const grave = new THREE.Mesh(graveGeometry, graveMaterial);
      grave.position.set(x, 0.3, z);
      grave.rotation.y = (Math.random() - 0.5) * 0.4;
      grave.rotation.z = (Math.random() - 0.5) * 0.4;
      grave.castShadow = true;
      graves.add(grave);
    }
  }

  update() {
    const animSpeed = 0.001;
    const clock = new THREE.Clock();
    this.initThreeScene.animate$.subscribe((res) => {
      const elapsedTime = clock.getElapsedTime();
      const ghost1Angle = elapsedTime * 0.5;
      this.ghost1.position.x = Math.cos(ghost1Angle) * 4;
      this.ghost1.position.z = Math.sin(ghost1Angle) * 4;
      this.ghost1.position.y = Math.sin(elapsedTime * 3);

      const ghost2Angle = -elapsedTime * 0.32;
      this.ghost2.position.x = Math.cos(ghost2Angle) * 5;
      this.ghost2.position.z = Math.sin(ghost2Angle) * 5;
      this.ghost2.position.y =
        Math.sin(elapsedTime * 4) + Math.sin(elapsedTime * 2.5);

      const ghost3Angle = -elapsedTime * 0.18;
      this.ghost3.position.x =
        Math.cos(ghost3Angle) * (7 + Math.sin(elapsedTime * 0.32));
      this.ghost3.position.z =
        Math.sin(ghost3Angle) * (7 + Math.sin(elapsedTime * 0.5));
      this.ghost3.position.y =
        Math.sin(elapsedTime * 4) + Math.sin(elapsedTime * 2.5);
    });
  }

  ngOnInit(): void {}

  ngAfterViewInit(): void {
    this.initScene();
  }
}
