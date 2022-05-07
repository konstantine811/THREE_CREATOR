import Experience from '@app/core/three-worlds/common/Experience';
import Resources from '@core/helpers/utils/Resources';
// libs
import * as THREE from 'three';
import { AmmoPhysics, ExtendedObject3D } from '@enable3d/ammo-physics';
// config
import { SourceName } from '@app/core/three-worlds/PhysicWord/config/config';

export default class Floor {
  private experience: Experience;
  private scene: THREE.Scene;
  private resources: Resources;
  private geomtery!: THREE.CircleGeometry;
  private physics: AmmoPhysics;
  private textures: {
    color: THREE.Texture;
    normal: THREE.Texture;
  } = {} as any;
  private material!: THREE.MeshStandardMaterial;
  private mesh!: THREE.Mesh;
  private size;
  private _floorPhysicObject!: ExtendedObject3D;

  get floorPhysicObject() {
    return this._floorPhysicObject;
  }

  constructor(size = 10) {
    this.size = size;
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
    this.geomtery = new THREE.CircleGeometry(this.size, 64);
  }

  setTextures() {
    this.textures.color = this.resources.resourceItems[
      SourceName.grassColorTexture
    ] as THREE.Texture;
    this.textures.color.encoding = THREE.sRGBEncoding;
    this.textures.color.repeat.set(1.5, 1.5);
    this.textures.color.wrapS = THREE.RepeatWrapping;
    this.textures.color.wrapT = THREE.RepeatWrapping;
    // normal
    this.textures.normal = this.resources.resourceItems[
      SourceName.grassNormalTexture
    ] as THREE.Texture;
    this.textures.normal.repeat.set(1.5, 1.5);
    this.textures.normal.wrapS = THREE.RepeatWrapping;
    this.textures.normal.wrapT = THREE.RepeatWrapping;
  }

  setMaterial() {
    this.material = new THREE.MeshStandardMaterial({
      map: this.textures.color,
      normalMap: this.textures.normal,
      side: THREE.DoubleSide,
    });
  }

  setMesh() {
    this.mesh = new THREE.Mesh(this.geomtery, this.material);
    this._floorPhysicObject = new ExtendedObject3D();
    this._floorPhysicObject.add(this.mesh);
    this._floorPhysicObject.rotateX(-Math.PI * 0.5);
    this._floorPhysicObject.receiveShadow = true;
    this.scene.add(this._floorPhysicObject);
    this.physics.add.existing(this._floorPhysicObject, {
      collisionFlags: 2,
      shape: 'concave',
      mass: 0,
    });
  }
}
