import Experience from '@app/core/three-worlds/common/Experience';
import Resources from '@core/helpers/utils/Resources';
import Debug from '@core/helpers/utils/Debug';
// libs
import * as THREE from 'three';
import * as dat from 'lil-gui';
// shaders
import VertexShader from 'raw-loader!./../shaders/vertex.glsl';
import FragmentShader from 'raw-loader!./../shaders/fragment.glsl';
import { SourceName } from '../config/source.config';

export default class Plane {
  private experience: Experience;
  private scene: THREE.Scene;
  private resources: Resources;
  private geomtery!: THREE.PlaneBufferGeometry;
  private textures: {
    color: THREE.Texture;
    normal: THREE.Texture;
  } = {} as any;
  private material!: THREE.ShaderMaterial;
  private mesh!: THREE.Mesh;
  private debug!: Debug;
  private debugPlane!: dat.GUI;
  private flagTexture: THREE.Texture;

  set materialUTime(value: number) {
    this.material.uniforms.uTime.value = value;
  }

  constructor() {
    this.experience = Experience.getInstance();
    this.scene = this.experience.scene;
    this.resources = this.experience.resources;
    this.flagTexture = this.resources.resourceItems[
      SourceName.flag
    ] as THREE.Texture;
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
    const count = this.geomtery.attributes.position.count;
    const randoms = new Float32Array(count);
    for (let i = 0; i < count; i++) {
      randoms[i] = Math.random();
    }
    this.geomtery.setAttribute(
      'aRandom',
      new THREE.BufferAttribute(randoms, 1)
    );
    console.log(this.geomtery.attributes);
  }

  setMaterial() {
    this.material = new THREE.ShaderMaterial({
      vertexShader: VertexShader,
      fragmentShader: FragmentShader,
      side: THREE.DoubleSide,
      uniforms: {
        uFrequency: {
          value: new THREE.Vector2(4, 3),
        },
        uTime: {
          value: 0,
        },
        uColor: {
          value: new THREE.Color('orange'),
        },
        uTexture: {
          value: this.flagTexture,
        },
      },
    });
    if (this.debug.active) {
      this.debugPlane.add(this.material, 'wireframe');
      this.debugPlane
        .add(this.material.uniforms.uFrequency.value, 'x')
        .min(0)
        .max(20)
        .step(0.01)
        .name('frequencyX');

      this.debugPlane
        .add(this.material.uniforms.uFrequency.value, 'y')
        .min(0)
        .max(20)
        .step(0.01)
        .name('frequencyY');
    }
  }

  setMesh() {
    this.mesh = new THREE.Mesh(this.geomtery, this.material);
    this.mesh.position.z = 2;
    this.mesh.scale.y = 2 / 3;
    this.mesh.receiveShadow = true;

    this.scene.add(this.mesh);
  }
}
