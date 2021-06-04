import { Component, ElementRef, ViewChild, OnInit, Renderer2 } from '@angular/core';
import { UploadService } from './../upload.service';
import { ForceGraphComponent } from './../force-graph/force-graph.component';
import { ArcDiagramComponent } from '../arc-diagram/arc-diagram.component';
import * as d3 from 'd3';
import { nodeColor } from '../app.component';
import { ResizedEvent } from 'angular-resize-event';
import { MatrixComponent } from '../matrix/matrix.component';

@Component({
    selector: 'app-visualisation-page',
    templateUrl: './visualisation-page.component.html',
    styleUrls: ['./visualisation-page.component.css']
})
export class VisualisationPageComponent implements OnInit {
    // child element selection for DOM manipulation
    @ViewChild('vis1') vis1;
    @ViewChild('vis2') vis2;
    @ViewChild('infoCard') infoCard;
    @ViewChild('button1') button1;
    @ViewChild('button2') button2;
    @ViewChild('dropdown1') dd1;
    @ViewChild('dropdown2') dd2;

    // configurables
    INFOCARD_COLUMNS = 4;

    file: File;
    data: Data = {
        nodes: [],
        groupedLinks: [],
        individualLinks: [],
        adjacencyMatrix: [[]]
    };
    arcSort = "id";
    matrixSort = "id";
    showIndividualLinks = false;
    max;
    //selectedNodeID;
    selectedNodeInfo = { 'id': [], 'job': [], 'sendto': [], 'receivedfrom': [] }; // holds array of all emails send and received.
    vis1Fullscreen = false;
    vis2Fullscreen = false;

    //Variables for setting the slider
    private minDate: number = Math.min();
    private maxDate: number = Math.max();
    public dateRange: number;

    startDate: number = 20011201;
    endDate: number = 20011231;

    @ViewChild('fileInput', { static: false }) fileInput: ElementRef;
    @ViewChild(ForceGraphComponent) forcegraph;
    @ViewChild(ArcDiagramComponent) arcdiagram;
    @ViewChild(MatrixComponent) matrix;
    constructor(private uploadService: UploadService, private renderer: Renderer2) { }

    ngOnInit(): void {
        this.uploadService.currentFile.subscribe(newfile => {
            this.file = newfile;
            this.parseFile();
        });

        //this.createLegend();
    }

