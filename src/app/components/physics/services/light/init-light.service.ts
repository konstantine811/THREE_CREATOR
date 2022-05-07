import { Injectable } from '@angular/core';
// libs
import * as THREE from 'three';
import * as dat from 'lil-gui';

@Injectable({
  providedIn: 'root',
})
export class InitLightService {
  constructor() {}

  addAmbientLight(
    scene: THREE.Scene,
    gui: dat.GUI,
    ambientColor = '#ffffff',
    intensity = 0.5
  ) {
    const ambientLight = new THREE.AmbientLight();
    ambientLight.intensity = intensity;
    ambientLight.color = new THREE.Color(ambientColor);
    gui.add(ambientLight, 'intensity', 0, 1, 0.01);
    gui
      .addColor({ color: ambientColor }, 'color')
      .onChange((colorValue: string) => {
        ambientLight.color = new THREE.Color(colorValue);
      });
    scene.add(ambientLight);
  }

  addDirectionalLight(
    scene: THREE.Scene,
    gui: dat.GUI,
    directionalColor = '#cfcfcf',
    x = 0,
    y = 9,
    z = -3,
    rotationZ = 0.66
  ) {
    const directionalLight = new THREE.DirectionalLight();
    const directionalLightHelper = new THREE.DirectionalLightHelper(
      directionalLight,
      5
    );
    directionalLightHelper.visible = false;
    directionalLight.intensity = 0.3;
    directionalLight.color = new THREE.Color(directionalColor);
    directionalLight.position.set(x, y, z);
    directionalLight.rotateZ(rotationZ);
    gui.add(directionalLight, 'intensity', 0, 1, 0.001).name('d intensity');
    gui
      .add(directionalLight.position, 'x', -100, 100, 0.001)
      .name('d position x');
    gui
      .add(directionalLight.position, 'y', -100, 100, 0.001)
      .name('d position y');
    gui
      .add(directionalLight.position, 'z', -100, 100, 0.001)
      .name('d position z');
    gui
      .add(directionalLight.rotation, 'z', -10, 10, 0.001)
      .name('d rotation z');
    gui
      .addColor({ color: directionalColor }, 'color')
      .onChange((colorVal: string) => {
        directionalLight.color = new THREE.Color(colorVal);
      });

    scene.add(directionalLightHelper);
    gui.add(directionalLightHelper, 'visible');
    scene.add(directionalLight);
  }

  addPointLight(scene: THREE.Scene, gui: dat.GUI) {
    const pointLight = new THREE.PointLight(0xff9000, 0.5, 3);
    pointLight.position.set(2.4, 1.1, 3.3);
    const pointLightHelper = new THREE.PointLightHelper(pointLight);
    scene.add(pointLightHelper);
    scene.add(pointLight);
  }

  addHemisphereLight(scene: THREE.Scene, gui: dat.GUI) {
    // hemishpere light
    const hemisphereLight = new THREE.HemisphereLight(0xff0000, 0x0000ff, 0.3);
    hemisphereLight.position.set(-1.1, 2.7, 0.2);
    const hemishpereLightHelper = new THREE.HemisphereLightHelper(
      hemisphereLight,
      0.2
    );
    scene.add(hemishpereLightHelper);
    scene.add(hemisphereLight);
  }

  addSpotLight(
    scene: THREE.Scene,
    gui: dat.GUI,
    color = '#ffffff',
    x = 1.7,
    y = 11.5,
    z = 3,
    intensity = 0.8,
    distance = 17.6,
    angle = 0.7
  ) {
    color = '';
    // spot light
    const spotLight = new THREE.SpotLight(
      color,
      intensity,
      distance,
      angle,
      0.25,
      1
    );
    spotLight.position.set(x, y, z);
    const spotLightHelper = new THREE.SpotLightHelper(spotLight, 0.2);
    spotLightHelper.visible = false;
    gui.add(spotLightHelper, 'visible');
    gui.add(spotLight.position, 'x', -100, 100, 0.1);
    gui.add(spotLight.position, 'y', -100, 100, 0.1);
    gui.add(spotLight.position, 'z', -100, 100, 0.1);
    gui.addColor({ color: color }, 'color').onChange((colorVal: string) => {
      spotLight.color = new THREE.Color(colorVal);
    });
    gui.add(spotLight, 'intensity', 0, 1, 0.1).onChange(() => {
      spotLightHelper.update();
    });
    gui.add(spotLight, 'distance', 0, 100, 0.01).onChange(() => {
      spotLightHelper.update();
    });
    gui.add(spotLight, 'penumbra', 0, 10, 0.1).onChange(() => {
      spotLightHelper.update();
    });
    gui.add(spotLight, 'decay', 0, 10, 0.1).onChange(() => {
      spotLightHelper.update();
    });
    gui.add(spotLight, 'angle', 0, 10, 0.1).onChange(() => {
      spotLightHelper.update();
    });
    spotLightHelper.update();
    scene.add(spotLightHelper);
    scene.add(spotLight);
  }
}
