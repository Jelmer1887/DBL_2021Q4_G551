import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomePageComponent } from './home-page/home-page.component';
//import { AppComponent } from './app.component';   //I hoped to be able to route back to the root... Didn't work yet
import { VisualisationPageComponent } from './visualisation-page/visualisation-page.component';

const routes: Routes = [
  {path: '',  component: HomePageComponent},
  {path: 'visualisation-page', component: VisualisationPageComponent},
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
export const routingComponents = [VisualisationPageComponent];
