import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-nav-bar',
  templateUrl: './nav-bar.component.html',
  styleUrls: ['./nav-bar.component.css']
})
export class NavBarComponent implements OnInit {

  constructor() { }

  ngOnInit(): void {
    // Link UPLOAD button to Modal
    // as from: https://github.com/jgthms/bulma/issues/683 
    document.querySelector('a#open-modal').addEventListener('click', function(event) {
      event.preventDefault();
      var modal = document.querySelector('.modal');  // assuming you have only 1
      var html = document.querySelector('html');
      modal.classList.add('is-active');
      html.classList.add('is-clipped');
    
      modal.querySelector('.modal-background').addEventListener('click', function(e) {
        e.preventDefault();
        modal.classList.remove('is-active');
        html.classList.remove('is-clipped');
      });
    });


  }
  
}