    parseFile(): void {
        let fileReader = new FileReader();

        fileReader.onload = (e) => {

            // Array of strings with every string being a line.
            var lines: string[] = fileReader.result.toString().split('\n');
            lines.shift();

            // Empty the nodes and links so we can read the new ones.
            var newData: Data = {
                nodes: [],
                individualLinks: [],
                groupedLinks: [],
                adjacencyMatrix: [[]],
            };

            var maxId = 0;

            // Loop through all the lines, but skip the first since that one never contains data.
            for (var line of lines) {

                // Get the different columns by splitting on the "," .
                var columns: string[] = line.split(',');

                // Make sure it's not an empty line.
                if (columns.length <= 4) {
                    continue;
                }

                // Filter to a specific month for more clarity.
                // Remove the '-' from the date
                var dateString = columns[0].split('-').join('');
                // Turn it into an integer
                var dateInt = parseInt(dateString);

                //Set minimum and maximum date for the slider range
                if (dateInt > this.maxDate) {
                    this.maxDate = dateInt;
                }
                if (dateInt < this.minDate) {
                    this.minDate = dateInt;
                }

                // This comparison works because the format is YY-MM-DD,
                // So the bigger number will always be later in time.
                if (dateInt < this.startDate || dateInt > this.endDate) {
                    continue;
                }

                // Convert the source and target to an integer.
                var source = parseInt(columns[1]);
                var target = parseInt(columns[4]);

                maxId = Math.max(Math.max(source, target), maxId);

                // Add the source if we can't find it in the array of nodes.
                var srcFound = false;
                for (var n of newData.nodes) {
                    if (n.id === source) {
                        srcFound = true;
                        n.mailCount += 1;
                        break;
                    }
                }
                if (!srcFound) {
                    newData.nodes.push({ id: source, job: columns[3], address: columns[2], mailCount: 1 });
                }

                // Add the target if we can't find it in the array of nodes.
                var tarFound = false;
                for (var n of newData.nodes) {
                    if (n.id === target) {
                        tarFound = true;
                        n.mailCount += 1;
                        break;
                    }
                }
                if (!tarFound) {
                    newData.nodes.push({ id: target, job: columns[6], address: columns[5], mailCount: 1 });
                }

                // Create the link between the source and target
                var linkFound = false;
                for (var l of newData.groupedLinks) {
                    if ((l.source === source && l.target === target) ||
                        (l.source === target && l.target === source)) {
                        linkFound = true;
                        l.date.push(dateInt);
                        l.sentiment.push(parseFloat(columns[8]));
                        break;
                    }
                }

                if (!linkFound) {
                    newData.groupedLinks.push({
                        source: source,
                        target: target,
                        date: [dateInt],
                        sentiment: [parseFloat(columns[8])]
                    });
                }

                newData.individualLinks.push({
                    source: source,
                    target: target,
                    date: [dateInt],
                    sentiment: [parseFloat(columns[8])]
                });

            }

            // Initialize the adjecency matrix with all zeroes. https://stackoverflow.com/a/52727729
            const zeros = (m, n) => [...Array(m)].map(e => Array(n).fill(0));
            newData.adjacencyMatrix = zeros(maxId + 1, maxId + 1);

            // Fill the matrix with the data.
            for (const link of newData.individualLinks) {
                newData.adjacencyMatrix[link.source][link.target] += 1;
            }

            this.data = newData;

            //YYYY-MM-DDTHH:MM:SS
            var minDate = new Date(this.minDate.toString().slice(0, 4) + "-" + this.minDate.toString().slice(4, 6) + "-" + this.minDate.toString().slice(6, 8) + "T00:00:00+0000")
            var maxDate = new Date(this.maxDate.toString().slice(0, 4) + "-" + this.maxDate.toString().slice(4, 6) + "-" + this.maxDate.toString().slice(6, 8) + "T00:00:00+0000")

            //number of days between the two days
            this.dateRange = (maxDate.getTime() - minDate.getTime()) / (1000 * 3600 * 24)

            //Next few lines are there to display the dates on the slider
            var minDay = minDate.getDate()
            var minMonth = minDate.toLocaleString('default', { month: 'long' })
            var minYear = minDate.getFullYear()

            var maxDay = maxDate.getDate()
            var maxMonth = maxDate.toLocaleString('default', { month: 'long' })
            var maxYear = maxDate.getFullYear()

            document.getElementById('myRangeMax').innerText =  maxDay +' '+ maxMonth +', '+ maxYear;
            document.getElementById('myRangeMin').innerText =  minDay +' '+ minMonth +', '+ minYear

        };

        if (this.file) {
            fileReader.readAsText(this.file);
        }
    }

    createLegend(width) {
        // Add a legend.
        const legend = d3.select("#legend")
        legend.selectAll("*").remove();

        var jobs = ["CEO", "President", "Managing Director", "Director", "Trader", "In House Lawyer", "Manager", "Vice President",
            "Employee", "Unknown"];

        if (width < 340) {
            legend.attr("height", 350);
            for (var i = 0; i < jobs.length; i++) {
                legend.append("circle").attr("cx", 10).attr("cy", 30 + i * 35 - 6).attr("r", 6).style("fill", nodeColor(jobs[i]))
                legend.append("text").attr("x", 30).attr("y", 30 + i * 35).text(jobs[i]).style("font-size", "15px").attr("alignment-baseline", "middle")
            }
        } else {
            legend.attr("height", 200);
            for (var i = 0; i < jobs.length; i++) {
                legend.append("circle").attr("cx", 10 + (i % 2) * 160).attr("cy", 30 + (i % 5) * 35 - 6).attr("r", 6).style("fill", nodeColor(jobs[i]))
                legend.append("text").attr("x", 30 + (i % 2) * 160).attr("y", 30 + (i % 5) * 35).text(jobs[i]).style("font-size", "15px").attr("alignment-baseline", "middle")
            }
        }

    }

