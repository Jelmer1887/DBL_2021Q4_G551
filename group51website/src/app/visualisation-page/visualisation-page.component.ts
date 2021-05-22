import { ForceGraphDataShareService } from './../force-graph-data-share.service';
import { Component, ElementRef, ViewChild, OnInit } from '@angular/core';
import { UploadService } from './../upload.service';
import { ForceGraphComponent } from './../force-graph/force-graph.component';

@Component({
    selector: 'app-visualisation-page',
    templateUrl: './visualisation-page.component.html',
    styleUrls: ['./visualisation-page.component.css']
})
export class VisualisationPageComponent implements OnInit {

    file;
    showIndividualLinks = false;
    max;

    @ViewChild('fileInput', { static: false }) fileInput: ElementRef;
    @ViewChild(ForceGraphComponent) forcegraph;

    constructor(private uploadService: UploadService, private FGshareService: ForceGraphDataShareService) { }
    ngOnInit(): void {
        this.uploadService.currentFile.subscribe(newfile => this.file = newfile);
    }

    setMaxDate(event): void {
        //change the maximum value on the slider when signal comes from forcegraph
        this.max = this.forcegraph.dateRange;
      }

    

    checkLinksOption(event): void {
        //console.log(event);
        this.showIndividualLinks = event.target.checked;
    }

}
