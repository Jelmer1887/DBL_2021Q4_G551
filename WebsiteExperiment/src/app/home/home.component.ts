import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-home',
  template: `
  <section class="hero is-primary is-bold is-fullheight">
  <div class="hero-body">
    <p style="color:black; "class="title">
      Home page!
    </p>
  </div>
  </section>
  `,
  styles: [`
    .hero {
      background-image: url('/assets/img/background.jpg') !important;
      background-size: cover;
      background-position: center center;
    }
  `]
})
export class HomeComponent implements OnInit {

  constructor() { }

  ngOnInit(): void {
  }

}
