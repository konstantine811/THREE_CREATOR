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
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';
import { DragControls } from 'three/examples/jsm/controls/DragControls';
import { FBXLoader } from 'three/examples/jsm/loaders/FBXLoader';
import { OBJLoader } from 'three/examples/jsm/loaders/OBJLoader';
import Stats from 'three/examples/jsm/libs/stats.module';
import * as dat from 'lil-gui';
import * as CANNON from 'cannon-es';
import * as CannonDebugger from 'cannon-es-debugger';

@Component({
  selector: 'app-physics-train-second',
  templateUrl: './physics-train-second.component.html',
  styleUrls: ['./physics-train-second.component.scss'],
})
export class PhysicsTrainSecondComponent implements OnInit {
  @ViewChild('webgl', { static: true }) private webglEl!: ElementRef;
  private scene!: THREE.Scene;
  private renderer!: THREE.WebGLRenderer;
  private camera!: THREE.PerspectiveCamera;
  private dragControls!: DragControls;
  private draggingId = -1;
  private orbitControls!: OrbitControls;
  private gui!: dat.GUI;
  private stats!: Stats;
  private clock = new THREE.Clock();
  private loader!: FBXLoader;
  private objLoader!: OBJLoader;
  // THREE Partials Objects and materials
  private normalMaterial!: THREE.MeshNormalMaterial;
  private phongMaterial!: THREE.MeshPhongMaterial;

  private meshForUpdate: [
    {
      mesh: THREE.Mesh;
      body: CANNON.Body;
    }?
  ] = [];
  private meshIds: number[] = [];
  // Cannon Physics
  private world!: CANNON.World;
  private debugRenderer!: {
    update: () => void;
  };
  private oldElapsedTime = 0;
  private isDebugger = true;
  private isRainObjects = false;
  private isLoaded = false;
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

  constructor() {}

  initScene() {
    this.scene = new THREE.Scene();
    this.scene.add(new THREE.AxesHelper(5));

    this.camera = new THREE.PerspectiveCamera(
      75,
      window.innerWidth / window.innerHeight,
      0.1,
      1000
    );
    this.camera.position.set(0, 2, 4);

    this.renderer = new THREE.WebGLRenderer({
      canvas: this.webglEl.nativeElement,
    });
    this.renderer.setSize(window.innerWidth, window.innerHeight);
    this.renderer.shadowMap.enabled = true;

    this.orbitControls = new OrbitControls(
      this.camera,
      this.renderer.domElement
    );
    this.orbitControls.enableDamping = true;
    this.orbitControls.target.y = 0.5;

    this.stats = Stats();
    document.body.appendChild(this.stats.dom);

    this.gui = new dat.GUI();
    this.gui.add(this, 'addObjects');
    this.gui.add(this, 'isDebugger').onChange(() => {
      if (this.isDebugger) {
        this.debugRenderer = CannonDebugger.default(this.scene, this.world);
      }
    });
    this.gui.add(this, 'isRainObjects');
    this.gui.add(this, 'addSuzana');
    this.loader = new FBXLoader();
    this.objLoader = new OBJLoader();
    this.addLight();
    this.initPhysics();
    this.addCar();
    this.addSuzana();
    this.createMaterial();
    this.addObjects();
    this.addGround();
    this.dragControls = new DragControls(
      this.meshForUpdate.map((item) => item?.mesh) as THREE.Object3D[],
      this.camera,
      this.renderer.domElement
    );
    this.dragControls.addEventListener('dragstart', (event: THREE.Event) => {
      this.orbitControls.enabled = false;
      this.draggingId = event.object.id;
    });
    this.dragControls.addEventListener('dragend', (event: THREE.Event) => {
      this.orbitControls.enabled = true;
      this.draggingId = -1;
    });
    this.animate();
  }

  addLight() {
    const spotLight1 = new THREE.SpotLight();
    spotLight1.position.set(2.5, 5, 5);
    spotLight1.angle = Math.PI / 4;
    spotLight1.penumbra = 0.5;
    spotLight1.castShadow = true;
    spotLight1.shadow.mapSize.width = 1024;
    spotLight1.shadow.mapSize.height = 1024;
    spotLight1.shadow.camera.near = 0.5;
    spotLight1.shadow.camera.far = 20;
    this.scene.add(spotLight1);

    const spotLight2 = new THREE.SpotLight();
    spotLight2.position.set(-2.5, 5, 5);
    spotLight2.angle = Math.PI / 4;
    spotLight2.penumbra = 0.5;
    spotLight2.castShadow = true;
    spotLight2.shadow.mapSize.width = 1024;
    spotLight2.shadow.mapSize.height = 1024;
    spotLight2.shadow.camera.near = 0.5;
    spotLight2.shadow.camera.far = 20;
    this.scene.add(spotLight2);
  }

  initPhysics() {
    this.world = new CANNON.World();
    this.debugRenderer = CannonDebugger.default(this.scene, this.world);
    this.world.gravity.set(0, -9.82, 0);
    this.world.broadphase = new CANNON.SAPBroadphase(this.world);
    (this.world.solver as CANNON.GSSolver).iterations = 20;
    // this.world.allowSleep = true;
  }

  createMaterial() {
    this.normalMaterial = new THREE.MeshNormalMaterial();
    this.phongMaterial = new THREE.MeshPhongMaterial();
  }

  addObjects() {
    const cubeGeometry = new THREE.BoxGeometry(
      Math.random(),
      Math.random(),
      Math.random()
    );
    const cubeMesh = new THREE.Mesh(cubeGeometry, this.normalMaterial);
    cubeMesh.position.x = (Math.random() - 0.5) * 6;
    cubeMesh.position.z = (Math.random() - 0.5) * 6;
    cubeMesh.position.y = 10;
    cubeMesh.castShadow = true;
    this.addBoxPhysics(cubeMesh);
    // add drag controls
    this.scene.add(cubeMesh);
  }

