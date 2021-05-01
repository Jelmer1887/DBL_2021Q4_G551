import { HttpClient } from '@angular/common/http';
import { Component, ElementRef, ViewChild } from '@angular/core';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})

export class AppComponent {
  title = 'file-upload';

  @ViewChild('fileInput',{ static : false }) fileInput: ElementRef;

  constructor(private httpclient : HttpClient){ }

  onFileUpload(){
    const file = this.fileInput.nativeElement.files[0];
    console.log(file);
    if(file.type.split('/')[1]!='vnd.ms-excel'){
      alert('Please upload a csv file :D');
    }
    const formdata = new FormData();
    formdata.append("file",file);
    this.httpclient.post('http://localhost:4000/file', formdata).subscribe((response) => {
       console.log(response);
    });
  }

  getFile(): Observable<any> {
    return this.http.get(`${this.baseUrl}/files`);
  }
}
