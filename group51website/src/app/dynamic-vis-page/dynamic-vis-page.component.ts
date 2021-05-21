import { Component, OnInit, AfterViewInit, ViewChild } from '@angular/core';

@Component({
  selector: 'app-dynamic-vis-page',
  templateUrl: './dynamic-vis-page.component.html',
  styleUrls: ['./dynamic-vis-page.component.css']
})
export class DynamicVisPageComponent implements OnInit, AfterViewInit {
  @ViewChild('para1') p1;

  constructor() {
    var slider = document.getElementById("myRange");
    var output = document.getElementById("demo");
    //$("p").hide();
}

  ngOnInit(): void {
  }

  ngAfterViewInit() {
      console.log(this.p1.nativeElement);
  }

}