    onResized(event: ResizedEvent) {
        this.createLegend(event.newWidth);
    }

    setNewDate(event) {
        if (!this.file) {
            return;
        }
        //set newStartDate as the minimum date
        var newStartDate = new Date(this.minDate.toString().slice(0, 4) + "-" + this.minDate.toString().slice(4, 6) + "-" + this.minDate.toString().slice(6, 8) + "T00:00:00+0000")

        //set the date to be mindate
        newStartDate.setDate(newStartDate.getDate() + event.target.valueAsNumber);

        //Set newEndDate as 30 days after newStartDate
        var newEndDate = new Date(newStartDate);
        newEndDate.setDate(newEndDate.getDate() + 30);

        this.startDate = parseInt(newStartDate.getFullYear() + ('0' + (newStartDate.getMonth())).slice(-2) + ('0' + newStartDate.getDate()).slice(-2));
        this.endDate = parseInt(newEndDate.getFullYear() + ('0' + (newEndDate.getMonth())).slice(-2) + ('0' + newEndDate.getDate()).slice(-2));

        var startDay = newStartDate.getDate()
        var startMonth = newStartDate.toLocaleString('default', { month: 'long' })
        var startYear = newStartDate.getFullYear()

        var endDay = newEndDate.getDate()
        var endMonth = newEndDate.toLocaleString('default', { month: 'long' })
        var endYear = newEndDate.getFullYear()

        //change HTML elements
        //document.getElementById('myRangeStart').innerText = 'From: ' + startDay +' '+ startMonth +', '+ startYear
        //document.getElementById('myRangeEnd').innerText ='Till: ' +  endDay +' '+ endMonth +', '+ endYear

        this.parseFile();
    }

    nodeToParent(nodeID): void {
    }