  addBoxPhysics(mesh: THREE.Mesh<THREE.BoxGeometry, THREE.MeshNormalMaterial>) {
    const { height, width, depth } = mesh.geometry.parameters;
    const cubeShape = new CANNON.Box(
      new CANNON.Vec3(width / 2, height / 2, depth / 2)
    );
    const cubeBody = new CANNON.Body({ mass: 1 });
    cubeBody.addShape(cubeShape);
    cubeBody.position.set(mesh.position.x, mesh.position.y, mesh.position.z);
    this.meshForUpdate.push({
      mesh,
      body: cubeBody,
    });
    cubeBody.allowSleep = true;
    cubeBody.sleepSpeedLimit = 0.1;
    cubeBody.sleepTimeLimit = 1;
    this.meshIds.push(mesh.id);
    this.world.addBody(cubeBody);
  }

  addCar() {
    this.loader.load('./assets/3d/ford-mustang.fbx', (object: THREE.Group) => {
      this.scene.add(object);
      this.orbitControls.target = object.position.clone();
      object.scale.set(0.2, 0.2, 0.2);
      object.position.set(-5, 0.4, 0);
      object.traverse((child) => {
        if (child.type === 'Mesh') {
          child.castShadow = child.receiveShadow = true;
        }
      });
      this.camera.position.set(13, 8, 17);
      this.orbitControls.update();
    });
  }

  addSuzana() {
    this.objLoader.load('./assets/3d/suzana.obj', (object: THREE.Group) => {
      const suzanaMesh = object.children[0] as THREE.Mesh;
      this.scene.add(suzanaMesh);
      suzanaMesh.material = this.normalMaterial;

      suzanaMesh.position.x = -2;
      suzanaMesh.position.y = 5;

      const suzanaBody = new CANNON.Body({ mass: 1 });
      suzanaBody.addShape(new CANNON.Sphere(0.7), new CANNON.Vec3(0, 0.3, 0));
      suzanaBody.addShape(
        new CANNON.Sphere(0.05),
        new CANNON.Vec3(0, -0.9, 0.7)
      );

      suzanaBody.addShape(
        new CANNON.Sphere(0.05),
        new CANNON.Vec3(1.33, 0.4, -0.5)
      );

      suzanaBody.addShape(
        new CANNON.Sphere(0.05),
        new CANNON.Vec3(-1.33, 0.4, -0.5)
      );
      suzanaBody.position.x = suzanaMesh.position.x;
      suzanaBody.position.y = suzanaMesh.position.y;
      suzanaBody.position.z = suzanaMesh.position.z;
      this.meshForUpdate.push({
        mesh: suzanaMesh,
        body: suzanaBody,
      });
      this.meshIds.push(suzanaMesh.id);
      this.world.addBody(suzanaBody);

      this.isLoaded = true;
    });
  }

  addGround() {
    const groundMaterial = new CANNON.Material('groundMaterial');
    groundMaterial.friction = 0.25;
    groundMaterial.restitution = 0.25;

    const groundGeometry = new THREE.PlaneGeometry(10, 10);
    const groundMesh = new THREE.Mesh(groundGeometry, this.phongMaterial);
    groundMesh.rotateX(-Math.PI / 2);
    groundMesh.receiveShadow = true;
    this.scene.add(groundMesh);
    const groundShape = new CANNON.Box(
      new CANNON.Vec3(
        groundGeometry.parameters.width / 2,
        0.5,
        groundGeometry.parameters.height / 2
      )
    );
    const groundBody = new CANNON.Body({ mass: 0, material: groundMaterial });
    this.meshIds.push(groundMesh.id);
    groundBody.addShape(groundShape);
    groundBody.position.set(0, -0.5, 0);
    this.world.addBody(groundBody);
  }

  private animate = (): void => {
    requestAnimationFrame(this.animate);
    if (this.isLoaded) {
      const elapsedTime = this.clock.getElapsedTime();
      const deltaTime = elapsedTime - this.oldElapsedTime;
      this.oldElapsedTime = elapsedTime;
      this.world.step(1 / 60, deltaTime, 3);
      this.orbitControls.update();
      this.meshForUpdate.forEach((item) => {
        if (item?.mesh.id !== this.draggingId) {
          item?.mesh.position.set(
            item.body.position.x,
            item.body.position.y,
            item.body.position.z
          );
          item?.mesh.quaternion.set(
            item.body.quaternion.x,
            item.body.quaternion.y,
            item.body.quaternion.z,
            item.body.quaternion.w
          );
        } else {
          item.body.position.x = item.mesh.position.x;
          item.body.position.y = item.mesh.position.y;
          item.body.position.z = item.mesh.position.z;
          item.body.quaternion.x = item.mesh.quaternion.x;
          item.body.quaternion.y = item.mesh.quaternion.y;
          item.body.quaternion.z = item.mesh.quaternion.z;
          item.body.quaternion.w = item.mesh.quaternion.w;
          item.body.velocity.set(0, 0, 0);
          item.body.angularVelocity.set(0, 0, 0);
        }
      });
      // rerender
      this.renderer.render(this.scene, this.camera);
      if (this.isDebugger) {
        this.debugRenderer.update();
      } else {
        this.scene.children.forEach((item) => {
          if (item.type === 'Mesh' && !this.meshIds.includes(item.id)) {
            this.scene.remove(item);
          }
        });
      }
      if (this.isRainObjects) {
        this.addObjects();
      }
      this.stats.update();
    }
  };

  ngOnInit(): void {}

  ngAfterViewInit(): void {
    this.initScene();
  }
}
