import { Component, ElementRef, ViewChild, OnInit } from '@angular/core';
import { UploadService } from './../upload.service';

@Component({
  selector: 'app-visualisation-page',
  templateUrl: './visualisation-page.component.html',
  styleUrls: ['./visualisation-page.component.css']
})
export class VisualisationPageComponent implements OnInit {

  file;

  @ViewChild('fileInput', { static: false }) fileInput: ElementRef;

  constructor(private uploadService : UploadService) {  }
  ngOnInit(): void {
    this.uploadService.currentFile.subscribe(newfile => this.file = newfile);
  }

  

}
