import { Component, OnInit, AfterViewInit, ViewChild, Renderer2, NgModule} from '@angular/core';


@Component({
  selector: 'app-dynamic-vis-page',
  templateUrl: './dynamic-vis-page.component.html',
  styleUrls: ['./dynamic-vis-page.component.css']
})
export class DynamicVisPageComponent implements OnInit, AfterViewInit {
  @ViewChild('col1') c1;
  @ViewChild('col2') c2;
  private fullscreen: boolean = false;

  constructor(private renderer: Renderer2) {
    var slider = document.getElementById("myRange");
    var output = document.getElementById("demo");
    //$("p").hide();
}

  ngOnInit(){

}
  

  OnSwitch(){

  }

  ngAfterViewInit() {
    this.renderer.setStyle(
      this.c2.nativeElement,
      'display',
      'none'
    );
  }

}

