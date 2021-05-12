import { Component, ElementRef, ViewChild, OnInit } from '@angular/core';

@Component({
  selector: 'app-nav-bar',
  templateUrl: './nav-bar.component.html',
  styleUrls: ['./nav-bar.component.css']
})
export class NavBarComponent implements OnInit {

  file;

  @ViewChild('fileInput', { static: false }) fileInput: ElementRef;

  constructor() { }

  ngOnInit(): void {
    // Link UPLOAD button to Modal
    // as from: https://github.com/jgthms/bulma/issues/683 
    // REMOVED
  }

  onFileUpload() {
    // get file from button
    const file = this.fileInput.nativeElement.files[0];
    console.log(file);
    if (file.type.split('/')[1] != 'vnd.ms-excel') {
      alert('Please upload a csv file :D');
    }

    this.file = file;

    // update displayed name
    //const fileName = document.querySelector('#file-upload .file-name');
    var labels = document.querySelectorAll('#file-upload .file-name');
    labels.forEach((label) => {label.textContent = file.name; console.log(label);})
    //fileName.textContent = file.name;
  }
}
