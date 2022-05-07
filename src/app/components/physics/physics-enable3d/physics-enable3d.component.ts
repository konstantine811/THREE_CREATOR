import { Component, HostListener, OnInit } from '@angular/core';
// libs
import {
  AmmoPhysics,
  ExtendedObject3D,
  PhysicsLoader,
} from '@enable3d/ammo-physics';
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';
import { OBJLoader } from 'three/examples/jsm/loaders/OBJLoader';
import * as dat from 'lil-gui';
import Stats from 'three/examples/jsm/libs/stats.module';
import { FBXLoader } from 'three/examples/jsm/loaders/FBXLoader';

interface IRightLeftRotor {
  right: Ammo.btHingeConstraint;
  left: Ammo.btHingeConstraint;
}

@Component({
  selector: 'app-physics-enable3d',
  templateUrl: './physics-enable3d.component.html',
  styleUrls: ['./physics-enable3d.component.scss'],
})
export class PhysicsEnable3dComponent implements OnInit {
  private scene!: THREE.Scene;
  private camera!: THREE.PerspectiveCamera;
  private renderer!: THREE.WebGLRenderer;
  private physics!: AmmoPhysics;
  private clock = new THREE.Clock();
  private objLoader!: OBJLoader;
  private fbxLoader!: FBXLoader;
  private gui!: dat.GUI;
  private stats!: Stats;
  private blocks: ExtendedObject3D[] = [];
  private block!: ExtendedObject3D | null;
  private raycaster!: THREE.Raycaster;
  private mousePosition = new THREE.Vector3();
  private blockOffset = new THREE.Vector3();
  private prev = { x: 0, y: 0 };
  private currentPointer = { x: 0, y: 0 };
  private isDragging = false;
  private controls!: OrbitControls;

  // car
  private motorBackLeft!: Ammo.btHingeConstraint;
  private motorBackRight!: Ammo.btHingeConstraint;
  private motorFrontLeft!: Ammo.btHingeConstraint;
  private motorFrontRight!: Ammo.btHingeConstraint;
  private m0!: IRightLeftRotor;
  private plateCar!: ExtendedObject3D;

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

  @HostListener('window:mouseup', ['$event'])
  onMouseUp() {
    this.block?.body.setCollisionFlags(0);
    this.block = null;
    this.isDragging = false;
    this.controls.enabled = true;
  }

  @HostListener('window:mousedown', ['$event'])
  onMouseDown(event: MouseEvent) {
    const { clientX, clientY } = event;
    const x = (clientX / window.innerWidth) * 2 - 1;
    const y = -(clientY / window.innerHeight) * 2 + 1;
    this.raycaster.setFromCamera({ x, y }, this.camera);
    const intersection = this.raycaster.intersectObjects(this.blocks);
    if (intersection.length > 0) {
      this.isDragging = true;
      this.block = intersection[0].object.parent as ExtendedObject3D;
      this.block.body?.setCollisionFlags(2);
      this.mousePosition.copy(intersection[0].point);
      this.blockOffset.subVectors(this.block.position, this.mousePosition);
    }
    this.prev = { x, y };
  }

  @HostListener('window:mousemove', ['$event'])
  onMouseMove(event: MouseEvent) {
    if (this.isDragging) {
      const { clientX, clientY } = event;
      const x = (clientX / window.innerWidth) * 2 - 1;
      const y = -(clientY / window.innerHeight) * 2 + 1;
      this.currentPointer = { x, y };
      this.controls.enabled = false;
    }
  }

  initScene = () => {
    // scene
    this.scene = new THREE.Scene();
    this.scene.background = new THREE.Color(0xf0f0f0);

    // camera
    this.camera = new THREE.PerspectiveCamera(
      50,
      window.innerWidth / window.innerHeight,
      0.1,
      1000
    );
    this.camera.position.set(10, 10, 20);
    const tuning = new Ammo.btVehicleTuning();
    // renderer
    this.renderer = new THREE.WebGLRenderer();
    this.renderer.setSize(window.innerWidth, window.innerHeight);
    document.body.appendChild(this.renderer.domElement);

    // dpr
    const DPR = window.devicePixelRatio;
    this.renderer.setPixelRatio(Math.min(2, DPR));

    this.raycaster = new THREE.Raycaster();

    // orbit controls
    this.controls = new OrbitControls(this.camera, this.renderer.domElement);

    // light
    this.scene.add(new THREE.HemisphereLight(0xffffbb, 0x080820, 1));
    this.scene.add(new THREE.AmbientLight(0x666666));
    const light = new THREE.DirectionalLight(0xdfebff, 1);
    light.position.set(50, 200, 100);
    light.position.multiplyScalar(1.3);

    this.objLoader = new OBJLoader();
    this.fbxLoader = new FBXLoader();
    // physics
    this.physics = new AmmoPhysics(this.scene);
    this.physics.debug?.enable();
    this.physics.debug?.mode(2048 + 4096);

    // static ground
    const ground = this.physics.add.ground({ width: 200, height: 200 });
    ground.body.setFriction(3);
    this.stats = Stats();
    document.body.appendChild(this.stats.dom);
    this.gui = new dat.GUI();
    this.gui.add(this, 'addSuzana');
    this.gui.add(this, 'addCar');
    this.gui.add(this, 'addPlate');

    this.addWheelCar();
    this.animate();
  };

