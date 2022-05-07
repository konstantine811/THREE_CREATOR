import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
// own modules
import { AuthModule } from './modules/auth/auth.module';
import { AppRoutingModule } from './app-routing.module';
import {} from './shared';

// components
import { AppComponent } from './app.component';
import { ThreeConstructorComponent } from './components/three-constructor/three-constructor.component';
import { ThreeTextComponent } from './components/three-text/three-text.component';
import { ThreeTextEditorComponent } from './components/three-text-editor/three-text-editor.component';
import { SideBarComponent } from './components/side-bar/side-bar/side-bar.component';
import { LightFirstComponent } from './components/light/light-first/light-first.component';
import { ShadowsComponent } from './components/light/shadows/shadows.component';
import { HauntedHouseComponent } from './components/light/haunted-house/haunted-house.component';
import { ParticlesComponent } from './components/particles/particles.component';
import { GalaxyGeneratorComponent } from './components/galaxy-generator/galaxy-generator.component';
import { RaycasterPracticComponent } from './components/raycaster-practic/raycaster-practic.component';
import { PortfolioComponent } from './components/portfolio/portfolio.component';
import { PhysicsTrainComponent } from './components/physics/physics-train/physics-train.component';
import { FirsImplementGameComponent } from './components/physics/car-game/firs-implement-game/firs-implement-game.component';
import { PhysicsTrainSecondComponent } from './components/physics/physics-train-second/physics-train-second.component';
import { PhysicsEnable3dComponent } from './components/physics/physics-enable3d/physics-enable3d.component';
import { PhysicsConstrantsTrainComponent } from './components/physics/physics-constrants-train/physics-constrants-train.component';
import { FirstChartTrainComponent } from './components/chart/first-chart-train/first-chart-train.component';
import { FirstLoadModelComponent } from './components/3d-model-train/first-load-model/first-load-model.component';
import { RealisticModelComponent } from './components/3d-model-train/realistic-model/realistic-model.component';
import { CodeSturcturingComponent } from './components/code-sturcturing/code-sturcturing.component';
import { FirstShaderComponent } from './components/shaders-train/first-shader/first-shader.component';
import { PhysicsTrainThirdComponent } from './components/physics/physics-train-third/physics-train-third.component';
import { ShaderPatternComponent } from './components/shaders-train/shader-pattern/shader-pattern.component';
import { FirstPersonGameComponent } from './components/games/first-person-game/first-person-game.component';

@NgModule({
  declarations: [
    AppComponent,
    ThreeConstructorComponent,
    ThreeTextComponent,
    ThreeTextEditorComponent,
    SideBarComponent,
    LightFirstComponent,
    ShadowsComponent,
    HauntedHouseComponent,
    ParticlesComponent,
    GalaxyGeneratorComponent,
    RaycasterPracticComponent,
    PortfolioComponent,
    PhysicsTrainComponent,
    FirsImplementGameComponent,
    PhysicsTrainSecondComponent,
    PhysicsEnable3dComponent,
    PhysicsConstrantsTrainComponent,
    FirstChartTrainComponent,
    FirstLoadModelComponent,
    RealisticModelComponent,
    CodeSturcturingComponent,
    FirstShaderComponent,
    PhysicsTrainThirdComponent,
    ShaderPatternComponent,
    FirstPersonGameComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    FormsModule,
    AuthModule,
    HttpClientModule,
  ],
  bootstrap: [AppComponent],
})
export class AppModule {}
