import SceneBus from './SceneBus';
// three
import * as THREE from 'three';
import * as dat from 'lil-gui';
// other utils
import Resources from '../utils/Resources';
import Debug from '../utils/Debug';

export default class Environment {
  private sceneBus: SceneBus;
  private scene: THREE.Scene;
  private sunLight!: THREE.DirectionalLight;
  private resources: Resources;
  private environmentMap: {
    intensity: number;
    texture: THREE.CubeTexture;
    updateMaterials: Function;
  } = {} as any;
  private debug: Debug;
  private debugFolder!: dat.GUI;

  constructor() {
    this.sceneBus = SceneBus.getSceneInstance();
    this.scene = this.sceneBus.scene;
    this.resources = this.sceneBus.resources;

    this.debug = this.sceneBus.debug;
    if (this.debug.active) {
      this.debugFolder = this.debug.ui.addFolder('environment');
      this.debugFolder.close();
    }

    this.setSunLight();
    if (this.resources) {
      this.setEnvironmentMap();
    }
  }

  setSunLight() {
    this.sunLight = new THREE.DirectionalLight('#ffffff', 4);
    const sunLightHelper = new THREE.DirectionalLightHelper(this.sunLight, 5);
    this.sunLight.castShadow = true;
    this.sunLight.shadow.camera.far = 150;
    this.sunLight.shadow.mapSize.set(1024, 1024);
    this.sunLight.position.set(3.5, 2, -1.25);
    this.scene.add(this.sunLight);
    this.scene.add(sunLightHelper);
    sunLightHelper.visible = false;
    if (this.debug.active) {
      this.debugFolder
        .add(this.sunLight, 'intensity')
        .name('sunLightIntensity')
        .min(0)
        .max(10)
        .step(0.001);

      this.debugFolder
        .add(this.sunLight.position, 'x')
        .name('sunLightX')
        .min(-50)
        .max(50)
        .step(0.001);

      this.debugFolder
        .add(this.sunLight.position, 'y')
        .name('sunLightY')
        .min(-50)
        .max(50)
        .step(0.001);

      this.debugFolder
        .add(this.sunLight.position, 'z')
        .name('sunLightZ')
        .min(-50)
        .max(50)
        .step(0.001);

      this.debugFolder.add(sunLightHelper, 'visible');
    }
  }

  setEnvironmentMap() {
    this.environmentMap.intensity = 0.4;
    this.environmentMap.texture = this.resources.resourceItems
      .environmentMapTexture as THREE.CubeTexture;
    this.environmentMap.texture.encoding = THREE.sRGBEncoding;
    this.scene.environment = this.environmentMap.texture;

    this.environmentMap.updateMaterials = () => {
      this.scene.traverse((child) => {
        if (
          child instanceof THREE.Mesh &&
          child.material instanceof THREE.MeshStandardMaterial
        ) {
          child.material.envMap = this.environmentMap.texture;
          child.material.envMapIntensity = this.environmentMap.intensity;
          child.material.needsUpdate = true;
        }
      });
    };
    this.environmentMap.updateMaterials();

    // Debug
    if (this.debug.active) {
      this.debugFolder
        .add(this.environmentMap, 'intensity')
        .name('envMapIntensity')
        .min(0)
        .max(4)
        .step(0.001)
        .onChange(this.environmentMap.updateMaterials);
    }
  }
}
