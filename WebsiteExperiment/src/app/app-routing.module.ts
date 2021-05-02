import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ContactComponent } from './contact/contact.component';
import { HomeComponent } from './home/home.component';
import { VisComponent } from './vis/vis.component';
import { BarchartComponent } from './barchart/barchart.component';

const routes: Routes = [
    {
        path: '',
        component: HomeComponent
    },
    {
        path: 'contact',
        component: ContactComponent
    },
    {
        path: 'vis',
        component: VisComponent
    }
];

@NgModule({
    imports: [RouterModule.forRoot(routes)],
    exports: [RouterModule]
})
export class AppRoutingModule { }
