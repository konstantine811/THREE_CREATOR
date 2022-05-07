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
import * as CANNON from 'cannon-es';
// services
import { InitThreeSceneService } from '@app/core/services/init-three-scene.service';
import { DatGuiService } from '@app/core/services/dat-gui/dat-gui.service';
import { TextureLoaderService } from '@app/core/services/loaders/texture-loader.service';

@Component({
  selector: 'app-physics-train',
  templateUrl: './physics-train.component.html',
  styleUrls: ['./physics-train.component.scss'],
})
export class PhysicsTrainComponent implements OnInit, AfterViewInit {
  @ViewChild('webgl', { static: true }) private webglEl!: ElementRef;
  private scene!: THREE.Scene;
  private renderer!: THREE.WebGLRenderer;
  private camera!: THREE.PerspectiveCamera;
  private gui!: dat.GUI;
  private clock = new THREE.Clock();
  private _pathToTexture = './assets/textures';
  private environmentMapTexture!: THREE.CubeTexture;
  private world!: CANNON.World;
  private oldElapsedTime = 0;
  private sphereBody!: CANNON.Body;
  private sphere!: THREE.Mesh;
  private physicDefaultMaterial!: CANNON.Material;
  private objectsForUpdate: {
    mesh: THREE.Mesh;
    body: CANNON.Body;
  }[] = [];
  private debugObject: any = {};
  private sphereGeometry!: THREE.SphereBufferGeometry;
  private boxGeometry!: THREE.BoxBufferGeometry;
  private material!: THREE.MeshStandardMaterial;
  private hitSound = new Audio('/assets/sounds/hit.mp3');
  constructor(
    private initThreeScene: InitThreeSceneService,
    private datGuiService: DatGuiService,
    private textureLoaderService: TextureLoaderService
  ) {}

  getPathToTexture(path: string): string {
    return this._pathToTexture + '/' + path;
  }

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
    this.camera.position.set(-3, 3, 3);
    this.renderer = renderer;

    this.renderer.shadowMap.enabled = true;
    this.renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

    this.gui = this.datGuiService.gui;