    // setter for selectedNode, used to update info-card, triggered through html event
    updateNodeInfo(node): void {

        //Check if node clicked was already selected from before
        if (node['id'] == this.selectedNodeInfo['id']) {
            this.selectedNodeInfo = { 'id': [], 'job': [], 'sendto': [], 'receivedfrom': [] };
            console.log(this.selectedNodeInfo)
        } else {
            this.selectedNodeInfo = node;
            console.log(this.selectedNodeInfo)
        }

        if (this.selectedNodeInfo['id'].length != 0) {
            // function to add a row to the info section
            function createInfoRow(table: HTMLTableElement, discr: string, value: any): void {
                // update ID
                let newRow: HTMLTableRowElement = document.createElement('tr');         // create row for value

                let text = document.createElement('td');                                // (re)create text
                text.innerText = discr;
                text.className = "has-text-right";
                newRow.append(text);

                text = document.createElement('td');                                    // set new value
                text.innerText = value;
                newRow.append(text);

                table.append(newRow);
            }

            // function to add rows to a table
            function createRow(table: HTMLTableElement, attribute: string, component: any): void {

                // repetition detection
                let repeatdict = {};
                for (let i = 0; i < component.selectedNodeInfo[attribute].length; i++) {
                    let p = component.selectedNodeInfo[attribute][i]
                    if (repeatdict.hasOwnProperty(p) == false) {
                        repeatdict[p] = 1;
                    } else {
                        repeatdict[p] += 1;
                    }
                }
                console.log(repeatdict);


                // create the table in array form
                let structure = [];
                let newRow = [];
                let charslen: number = 0;
                for (const elm in repeatdict) {
                    let text = elm;
                    if (repeatdict[elm] > 1) { text = text + "(x" + repeatdict[elm] + ")" }
                    charslen += text.length;
                    if (newRow.length < component.INFOCARD_COLUMNS - 1) {
                        newRow.push(text)
                    } else {
                        newRow.push(text)
                        structure.push(newRow);
                        //console.log("nr of characters detected in row: "+charslen);
                        if (charslen >= 22) {
                            table.className = "table is narrow is-hoverable is-fullwidth is-size-7";
                            //console.log("table ("+table.id+") is possibly too big, reducing text size...")
                        }
                        newRow = [];
                        charslen = 0;
                    }
                }
                if (newRow.length != 0) { structure.push(newRow) }

                // make the array square, by filling the possibly incomplete last row with empty strings.
                if (structure.length > 0) {
                    if (structure[structure.length - 1].length < component.INFOCARD_COLUMNS) {
                        for (let i = structure[structure.length - 1].length - 1; i < component.INFOCARD_COLUMNS - 1; i++) {
                            structure[structure.length - 1].push("");
                        }
                    }
                }

                // -- Converting structured array to HTML table on website -- \\
                for (const r in structure) {
                    let rowElement = document.createElement('tr');

                    for (const c in structure[r]) {
                        let cellElement = document.createElement('td');
                        cellElement.innerText = structure[r][c]

                        rowElement.append(cellElement);
                    }

                    table.append(rowElement);
                }
            }

            
            for (let i = 0; i < this.selectedNodeInfo["receivedfrom"].length; i++) {
                var id = this.selectedNodeInfo["receivedfrom"][i]
                this.selectedNodeInfo["receivedfrom"][i] = id.toString() + " "; // I need to hvae a space between every element
            }
            for (let i = 0; i < this.selectedNodeInfo["sendto"].length; i++) {
                var id = this.selectedNodeInfo["sendto"][i]
                this.selectedNodeInfo["sendto"][i] = id.toString() + " "; // I need to hvae a space between every element
            }

            // -- code to update the table of send id's -- \\

            // remove ALL rows in the page assuming no other tables are here
            let rows = document.querySelectorAll('tr');
            for (let i = 0; rows[i]; i++) {
                let row = (rows[i] as HTMLTableRowElement);
                row.remove();
            }

            // get the tables in the infocard
            let receivedTable = (document.getElementById('nodeinfo_table_received') as HTMLTableElement);     // table containing rows of received email id's
            let sendTable = (document.getElementById('nodeinfo_table_send') as HTMLTableElement);             // table containing rows of send     email id's

            // - create and append rows for each set of id's (configured by INFOCARD_COLUMNS) -
            createRow(receivedTable, "receivedfrom", this);
            createRow(sendTable, "sendto", this);

            // -- code to update node id + other future info -- \\

            // get table of info
            let idTable = (document.getElementById("id_table") as HTMLTableElement);

            // update ID
            createInfoRow(idTable, "ID:", node.id.toString());
            // update job
            createInfoRow(idTable, "Job:", node.job);
            // update nr of emails
            createInfoRow(idTable,"nr of emails send/received:",node.mailCount)
        }
    }

    checkLinksOption(event): void {
        //console.log(event);
        this.showIndividualLinks = event.target.checked;
    }

    fullscreenVis1() {
        if (this.vis1Fullscreen) {
            this.renderer.setAttribute(
                this.vis1.nativeElement,
                'class',
                'column is-5 has-text-centered'
            )
            this.renderer.setStyle(
                this.vis2.nativeElement,
                'display',
                'inline');
            this.renderer.setStyle(
                this.dd2.nativeElement,
                'display',
                'inline');
            this.vis1Fullscreen = false;
        } else {
            this.renderer.setAttribute(
                this.vis1.nativeElement,
                'class',
                'column has-text-centered'
            )
            this.renderer.setStyle(
                this.vis2.nativeElement,
                'display',
                'none');
            this.renderer.setStyle(
                this.dd2.nativeElement,
                'display',
                'none');
            this.vis1Fullscreen = true;
        }
    }

    fullscreenVis2() {
        if (this.vis2Fullscreen) {
            this.renderer.setAttribute(
                this.vis2.nativeElement,
                'class',
                'column is-5 has-text-centered'
            )

            this.renderer.setStyle(
                this.vis1.nativeElement,
                'display',
                'inline')
            this.vis2Fullscreen = false;

        } else {
            this.renderer.setAttribute(
                this.vis2.nativeElement,
                'class',
                'column has-text-centered'
            )
            this.renderer.setStyle(
                this.vis1.nativeElement,
                'display',
                'none')
            this.vis2Fullscreen = true;


        }

    }

}
