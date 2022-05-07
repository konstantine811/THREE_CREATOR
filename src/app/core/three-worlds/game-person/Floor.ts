import InstanceScene from '@core/three-worlds/common/InstanceScene';
import Resources from '@core/helpers/utils/Resources';
// libs
import * as THREE from 'three';
import { SourceName } from '@app/core/three-worlds/code-structuring/config/source.config';

export default class Floor {
  private instanceScene: InstanceScene;
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
    this.instanceScene = InstanceScene.getInstance();
    this.scene = this.instanceScene.scene;
    this.resources = this.instanceScene.resources;
    // setup
    this.setGeometry();
    this.setTextures();
    this.setMaterial();
    this.setMesh();
  }

  setGeometry() {
    this.geomtery = new THREE.CircleGeometry(5, 64);
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
    });
  }

  setMesh() {
    this.mesh = new THREE.Mesh(this.geomtery, this.material);
    this.mesh.rotation.x = -Math.PI * 0.5;
    this.mesh.receiveShadow = true;
    this.scene.add(this.mesh);
  }
}
