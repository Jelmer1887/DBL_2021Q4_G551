import { Component, AfterViewInit, ViewChild } from '@angular/core';  // afterviewInit and ViewChild are leftovers that might be used later...
import {NavBarComponent} from './nav-bar/nav-bar.component'

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'group51website';
}
