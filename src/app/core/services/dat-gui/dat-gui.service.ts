import { Injectable } from '@angular/core';
// dat gui
import * as dat from 'lil-gui';

@Injectable({
  providedIn: 'root',
})
export class DatGuiService {
  private _gui!: dat.GUI;

  constructor() {
    this.initDatGui();
  }

  get gui(): dat.GUI {
    return this._gui;
  }

  private initDatGui() {
    this._gui = new dat.GUI();
  }

  addGuiFolderXYZ(
    folderName: string,
    position: THREE.Vector3,
    min = -10,
    max = 10,
    step = 0.1
  ) {
    const cameraGui = this.gui.addFolder(folderName);
    cameraGui.add(position, 'x', min, max, step);
    cameraGui.add(position, 'y', min, max, step);
    cameraGui.add(position, 'z', min, max, step);
  }
}
