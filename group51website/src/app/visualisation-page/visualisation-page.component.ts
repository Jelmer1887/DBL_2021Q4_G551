import { Component, ElementRef, ViewChild, OnInit } from '@angular/core';

@Component({
  selector: 'app-visualisation-page',
  templateUrl: './visualisation-page.component.html',
  styleUrls: ['./visualisation-page.component.css']
})
export class VisualisationPageComponent implements OnInit {

  file;

  @ViewChild('fileInput', { static: false }) fileInput: ElementRef;

  constructor() { }

  ngOnInit(): void {
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
    const fileName = document.querySelector('#file-upload .file-name');
    fileName.textContent = file.name;
  }

}
