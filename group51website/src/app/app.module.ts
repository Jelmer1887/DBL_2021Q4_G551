import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule, routingComponents } from './app-routing.module';

import { AppComponent } from './app.component';
import { NavBarComponent } from './nav-bar/nav-bar.component';
import { BarchartComponent } from './barchart/barchart.component';
import { ForceGraphComponent } from './force-graph/force-graph.component'

@NgModule({
  declarations: [
    AppComponent,
    routingComponents,    // routingComponents is a list of all components we can route to (excl. root)
    NavBarComponent,
    
    BarchartComponent,
    ForceGraphComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
