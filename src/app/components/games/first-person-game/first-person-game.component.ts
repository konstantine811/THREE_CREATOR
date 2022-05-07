import {
  AfterViewInit,
  Component,
  ElementRef,
  OnDestroy,
  OnInit,
  ViewChild,
} from '@angular/core';
import { Observable, Subscription } from 'rxjs';
// initScene
import GamePersonInit from '@core/three-worlds/game-person/GamePersonInit';

@Component({
  selector: 'app-first-person-game',
  templateUrl: './first-person-game.component.html',
  styleUrls: ['./first-person-game.component.scss'],
})
export class FirstPersonGameComponent
  implements OnInit, AfterViewInit, OnDestroy
{
  private subcription: Subscription = new Subscription();
  @ViewChild('webgl', { static: true }) private webglEl!: ElementRef;
  gamePerson!: GamePersonInit;
  countLoadResources = 0;
  loadedResourcesItems = 0;
  precentStepPreload = 100;
  stepPreload = 100;
  loadedStepPreload = -100;

  constructor() {}

  ngOnInit(): void {}

  ngAfterViewInit(): void {
    const canvas = this.webglEl.nativeElement as HTMLCanvasElement;
    this.gamePerson = new GamePersonInit(canvas);
    this.countLoadResources = this.gamePerson.countLoadResources;
    this.stepPreload = this.precentStepPreload / this.countLoadResources;
    this.onSubscribe();
  }

  onSubscribe() {
    this.subcription.add(
      this.gamePerson.loadedResourcesItems$.subscribe((count) => {
        this.loadedResourcesItems = count;
        this.loadedStepPreload =
          this.precentStepPreload -
          this.stepPreload * this.loadedResourcesItems;
      })
    );
  }

  getTranslatePosition() {
    return `translateX(-${this.loadedStepPreload}%)`;
  }

  ngOnDestroy(): void {
    this.subcription.unsubscribe();
  }
}
