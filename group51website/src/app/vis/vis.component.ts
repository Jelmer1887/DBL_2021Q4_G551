import { Component, ElementRef, ViewChild, OnInit } from '@angular/core';

@Component({
    selector: 'app-vis',
    templateUrl: './vis.component.html',
    styles: [
    ]
})

export class VisComponent implements OnInit {

    file;

    @ViewChild('fileInput', { static: false }) fileInput: ElementRef;

    constructor() { }

    ngOnInit(): void {
    }

    onFileUpload() {
        const file = this.fileInput.nativeElement.files[0];
        console.log(file);
        if (file.type.split('/')[1] != 'vnd.ms-excel') {
            alert('Please upload a csv file :D');
        }

        this.file = file;
    }

}
