import { Injectable } from '@angular/core';
// threejs
import { Font, FontLoader } from 'three/examples/jsm/loaders/FontLoader';

@Injectable({
  providedIn: 'root',
})
export class FontLoaderService {
  private _assetsPath = 'assets/fonts';

  set assetsPath(path: string) {
    this._assetsPath = path;
  }

  constructor() {}

  loadFont(path: string): Promise<Font> {
    const fontLoader = new FontLoader();
    return fontLoader.loadAsync(this._assetsPath + path);
  }
}
