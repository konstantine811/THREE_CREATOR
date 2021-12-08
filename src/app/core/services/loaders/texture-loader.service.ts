import { Injectable } from '@angular/core';
// threejs
import * as THREE from 'three';

@Injectable({
  providedIn: 'root',
})
export class TextureLoaderService {
  private textureLoader!: THREE.TextureLoader;
  private _pathToTexture = './assets/textures';

  constructor() {
    this.initLoaer();
  }

  set pathToTexture(path: string) {
    this._pathToTexture = path;
  }

  getTextureByPath(path: string): THREE.Texture {
    return this.textureLoader.load(this._pathToTexture + path);
  }

  initLoaer() {
    const loadingManager = new THREE.LoadingManager();
    loadingManager.onStart = () => {
      console.log('on start');
    };
    loadingManager.onLoad = () => {
      console.log('on load');
    };
    loadingManager.onProgress = () => {
      console.log('on progress');
    };
    loadingManager.onError = () => {
      console.log('on error');
    };
    this.textureLoader = new THREE.TextureLoader(loadingManager);
  }
}
