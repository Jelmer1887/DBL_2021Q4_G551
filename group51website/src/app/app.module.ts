import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule, routingComponents } from './app-routing.module';

import { AppComponent } from './app.component';
import { NavBarComponent } from './nav-bar/nav-bar.component';
import { BarchartComponent } from './barchart/barchart.component';
import { ForceGraphComponent } from './force-graph/force-graph.component';
import { ArcDiagramComponent } from 'src/app/arc-diagram/arc-diagram.component';
import { MatrixComponent } from './matrix/matrix.component';
import { HomePageComponent } from './home-page/home-page.component';
import { FooterComponent } from './footer/footer.component';
import { DynamicVisPageComponent } from './dynamic-vis-page/dynamic-vis-page.component';
import { AboutPageComponent } from './about-page/about-page.component'
import { FormsModule } from '@angular/forms';

@NgModule({
    declarations: [
        AppComponent,
        routingComponents,    // routingComponents is a list of all components we can route to (excl. root)
        NavBarComponent,
        BarchartComponent,
        ForceGraphComponent,
        ArcDiagramComponent,
        MatrixComponent,
        HomePageComponent,
        FooterComponent,
        DynamicVisPageComponent,
        AboutPageComponent,
    ],
    imports: [
        BrowserModule,
        AppRoutingModule,
        FormsModule
    ],
    providers: [],
    bootstrap: [AppComponent]
})
export class AppModule { }
