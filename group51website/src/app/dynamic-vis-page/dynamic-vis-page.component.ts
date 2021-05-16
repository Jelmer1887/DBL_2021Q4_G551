import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-dynamic-vis-page',
  templateUrl: './dynamic-vis-page.component.html',
  styleUrls: ['./dynamic-vis-page.component.css']
})
export class DynamicVisPageComponent implements OnInit {

  constructor() {
    var slider = document.getElementById("myRange");
    var output = document.getElementById("demo");
    //$("p").hide();
}

  ngOnInit(): void {
  }

}
