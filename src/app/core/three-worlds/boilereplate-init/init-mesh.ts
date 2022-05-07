import Experience from '@app/core/three-worlds/common/Experience';
import Resources from '@core/helpers/utils/Resources';
// libs
import * as THREE from 'three';

export default class Floor {
  private experience: Experience;
  private scene: THREE.Scene;
  private resources: Resources;
  private geomtery!: THREE.CircleGeometry;
  private textures: {
    color: THREE.Texture;
    normal: THREE.Texture;
  } = {} as any;
  private material!: THREE.MeshStandardMaterial;
  private mesh!: THREE.Mesh;

  constructor() {
    this.experience = Experience.getInstance();
    this.scene = this.experience.scene;
    this.resources = this.experience.resources;
    // setup
    this.setGeometry();
    this.setTextures();
    this.setMaterial();
    this.setMesh();
  }

  setGeometry() {}

  setTextures() {}

  setMaterial() {}

  setMesh() {}
}
