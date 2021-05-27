import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AboutPageComponent } from './about-page/about-page.component';
import { ArcDiagramComponent } from './arc-diagram/arc-diagram.component';
import { DynamicVisPageComponent } from './dynamic-vis-page/dynamic-vis-page.component';
import { ForceGraphComponent } from './force-graph/force-graph.component';
import { HomePageComponent } from './home-page/home-page.component';
//import { AppComponent } from './app.component';   //I hoped to be able to route back to the root... Didn't work yet
import { VisualisationPageComponent } from './visualisation-page/visualisation-page.component';

const routes: Routes = [
  {path: '',  component: HomePageComponent},
  {path: 'static-vis', component: VisualisationPageComponent},
  {path: 'dynamic-vis', component: DynamicVisPageComponent,
  children:[
    {path: 'force', component: ForceGraphComponent, outlet: 'vis1'},
    {path: 'arc', component: ArcDiagramComponent, outlet: 'vis1'},
    {path: 'force', component: ForceGraphComponent, outlet: 'vis2'},
    {path: 'arc', component: ArcDiagramComponent, outlet: 'vis2'}
  ]},
  {path: 'about', component: AboutPageComponent},
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
export const routingComponents = [VisualisationPageComponent];
