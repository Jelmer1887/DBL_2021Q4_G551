import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-vis',
  template: `
  <section class="section is-large">
    <h1 class="title">Vis1</h1>
  </section>
  <section class="section is-large">
    <h1 class="title">Vis2</h1>
  </section>
  `,
  styles: [
  ]
})
export class VisComponent implements OnInit {

  constructor() { }

  ngOnInit(): void {
  }

}
