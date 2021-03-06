import {
  Component,
  OnInit,
  AfterViewInit,
  ViewChild,
  Renderer2,
  NgModule
} from '@angular/core';


@Component({
  selector: 'app-dynamic-vis-page',
  templateUrl: './dynamic-vis-page.component.html',
  styleUrls: ['./dynamic-vis-page.component.css']
})
export class DynamicVisPageComponent implements OnInit, AfterViewInit {
  @ViewChild('col1') c1;
  @ViewChild('col2') c2;

  constructor(private renderer: Renderer2) {
  }

  ngOnInit() {

  }

  vis1() {
    this.renderer.setStyle(
      this.c2.nativeElement,
      'display',
      'none'
    );
  }
  vis2() {
    this.renderer.setStyle(
      this.c2.nativeElement,
      'display',
      'inline'
    );
  }

  OnSwitch() {

  }

  ngAfterViewInit() {
    this.renderer.setStyle(
      this.c2.nativeElement,
      'display',
      'none'
    );
  }


}
