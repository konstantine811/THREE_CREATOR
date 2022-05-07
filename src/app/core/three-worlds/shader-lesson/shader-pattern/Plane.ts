import Experience from '@app/core/three-worlds/common/Experience';
import Resources from '@core/helpers/utils/Resources';
import Debug from '@core/helpers/utils/Debug';
// libs
import * as THREE from 'three';
import * as dat from 'lil-gui';
// shader
import VertexShader from 'raw-loader!./../shaders/shader-pattern/vertex.glsl';
import FragmentShader from 'raw-loader!./../shaders/shader-pattern/fragment.glsl';

export default class Plane {
  private experience: Experience;
  private scene: THREE.Scene;
  private resources: Resources;
  private geomtery!: THREE.PlaneBufferGeometry;
  private material!: THREE.ShaderMaterial;
  private mesh!: THREE.Mesh;
  private debug!: Debug;
  private debugPlane!: dat.GUI;

  constructor() {
    this.experience = Experience.getInstance();
    this.scene = this.experience.scene;
    this.resources = this.experience.resources;

    // debug
    this.debug = this.experience.debug;
    if (this.debug.active) {
      this.debugPlane = this.experience.debug.ui.addFolder('Plane');
    }
    // setup
    this.setGeometry();
    this.setMaterial();
    this.setMesh();
  }

  setGeometry() {
    this.geomtery = new THREE.PlaneBufferGeometry(3, 3, 64, 64);
  }

  setMaterial() {
    this.material = new THREE.ShaderMaterial({
      vertexShader: VertexShader,
      fragmentShader: FragmentShader,
      side: THREE.DoubleSide,
      // transparent: true,1
    });
  }

  setMesh() {
    this.mesh = new THREE.Mesh(this.geomtery, this.material);
    this.mesh.position.z = 2;
    this.mesh.scale.y = 2 / 3;
    this.mesh.receiveShadow = true;

    this.scene.add(this.mesh);
  }
}
