import { HttpClient } from '@angular/common/http';
import { Component, ElementRef, ViewChild } from '@angular/core';
import { BarchartComponent } from './barchart/barchart.component';

@Component({
    selector: 'app-root',
    templateUrl: './app.component.html',
    styleUrls: ['./app.component.css']
})

export class AppComponent {
    title = 'file-upload';

    file;

    @ViewChild('fileInput', { static: false }) fileInput: ElementRef;

    constructor(private httpclient: HttpClient) { }

    onFileUpload() {
        const file = this.fileInput.nativeElement.files[0];
        console.log(file);
        if (file.type.split('/')[1] != 'vnd.ms-excel') {
            alert('Please upload a csv file :D');
        }
        this.file = file;

        // We are not uploading the data right now, but this would be a nice feature in the future.
        /*
        const formdata = new FormData();
        formdata.append("file", file);
        this.httpclient.post('http://localhost:4000/file', formdata).subscribe((response) => {
            console.log(response);
            // this.filePath = ;
        });
        */
    }
}
