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
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';
import { FBXLoader } from 'three/examples/jsm/loaders/FBXLoader';
import * as dat from 'lil-gui';
import * as CANNON from 'cannon-es';
import * as CannonDebugger from 'cannon-es-debugger';

@Component({
  selector: 'app-firs-implement-game',
  templateUrl: './firs-implement-game.component.html',
  styleUrls: ['./firs-implement-game.component.scss'],
})
export class FirsImplementGameComponent implements OnInit, AfterViewInit {
  @ViewChild('webgl', { static: true }) private webglEl!: ElementRef;
  private scene!: THREE.Scene;
  private renderer!: THREE.WebGLRenderer;
  private camera!: THREE.PerspectiveCamera;
  private gui!: dat.GUI;
  private cube!: THREE.Mesh<THREE.BoxGeometry, THREE.MeshPhongMaterial>;
  private loader!: FBXLoader;
  private car!: THREE.Group;
  private controls!: OrbitControls;
  // Physics
  private world!: CANNON.World;
  private fixedTimeStype = 1.0 / 24.0;
  private damping = 0.01;
  private debugRenderer!: {
    update: () => void;
  };
  private shapes!: {
    sphere: CANNON.Sphere;
    box: CANNON.Box;
  };
  private groundMaterial!: CANNON.Material;
  private debugObject: any = {};
  private sun!: THREE.DirectionalLight;

  constructor() {}

  @HostListener('window:resize')
  onResize() {
    this.camera.aspect = window.innerWidth / window.innerHeight;
    this.camera.updateProjectionMatrix();
    this.renderer.setSize(window.innerWidth, window.innerHeight);
    this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    return {
      width: window.innerWidth,
      height: window.innerHeight,
    };
  }

  initScene() {
    this.scene = new THREE.Scene();
    this.camera = new THREE.PerspectiveCamera(
      75,
      window.innerWidth / window.innerHeight,
      0.1,
      1000
    );

    this.renderer = new THREE.WebGLRenderer({
      canvas: this.webglEl.nativeElement,
    });

    this.renderer.setSize(window.innerWidth, window.innerHeight);
    this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    this.renderer.shadowMap.enabled = true;
    this.controls = new OrbitControls(this.camera, this.renderer.domElement);
    this.addLights();
    this.gui = new dat.GUI();
    this.loader = new FBXLoader();
    this.addCar();
    this.initPhysics();
    this.addBody();
    this.addDebug();
    this.animate();
  }

  addLights() {
    const ambient = new THREE.AmbientLight(0x888888);

    this.scene.add(ambient);

    const light = new THREE.DirectionalLight(0xdddddd);
    light.position.set(3, 10, 4);
    light.target.position.set(0, 0, 0);
    light.castShadow = true;

    const lightSize = 10;
    light.shadow.camera.near = 1;
    light.shadow.camera.far = 50;
    light.shadow.camera.far = 50;
    light.shadow.camera.left = light.shadow.camera.bottom = -lightSize;
    light.shadow.camera.right = light.shadow.camera.top = lightSize;

    light.shadow.mapSize.width = 1024;
    light.shadow.mapSize.height = 1024;

    this.sun = light;

    this.scene.add(light);
  }

  addCar() {
    this.loader.load('./assets/3d/ford-mustang.fbx', (object: THREE.Group) => {
      this.car = object;
      this.scene.add(this.car);
      this.controls.target = this.car.position.clone();

      this.car.position.set(-15, 0, 0);
      this.car.traverse((child) => {
        if (child.type === 'Mesh') {
          child.castShadow = child.receiveShadow = true;
        }
      });
      this.camera.position.set(13, 8, 17);
      this.controls.update();
    });
  }

  initPhysics() {
    this.world = new CANNON.World();
    this.world.broadphase = new CANNON.NaiveBroadphase();
    this.world.gravity.set(0, -9.8, 0);
    this.debugRenderer = CannonDebugger.default(this.scene, this.world);
    const groundShape = new CANNON.Plane();
    this.groundMaterial = new CANNON.Material();
    const groundBody = new CANNON.Body({
      mass: 0,
      material: this.groundMaterial,
    });
    groundBody.quaternion.setFromAxisAngle(
      new CANNON.Vec3(1, 0, 0),
      -Math.PI / 2
    );
    groundBody.addShape(groundShape);
    this.world.addBody(groundBody);
    this.shapes = {
      sphere: new CANNON.Sphere(0.5),
      box: new CANNON.Box(new CANNON.Vec3(0.5, 0.5, 0.5)),
    };
  }

  addDebug() {
    this.debugObject.createBox = () => {
      this.addBody(false);
    };
    this.debugObject.createSphere = () => {
      this.addBody();
    };

    this.gui.add(this.debugObject, 'createBox');
    this.gui.add(this.debugObject, 'createSphere');
  }

  addBody(sphere = true) {
    const material = new CANNON.Material();
    const body = new CANNON.Body({ mass: 5, material: material });
    if (sphere) {
      body.addShape(this.shapes.sphere);
    } else {
      body.addShape(this.shapes.box);
    }

    /*  body.fixedRotation = true;
    body.updateMassProperties(); */

    const x = Math.random() * 0.3 + 1;
    body.position.set(sphere ? -x : x, 15, 0);
    body.linearDamping = this.damping;
    this.world.addBody(body);

    // Create contact material behaviour
    const material_ground = new CANNON.ContactMaterial(
      this.groundMaterial,
      material,
      {
        friction: 0.9,
        restitution: sphere ? 0.5 : 0.3,
      }
    );
    this.world.addContactMaterial(material_ground);
  }

  addObjects() {
    const geometry = new THREE.BoxGeometry(1, 1, 1);
    const material = new THREE.MeshPhongMaterial({ color: 0x00aaff });

    this.cube = new THREE.Mesh(geometry, material);
    this.scene.add(this.cube);
  }

  private animate = (): void => {
    requestAnimationFrame(this.animate);
    // rerender
    this.world.step(this.fixedTimeStype);
    this.debugRenderer.update();
    this.renderer.render(this.scene, this.camera);
  };
  ngOnInit(): void {}

  ngAfterViewInit(): void {
    this.initScene();
  }
}
