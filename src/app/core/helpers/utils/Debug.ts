import * as dat from 'lil-gui';

export default class Debug {
  private _active = false;
  private _ui!: dat.GUI;

  get active(): boolean {
    return this._active;
  }

  get ui(): dat.GUI {
    return this._ui;
  }

  constructor() {
    this._active = window.location.hash === '#debug';
    if (this._active) {
      this._ui = new dat.GUI();
    }
  }
}
