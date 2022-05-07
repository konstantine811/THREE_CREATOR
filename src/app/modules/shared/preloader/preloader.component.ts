import { Component, Input, OnDestroy } from '@angular/core';
import { Observable, Subscription } from 'rxjs';

@Component({
  selector: 'app-preloader',
  templateUrl: './preloader.component.html',
  styleUrls: ['./preloader.component.scss'],
})
export class PreloaderComponent implements OnDestroy {
  private subcription: Subscription = new Subscription();
  @Input() set countLoadResources(count: number) {
    this.stepPreload = this.precentStepPreload / count;
  }
  @Input() set loadedResourcesItems$(loaded$: Observable<number>) {
    this.subcription.add(
      loaded$.subscribe((count) => {
        this.loadedResourcesItems = count;
        this.loadedStepPreload =
          this.stepPreload * this.loadedResourcesItems -
          this.precentStepPreload;
      })
    );
  }
  private loadedResourcesItems = 0;
  private readonly precentStepPreload = 100;
  private stepPreload = 100;
  private loadedStepPreload = -100;

  constructor() {}

  getTranslatePosition() {
    return `translateX(-${this.loadedStepPreload}%)`;
  }

  ngOnDestroy(): void {
    this.subcription.unsubscribe();
  }
}
