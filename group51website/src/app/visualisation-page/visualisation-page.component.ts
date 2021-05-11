import { UploadService } from './../upload.service';
import { Component, ElementRef, ViewChild, OnInit, Input } from '@angular/core';
import { AppComponent } from  './../app.component'

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
    this.getFile();
  }
  
  getFile(): void {
    this.uploadService.getFile().subscribe(newfile => this.file = newfile);
  }

  /*
  onFileUpload() {
    // get file from button
    const file = this.fileInput.nativeElement.files[0];
    console.log(file);
    if (file.type.split('/')[1] != 'vnd.ms-excel') {
      alert('Please upload a csv file :D');
    }

    this.file = file;
  }
  */

}
