import { emptyData, UploadService } from './../upload.service';
import { Component, ElementRef, ViewChild, OnInit } from '@angular/core';

@Component({
    selector: 'app-nav-bar',
    templateUrl: './nav-bar.component.html',
    styleUrls: ['./nav-bar.component.css']
})

export class NavBarComponent implements OnInit {

    file;
    data: Data = emptyData();

    @ViewChild('fileInput', { static: false }) fileInput: ElementRef;

    constructor(private uploadService: UploadService) { }
    ngOnInit(): void {
        this.uploadService.currentData.subscribe(newData => this.data = newData);
    }

    onFileUpload() {
        // get file from button
        const file = this.fileInput.nativeElement.files[0];
        console.log(file);
        if (file.type.split('/')[1] != 'vnd.ms-excel') {
            alert('Please upload a csv file :D');
        }

        let fileReader = new FileReader();
        this.data;

        fileReader.onload = (e) => {

            // Array of strings with every string being a line.
            var lines = fileReader.result.toString().split('\n');
            lines.shift();

            // Loop through all the lines, but skip the first since that one never contains data.
            for (var line of lines) {

                // Get the different columns by splitting on the "," .
                var columns = line.split(',');

                // Make sure it's not an empty line.
                if (columns.length <= 4) {
                    continue;
                }

                // Filter to a specific month for more clarity.
                // Remove the '-' from the date
                var dateString = columns[0].split('-').join('');
                // Turn it into an integer
                var dateInt = parseInt(dateString);

                // Convert the source and target to an integer.
                var source = parseInt(columns[1]);
                var target = parseInt(columns[4]);

                var sourceNode;
                var targetNode;

                // Add the source if we can't find it in the array of nodes.
                var srcFound = false;
                for (var n of this.data.nodes) {
                    if (n.id === source) {
                        srcFound = true;
                        sourceNode = n;
                        n.mailCount += 1;
                        break;
                    }
                }
                if (!srcFound) {
                    // console.log(source);
                    sourceNode = { id: source, job: columns[3], address: columns[2], mailCount: 1 };
                    this.data.nodes.push(sourceNode);
                }

                // Add the target if we can't find it in the array of nodes.
                var tarFound = false;
                for (var n of this.data.nodes) {
                    if (n.id === target) {
                        tarFound = true;
                        targetNode = n;
                        n.mailCount += 1;
                        break;
                    }
                }
                if (!tarFound) {
                    //console.log(target);
                    targetNode = { id: target, job: columns[6], address: columns[5], mailCount: 1 };
                    this.data.nodes.push(targetNode);
                }

                // Create the link between the source and target
                var linkFound = false;
                for (var l of this.data.groupedLinks) {
                    if ((l.source.id === source && l.target.id === target) ||
                        (l.source.id === target && l.target.id === source)) {
                        linkFound = true;
                        //l.value += 1;
                        l.sentiment.push(parseFloat(columns[8]));
                        break;
                    }
                }

                if (!linkFound) {
                    this.data.groupedLinks.push({
                        date: dateInt,
                        source: sourceNode,
                        target: targetNode,
                        sentiment: [parseFloat(columns[8])]
                    });
                }

                this.data.individualLinks.push({
                    date: dateInt,
                    source: sourceNode,
                    target: targetNode,
                    sentiment: parseFloat(columns[8])
                });
            }

            // Initialize the adjecency matrix with all zeroes.
            var num = this.data.nodes.length;
            this.data.adjacencyMatrix = new Array(num).fill(new Array(num).fill(0));

            // Fill the matrix with the data.
            for (var link of this.data.individualLinks) {
                this.data.adjacencyMatrix[link.source.id][link.target.id]++;
            }
        };

        if (file) {
            fileReader.readAsText(file);
        }

        this.uploadService.changeData(this.data);

        // update displayed name
        //const fileName = document.querySelector('#file-upload .file-name');
        var labels = document.querySelectorAll('#file-upload .file-name');
        labels.forEach((label) => { label.textContent = file.name; console.log(label); })
        //fileName.textContent = file.name;
    }
}
