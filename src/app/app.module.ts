import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule } from '@angular/forms';
// own modules
import { AuthModule } from './modules/auth/auth.module';
import { AppRoutingModule } from './app-routing.module';

// components
import { AppComponent } from './app.component';
import { ThreeConstructorComponent } from './components/three-constructor/three-constructor.component';
import { ThreeTextComponent } from './components/three-text/three-text.component';
import { ThreeTextEditorComponent } from './components/three-text-editor/three-text-editor.component';
import { SideBarComponent } from './components/side-bar/side-bar/side-bar.component';

@NgModule({
  declarations: [
    AppComponent,
    ThreeConstructorComponent,
    ThreeTextComponent,
    ThreeTextEditorComponent,
    SideBarComponent,
  ],
  imports: [BrowserModule, AppRoutingModule, FormsModule, AuthModule],
  bootstrap: [AppComponent],
})
export class AppModule {}
