import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AboutPageComponent } from './about-page/about-page.component';
import { DynamicVisPageComponent } from './dynamic-vis-page/dynamic-vis-page.component';
import { HomePageComponent } from './home-page/home-page.component';
//import { AppComponent } from './app.component';   //I hoped to be able to route back to the root... Didn't work yet
import { VisualisationPageComponent } from './visualisation-page/visualisation-page.component';

const routes: Routes = [
  {path: '',  component: HomePageComponent},
  {path: 'static-vis', component: VisualisationPageComponent},
  {path: 'dynamic-vis', component: DynamicVisPageComponent},
  {path: 'about', component: AboutPageComponent}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
export const routingComponents = [VisualisationPageComponent];