  addPlate() {
    const boxGeometry = new THREE.BoxBufferGeometry(1.8, 0.3, 4.7);
    const boxMaterial = new THREE.MeshLambertMaterial({
      wireframe: true,
    });
    const mesh = new THREE.Mesh(boxGeometry, boxMaterial);
    mesh.position.set(0, 0, 0);
    const object = new ExtendedObject3D();
    object.add(mesh);
    object.position.set(0, 1, 0);
    this.physics.add.existing(object, {
      mass: 50,
    });
    this.scene.add(object);
    return object;
  }

  addAxis(z: number, radius = 0.06) {
    const cylinderGeometry = new THREE.CylinderBufferGeometry(
      radius,
      radius,
      2.6
    );
    const cylinderMaterial = new THREE.MeshLambertMaterial({
      wireframe: true,
      color: 'blue',
      transparent: true,
      opacity: 0.5,
    });
    const mesh = new THREE.Mesh(cylinderGeometry, cylinderMaterial);
    mesh.position.set(0, 0, 0);
    const object = new ExtendedObject3D();
    object.add(mesh);
    object.position.set(0, 1, z);
    object.rotateZ(Math.PI / 2);
    this.scene.add(object);
    this.physics.add.existing(object, { mass: 10 });
    return object;
  }

  addRotor(x: number, z: number) {
    const cylinderGeometry = new THREE.CylinderBufferGeometry(
      0.35,
      0.35,
      0.4,
      24
    );
    const cylinderMaterial = new THREE.MeshLambertMaterial({
      transparent: true,
      opacity: 0.5,
      color: 'red',
    });
    const mesh = new THREE.Mesh(cylinderGeometry, cylinderMaterial);
    mesh.position.set(0, 0, 0);
    const object = new ExtendedObject3D();
    object.add(mesh);
    object.position.set(x, 1, z);
    object.rotateZ(Math.PI / 2);
    this.scene.add(object);
    this.physics.add.existing(object, { mass: 10 });
    return object;
  }

  addWheel(x: number, z: number) {
    const cylinderGeometry = new THREE.CylinderBufferGeometry(
      0.5,
      0.5,
      0.35,
      24
    );
    const cylinderMaterial = new THREE.MeshLambertMaterial({
      transparent: true,
      opacity: 0.5,
      color: 'blue',
    });
    const mesh = new THREE.Mesh(cylinderGeometry, cylinderMaterial);
    mesh.position.set(0, 0, 0);
    const object = new ExtendedObject3D();
    object.add(mesh);
    object.position.set(x, 1, z);
    object.rotateZ(Math.PI / 2);
    this.scene.add(object);
    this.physics.add.existing(object, { mass: 20 });
    object.body.setFriction(3);
    return object;
  }

  addAxisRotor(x: number, y: number, z: number) {
    const boxGeometry = new THREE.BoxBufferGeometry(0.25, 0.2, 1);
    const boxMaterial = new THREE.MeshLambertMaterial({
      transparent: true,
      opacity: 0.5,
    });
    const mesh = new THREE.Mesh(boxGeometry, boxMaterial);
    mesh.position.set(0, 0, 0);
    const object = new ExtendedObject3D();
    object.add(mesh);
    object.position.set(x, y, z);
    this.scene.add(object);
    this.physics.add.existing(object, {
      mass: 5,
    });
    return object;
  }

