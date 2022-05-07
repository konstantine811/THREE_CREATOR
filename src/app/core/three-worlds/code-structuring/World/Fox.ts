import Experience from '../../common/Experience';
import Resources from '../../../helpers/utils/Resources';
import Time from '../../../helpers/utils/Time';
import Debug from '../../../helpers/utils/Debug';
// libs
import * as THREE from 'three';
import { GLTF } from 'three/examples/jsm/loaders/GLTFLoader';
import * as dat from 'lil-gui';
// soruce
import { SourceName } from '@app/core/three-worlds/code-structuring/config/source.config';

enum actionsName {
  idle = 'idle',
  walking = 'walking',
  running = 'running',
  current = 'current',
}

export default class Fox {
  private experience: Experience;
  private scene: THREE.Scene;
  private resources: Resources;
  private foxModel: GLTF;
  private model!: THREE.Group;

  private animation: {
    mixer: THREE.AnimationMixer;
    actions: {
      [key in actionsName]: THREE.AnimationAction;
    };
    play: (name: actionsName) => void;
  } = {} as any;
  private time: Time;
  private debug: Debug;
  private debugFolder!: dat.GUI;

  constructor() {
    this.experience = Experience.getInstance();
    this.scene = this.experience.scene;
    this.resources = this.experience.resources;
    this.time = this.experience.time;
    this.debug = this.experience.debug;
    if (this.debug.active) {
      this.debugFolder = this.debug.ui.addFolder('fox');
    }

    // setup
    this.foxModel = this.resources.resourceItems[SourceName.foxModel] as GLTF;
    this.setModel();
    this.setAnimation();
  }

  setModel() {
    this.model = this.foxModel.scene;
    this.model.scale.set(0.02, 0.02, 0.02);
    this.scene.add(this.model);
    this.model.traverse((child) => {
      if (child instanceof THREE.Mesh) {
        child.castShadow = true;
      }
    });
  }

  setAnimation() {
    this.animation.mixer = new THREE.AnimationMixer(this.model);
    this.animation.actions = {
      idle: this.animation.mixer.clipAction(this.foxModel.animations[0]),
      walking: this.animation.mixer.clipAction(this.foxModel.animations[1]),
      running: this.animation.mixer.clipAction(this.foxModel.animations[2]),
      current: this.animation.mixer.clipAction(this.foxModel.animations[0]),
    };
    this.animation.actions.current.play();
    this.animation.play = (name: actionsName) => {
      const newAction = this.animation.actions[name];
      const oldAction = this.animation.actions.current;
      newAction.reset();
      newAction.play();
      newAction.crossFadeFrom(oldAction, 1, true);
      this.animation.actions.current = newAction;
    };

    // Debug
    if (this.debug.active) {
      const debugObject = {
        playIdle: () => {
          this.animation.play(actionsName.idle);
        },
        playWalk: () => {
          this.animation.play(actionsName.walking);
        },
        playRun: () => {
          this.animation.play(actionsName.running);
        },
      };
      this.debugFolder.add(debugObject, 'playIdle');
      this.debugFolder.add(debugObject, 'playWalk');
      this.debugFolder.add(debugObject, 'playRun');
    }
  }

  update() {
    this.animation.mixer.update(this.time.delta * 0.001);
  }
}
