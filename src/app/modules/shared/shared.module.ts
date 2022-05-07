import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
// components
import { PreloaderComponent } from './preloader/preloader.component';

@NgModule({
  declarations: [PreloaderComponent],
  imports: [CommonModule],
  exports: [PreloaderComponent],
})
export class SharedModule {}
