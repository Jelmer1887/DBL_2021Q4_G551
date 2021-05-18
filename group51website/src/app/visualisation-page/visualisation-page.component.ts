import { ForceGraphDataShareService } from './../force-graph-data-share.service';
import { Component, ElementRef, ViewChild, OnInit } from '@angular/core';
import { UploadService } from './../upload.service';

@Component({
    selector: 'app-visualisation-page',
    templateUrl: './visualisation-page.component.html',
    styleUrls: ['./visualisation-page.component.css']
})
export class VisualisationPageComponent implements OnInit {

    file;
    showIndividualLinks = false;

    @ViewChild('fileInput', { static: false }) fileInput: ElementRef;

    constructor(private uploadService: UploadService, private FGshareService: ForceGraphDataShareService) { }
    ngOnInit(): void {
        this.uploadService.currentFile.subscribe(newfile => this.file = newfile);
    }

    checkLinksOption(event): void {
        console.log(event);
        this.showIndividualLinks = event.target.checked;
    }

}
