import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-home-page',
  templateUrl: './home-page.component.html',
  styleUrls: ['./home-page.component.css'],
  styles: [`
  .hero {
    background-image: url('assets/graphBackground.png') !important;
    background-size: cover;
    background-position: center center;
  }
`]
})
export class HomePageComponent implements OnInit {

  constructor() { }

  ngOnInit(): void {
  }
  

}