  addWheelCar() {
    const wheelX = 1.5;
    const wheelZ = 2;
    const axisZ = 0.2;
    // blue wheels
    const wheelBackRight = this.addWheel(wheelX, wheelZ);
    const wheelBackLeft = this.addWheel(-wheelX, wheelZ);
    const wheelFrontRight = this.addWheel(wheelX, -wheelZ);
    const wheelFrontLeft = this.addWheel(-wheelX, -wheelZ);

    // red rotors =
    const rotorBackRight = this.addRotor(wheelX, wheelZ);
    const rotorBackLeft = this.addRotor(-wheelX, wheelZ);
    const rotorFrontRight = this.addRotor(wheelX, -wheelZ);
    const rotorFrontLeft = this.addRotor(-wheelX, -wheelZ);

    const axisBackOne = this.addAxis(wheelZ);
    const axisFrontOne = this.addAxis(-wheelZ + axisZ, 0.04);
    const axisFrontTwo = this.addAxis(-wheelZ - axisZ);

    // Constraints

    const wheelToRotorConstraint = { axisA: { y: 1 }, axisB: { y: 1 } };
    this.motorBackLeft = this.physics.add.constraints.hinge(
      wheelBackLeft.body,
      rotorBackLeft.body,
      wheelToRotorConstraint
    );

    this.motorBackRight = this.physics.add.constraints.hinge(
      wheelBackRight.body,
      rotorBackRight.body,
      wheelToRotorConstraint
    );

    this.motorFrontLeft = this.physics.add.constraints.hinge(
      wheelFrontLeft.body,
      rotorFrontLeft.body,
      wheelToRotorConstraint
    );
    this.motorFrontRight = this.physics.add.constraints.hinge(
      wheelFrontRight.body,
      rotorFrontRight.body,
      wheelToRotorConstraint
    );

    this.physics.add.constraints.lock(rotorBackRight.body, axisBackOne.body);
    this.physics.add.constraints.lock(rotorBackLeft.body, axisBackOne.body);

    this.m0 = this.axisToRotor(
      rotorFrontRight,
      rotorFrontLeft,
      axisFrontTwo,
      -0
    );
    this.axisToRotor(rotorFrontRight, rotorFrontLeft, axisFrontOne, 0.4);

    this.plateCar = this.addPlate();
    this.plateCar.add(this.camera);
    this.camera.lookAt(this.plateCar.position.clone());
    this.physics.add.constraints.lock(this.plateCar.body, axisBackOne.body);
    this.physics.add.constraints.lock(this.plateCar.body, axisFrontTwo.body);

    const limit = 0.3;
    const dofSettings = {
      angularLowerLimit: { x: 0, y: 0, z: 0 },
      angularUpperLimit: { x: 0, y: 0, z: 0 },
      linearLowerLimit: { x: 0, y: -limit, z: -0.1 },
      linearUpperLimit: { x: 0, y: limit, z: 0.1 },
    };
    this.physics.add.constraints.dof(this.plateCar.body, axisFrontOne.body, {
      ...dofSettings,
      offset: { y: 0.9 },
    });
    this.physics.add.constraints.dof(this.plateCar.body, axisFrontOne.body, {
      ...dofSettings,
      offset: { y: -0.9 },
    });

    this.m0.left.enableAngularMotor(true, 0, 1000);
    this.m0.right.enableAngularMotor(true, 0, 1000);
  }

  axisToRotor(
    rotorRight: ExtendedObject3D,
    rotorLeft: ExtendedObject3D,
    axis: ExtendedObject3D,
    z: number
  ): IRightLeftRotor {
    const right = this.physics.add.constraints.hinge(
      rotorRight.body,
      axis.body,
      {
        pivotA: { y: 0.2, z: z },
        pivotB: { y: -1.3 },
        axisA: { x: 1 },
        axisB: { x: 1 },
      }
    );
    const left = this.physics.add.constraints.hinge(rotorLeft.body, axis.body, {
      pivotA: { y: -0.2, z: z },
      pivotB: { y: 1.3 },
      axisA: { x: 1 },
      axisB: { x: 1 },
    });
    return { right, left };
  }

  addCar() {
    this.fbxLoader.load(
      './assets/3d/ford-mustang.fbx',
      (objectM: THREE.Group) => {
        const carMesh = objectM.children[0] as THREE.Mesh;
        carMesh.position.set(0, 0, 0);
        carMesh.scale.set(10, 10, 10);
        const object = new ExtendedObject3D();
        object.add(carMesh);
        object.position.z = 6;
        object.position.y = 10;
        this.scene.add(object);
        this.physics.add.existing(object, { shape: 'hull' });
        this.blocks.push(object);
      }
    );
  }

  addSuzana() {
    this.objLoader.load('./assets/3d/suzana.obj', (objectM: THREE.Group) => {
      const suzanaMesh = objectM.children[0] as THREE.Mesh;
      const object = new ExtendedObject3D();
      object.add(suzanaMesh);
      object.position.z = 6;
      object.position.y = 10;
      this.scene.add(object);
      this.physics.add.existing(object, { shape: 'hull' });
      this.blocks.push(object);
    });
  }
  animate = () => {
    requestAnimationFrame(this.animate);
    this.physics.update(this.clock.getDelta() * 1000);
    this.physics.updateDebugger();
    this.renderer.render(this.scene, this.camera);
    this.stats.update();

    if (this.block?.body?.getCollisionFlags() === 2) {
      const { x, y } = this.currentPointer;
      const speed = 14;
      const movementX = (x - this.prev.x) * speed;
      const movementZ = (y - this.prev.y) * -speed;

      // since the scene has a rotation of -Math.PI / 4,
      // we adjust the movement by -Math.PI / 4
      const v3 = new THREE.Vector3(movementX, -movementZ, movementZ);
      v3.applyAxisAngle(new THREE.Vector3(0, 0, 0), -Math.PI / 4);

      this.block.position.x += v3.x;
      this.block.position.y += v3.y;
      this.block.position.z += v3.z;

      this.block.body.needUpdate = true;

      this.prev = { x, y };
    }
  };

  ngOnInit(): void {
    PhysicsLoader('./assets/ammo.js-main/builds', () => this.initScene());
  }
}