    this.loadTexture();
    this.addLight();
    this.addObjects();
    controls.update();
    controls.enableDamping = true;
    this.addPhysics();
    this.createSphere(0.5, new THREE.Vector3(0, 3, 0));
    this.addDebugFun();
    this.update();
  }

  playSound(collision = 0) {
    if (collision > 1.5) {
      this.hitSound.volume = Math.random();
      this.hitSound.currentTime = 0;
      this.hitSound.play();
    }
  }

  addPlaySound = (collision: any) => {
    this.playSound(collision.contact.getImpactVelocityAlongNormal());
  };

  addDebugFun() {
    this.debugObject.createSphere = () => {
      this.createSphere(
        Math.random() * 0.5,
        new THREE.Vector3(
          (Math.random() - 0.5) * 3,
          3,
          (Math.random() - 0.5) * 3
        )
      );
    };

    this.debugObject.createBox = () => {
      this.createBox(
        Math.random(),
        Math.random(),
        Math.random(),
        new THREE.Vector3(
          (Math.random() - 0.5) * 3,
          3,
          (Math.random() - 0.5) * 3
        )
      );
    };

    this.debugObject.reset = () => {
      for (const object of this.objectsForUpdate) {
        object.body.removeEventListener('collide', this.addPlaySound);
        this.world.removeBody(object.body);

        this.scene.remove(object.mesh);
      }
      this.objectsForUpdate.splice(0, this.objectsForUpdate.length);
    };

    this.gui.add(this.debugObject, 'createSphere');
    this.gui.add(this.debugObject, 'createBox');
    this.gui.add(this.debugObject, 'reset');
  }

  loadTexture() {
    const cubeTextureLoader = new THREE.CubeTextureLoader();
    this.environmentMapTexture = cubeTextureLoader.load([
      this.getPathToTexture('environmentMaps/0/px.jpg'),
      this.getPathToTexture('environmentMaps/0/nx.jpg'),
      this.getPathToTexture('environmentMaps/0/py.jpg'),
      this.getPathToTexture('environmentMaps/0/ny.jpg'),
      this.getPathToTexture('environmentMaps/0/pz.jpg'),
      this.getPathToTexture('environmentMaps/0/nz.jpg'),
    ]);
  }

  addLight() {
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.7);
    this.scene.add(ambientLight);

    const directionalLight = new THREE.DirectionalLight(0xffffff, 0.2);
    directionalLight.castShadow = true;
    directionalLight.shadow.mapSize.set(1024, 1024);
    directionalLight.shadow.camera.far = 15;
    directionalLight.shadow.camera.left = -7;
    directionalLight.shadow.camera.top = 7;
    directionalLight.shadow.camera.right = 7;
    directionalLight.shadow.camera.bottom = -7;
    directionalLight.position.set(5, 5, 5);
    this.scene.add(directionalLight);
  }

  createSphere(radius: number, position: THREE.Vector3) {
    const mesh = new THREE.Mesh(this.sphereGeometry, this.material);
    mesh.scale.set(radius, radius, radius);
    mesh.castShadow = true;
    mesh.position.copy(position);
    this.scene.add(mesh);

    // Cannon.js body
    const shape = new CANNON.Sphere(radius);
    const body = new CANNON.Body({
      mass: 1,
      position: new CANNON.Vec3(0, 3, 0),
      shape,
      material: this.physicDefaultMaterial,
    });
    body.position.copy(new CANNON.Vec3(position.x, position.y, position.z));
    this.world.addBody(body);
    body.addEventListener('collide', this.addPlaySound);
    this.objectsForUpdate.push({
      mesh,
      body,
    });
  }

  createBox(
    width: number,
    height: number,
    depth: number,
    position: THREE.Vector3
  ) {
    const mesh = new THREE.Mesh(this.boxGeometry, this.material);
    mesh.scale.set(width, height, depth);
    mesh.castShadow = true;
    mesh.position.copy(position);
    this.scene.add(mesh);

    // Cannon.js body
    const shape = new CANNON.Box(
      new CANNON.Vec3(width * 0.5, height * 0.5, depth * 0.5)
    );
    const body = new CANNON.Body({
      mass: 1,
      position: new CANNON.Vec3(0, 3, 0),
      shape,
      material: this.physicDefaultMaterial,
    });
    body.position.copy(new CANNON.Vec3(position.x, position.y, position.z));
    body.addEventListener('collide', this.addPlaySound);
    this.world.addBody(body);
    this.objectsForUpdate.push({
      mesh,
      body,
    });
  }

  addObjects() {
    (this.sphereGeometry = new THREE.SphereBufferGeometry(1, 20, 20)),
      (this.material = new THREE.MeshStandardMaterial({
        metalness: 0.3,
        roughness: 0.4,
        envMap: this.environmentMapTexture,
      }));
    this.boxGeometry = new THREE.BoxBufferGeometry(1, 1, 1);

    const floor = new THREE.Mesh(
      new THREE.PlaneGeometry(10, 10),
      new THREE.MeshStandardMaterial({
        color: '#777777',
        metalness: 0.3,
        roughness: 0.4,
        envMap: this.environmentMapTexture,
        envMapIntensity: 0.5,
      })
    );
    floor.receiveShadow = true;
    floor.rotation.x = -Math.PI * 0.5;
    this.scene.add(floor);
  }

  addPhysics() {
    this.world = new CANNON.World();
    this.world.broadphase = new CANNON.SAPBroadphase(this.world);
    this.world.allowSleep = true;
    this.world.gravity.set(0, -9.82, 0);

    // Materials
    this.physicDefaultMaterial = new CANNON.Material('default');

    const defaultContactMaterial = new CANNON.ContactMaterial(
      this.physicDefaultMaterial,
      this.physicDefaultMaterial,
      {
        friction: 0.1,
        restitution: 0.7,
      }
    );
    this.world.defaultContactMaterial = defaultContactMaterial;
    this.world.addContactMaterial(defaultContactMaterial);

    // Floor
    const floorShape = new CANNON.Plane();
    const floorBody = new CANNON.Body();
    floorBody.mass = 0;
    floorBody.quaternion.setFromAxisAngle(
      new CANNON.Vec3(-1, 0, 0),
      Math.PI * 0.5
    );
    floorBody.material = this.physicDefaultMaterial;
    floorBody.addShape(floorShape);
    this.world.addBody(floorBody);
  }

  update() {
    this.initThreeScene.animate$.subscribe((res) => {
      const elapsedTime = this.clock.getElapsedTime();
      const deltaTime = elapsedTime - this.oldElapsedTime;
      this.oldElapsedTime = elapsedTime;
      this.world.step(1 / 60, deltaTime, 3);
      /*   this.debugObject.createSphere();
      this.debugObject.createBox(); */
      for (const object of this.objectsForUpdate) {
        object.mesh.position.copy(
          new THREE.Vector3(
            object.body.position.x,
            object.body.position.y,
            object.body.position.z
          )
        );
        object.mesh.quaternion.copy(
          new THREE.Quaternion(
            object.body.quaternion.x,
            object.body.quaternion.y,
            object.body.quaternion.z,
            object.body.quaternion.w
          )
        );
      }
    });
  }

  ngOnInit(): void {}

  ngAfterViewInit(): void {
    this.initScene();
  }
}
