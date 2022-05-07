import Experience from '@app/core/three-worlds/common/Experience';
import Resources from '@core/helpers/utils/Resources';
// libs
import * as THREE from 'three';
import { AmmoPhysics, ExtendedObject3D } from '@enable3d/ammo-physics';
// config
import { SourceName } from '@app/core/three-worlds/PhysicWord/config/config';
import { ICubeSetting } from '../models/cube.model';
import { IObjectPhysicConfig } from '@app/core/models/mesh.model';

export default class Cube {
  private experience: Experience;
  private scene: THREE.Scene;
  private resources: Resources;
  private geomtery!: THREE.BoxBufferGeometry;
  private physics: AmmoPhysics;
  private textures: {
    color: THREE.Texture;
    normal: THREE.Texture;
  } = {} as any;
  private material!: THREE.MeshStandardMaterial;
  private mesh!: THREE.Mesh;
  private cubeSetting: ICubeSetting;
  private _cubePhysicObject!: ExtendedObject3D;

  get cubePhysicObject(): ExtendedObject3D {
    return this._cubePhysicObject;
  }

  constructor(cubeSetting: ICubeSetting) {
    this.cubeSetting = cubeSetting;
    this.experience = Experience.getInstance();
    this.scene = this.experience.scene;
    this.resources = this.experience.resources;
    this.physics = this.experience.physics;
    // setup
    this.setGeometry();
    this.setTextures();
    this.setMaterial();
    this.setMesh();
  }

  setGeometry() {
    if (this.cubeSetting.size) {
      const {
        width,
        height,
        depth,
        widthSegments,
        heightSegments,
        depthSegments,
      } = this.cubeSetting.size;
      this.geomtery = new THREE.BoxBufferGeometry(
        width,
        height,
        depth,
        widthSegments,
        heightSegments,
        depthSegments
      );
    } else {
      const size = Math.random() + 0.09;
      this.geomtery = new THREE.BoxBufferGeometry(size, size, size);
    }
  }

  setTextures() {
    this.textures.color = this.resources.resourceItems[
      SourceName.cubeColorTexture
    ] as THREE.Texture;
    this.textures.color.encoding = THREE.sRGBEncoding;
    this.textures.color.repeat.set(1.5, 1.5);
    this.textures.color.wrapS = THREE.RepeatWrapping;
    this.textures.color.wrapT = THREE.RepeatWrapping;
    // normal
    this.textures.normal = this.resources.resourceItems[
      SourceName.cubeNormalTexture
    ] as THREE.Texture;
    this.textures.normal.repeat.set(1.5, 1.5);
    this.textures.normal.wrapS = THREE.RepeatWrapping;
    this.textures.normal.wrapT = THREE.RepeatWrapping;
  }

  setMaterial() {
    this.material = new THREE.MeshStandardMaterial({
      map: this.textures.color,
      // normalMap: this.textures.normal,
    });
  }

  setMesh() {
    let xP = 0,
      zP = 0,
      yP = 4;
    const { floorSize, position, physicConfig } = this.cubeSetting;
    let configPhysic: IObjectPhysicConfig = {
      mass: 50,
      collisionFlags: 0,
    };
    if (physicConfig) {
      configPhysic = physicConfig;
    }
    // create mesh
    this.mesh = new THREE.Mesh(this.geomtery, this.material);
    // create physics object
    this._cubePhysicObject = new ExtendedObject3D();
    this._cubePhysicObject.add(this.mesh);
    // randomly positioned relative to floor size
    if (floorSize) {
      xP = (Math.random() - 0.5) * floorSize;
      zP = (Math.random() - 0.5) * floorSize;
    } else if (position) {
      xP = position.x;
      yP = position.y;
      zP = position.z;
    }
    this._cubePhysicObject.position.set(xP, yP, zP);
    this._cubePhysicObject.receiveShadow = true;
    this.scene.add(this._cubePhysicObject);
    this.physics.add.existing(this._cubePhysicObject, configPhysic);
  }
}
