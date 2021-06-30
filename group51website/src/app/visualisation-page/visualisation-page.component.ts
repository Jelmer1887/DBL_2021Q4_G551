import { Subscription } from 'rxjs';
import { DataShareService } from './../data-share.service';
import { Component, ElementRef, ViewChild, OnInit, Renderer2 } from '@angular/core';
import { UploadService } from './../upload.service';
import { ForceGraphComponent } from './../force-graph/force-graph.component';
import { ArcDiagramComponent } from '../arc-diagram/arc-diagram.component';
import * as d3 from 'd3';
import { globalBrushDisable, jobs, nodeColor, setJobs } from '../app.component';
import { ResizedEvent } from 'angular-resize-event';
import { MatrixComponent } from '../matrix/matrix.component';
import { BrushShareService } from '../brush-share.service';
import { Options, ChangeContext, LabelType } from "@angular-slider/ngx-slider";

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


    //Next few lines are to initialise the slider
    value: number = 0;         //set low value
    highValue: number = 30;     //set highest value
    currentOptions: Options = {
        floor: 0,               //set minimum value
        ceil: 100,              //set maximum
        hideLimitLabels: true,   //don't show minimum and maximum
        hidePointerLabels: true
    };

    // configurables
    INFOCARD_COLUMNS = 4;

    file: File;
    data: Data = {
        nodes: [],
        groupedLinks: [],
        individualLinks: [],
        adjacencyMatrix: [[]]
    };

    brushMode: boolean = false;
    max;

    selectedNodeInfo: any = { 'id': -1, 'job': [], 'sendto': [], 'receivedfrom': [] }; // holds array of all emails send and received.
    vis1Fullscreen: boolean = false;
    vis2Fullscreen: boolean = false;

    private filesubscription: Subscription;
    private selectSubscription: Subscription;

    //Variables for setting the slider
    private minDate: number = Math.min();
    private maxDate: number = Math.max();
    public dateRange: number;

    startDate: number;
    endDate: number;

    @ViewChild('fileInput', { static: false }) fileInput: ElementRef;
    @ViewChild(ForceGraphComponent) forcegraph;
    @ViewChild(ArcDiagramComponent) arcdiagram;
    @ViewChild(MatrixComponent) matrix;

    legendWidth: number;

    constructor(private uploadService: UploadService, private renderer: Renderer2) { }

    ngOnInit(): void {
        this.filesubscription = this.uploadService.currentFile.subscribe(newfile => {
            this.file = newfile;
            this.parseFile(true);
        });
        this.selectSubscription = DataShareService.sselectednode.subscribe(newNode => {
            const hasChanged: boolean = (newNode.id != this.selectedNodeInfo.id)
            console.log("page: received new selected node! new = " + hasChanged)
            this.selectedNodeInfo = newNode;
            if (hasChanged == true) { this.updateNodeInfo(this.selectedNodeInfo) }
        })
    }

    ngOnDestroy(): void {
        this.filesubscription.unsubscribe();
    }

    changeDateRange() {
        const newOptions: Options = Object.assign({}, this.currentOptions);     //create new options variable and copy old options
        newOptions.ceil = this.dateRange;       //change maximum value to number of days
        this.currentOptions = newOptions;       //update slider
    }

    changeDateLabels(start, end): void {
        const startDay = start.getDate()
        const startMonth = start.toLocaleString('default', { month: 'long' })
        const startYear = start.getFullYear()
        const STYLING = "class = \" tag is-medium mb-2 \""

        var endDay = end.getDate()
        var endMonth = end.toLocaleString('default', { month: 'long' })
        var endYear = end.getFullYear()

        var startDateString = '<p ' + STYLING + '> From: ' + startDay + ' ' + startMonth + ', ' + startYear + '</p>'
        var endDateString = '<p ' + STYLING + '> Till: ' + endDay + ' ' + endMonth + ', ' + endYear + '</p>'

        const newOptions: Options = Object.assign({}, this.currentOptions);    //create new options variable and copy old options
        newOptions.translate = (value: number, label: LabelType): string => {
            switch (label) {
                case LabelType.Low:   //if pointer is left side 
                    return startDateString;
                case LabelType.High:  //if pointer is right side
                    return endDateString;
                default:
                    return '$' + value;
            }
        }
        newOptions.hidePointerLabels = false;
        this.currentOptions = newOptions;
    }

    parseFile(checkFormat: boolean): void {
        let fileReader = new FileReader();

        fileReader.onload = (e) => {

            // Array of strings with every string being a line.
            var lines: string[] = fileReader.result.toString().split('\n');

            // Get the first line which defines the format
            var format = lines.shift();

            // to lower case and remove whitespace since this shouldn't matter.
            format = format.toLowerCase().replace(/\s/g, "");
            console.log(format);
            if (checkFormat &&
                (format != "date,fromid,fromemail,fromjobtitle,toid,toemail,tojobtitle,messagetype,sentiment")) {
                alert("The format of the dataset seems to not be officially supported. " +
                    "The supported format is: \n" +
                    "date,fromId,fromEmail,fromJobtitle,toId,toEmail,toJobtitle,messageType,sentiment"
                );
            }

            // Empty the nodes and links so we can read the new ones.
            var newData: Data = {
                nodes: [],
                individualLinks: [],
                groupedLinks: [],
                adjacencyMatrix: [[]],
            };

            var newJobs = [];

            var maxId = 0;

            //find min and max dates of dataset
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
            }

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

                if (this.startDate == null && this.endDate == null) {
                    var minDateasDate = new Date(this.minDate.toString().slice(0, 4) + "-" + this.minDate.toString().slice(4, 6) + "-" + this.minDate.toString().slice(6, 8) + "T00:00:00+0000")
                    var maxDateasDate = new Date(minDateasDate);

                    //default shows first month of data
                    minDateasDate.setDate(minDateasDate.getDate() + this.value)
                    maxDateasDate.setDate(maxDateasDate.getDate() + this.highValue);

                    this.startDate = parseInt(minDateasDate.getFullYear() + ('0' + (minDateasDate.getMonth())).slice(-2) + ('0' + minDateasDate.getDate()).slice(-2));
                    this.endDate = parseInt(maxDateasDate.getFullYear() + ('0' + (maxDateasDate.getMonth())).slice(-2) + ('0' + maxDateasDate.getDate()).slice(-2));

                    this.changeDateLabels(minDateasDate, maxDateasDate);
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
                        n.mailSent += 1;
                        break;
                    }
                }
                var srcJob = columns[3];
                if (!newJobs.includes(srcJob)) {
                    newJobs.push(srcJob);
                }
                if (!srcFound) {
                    newData.nodes.push({ id: source, job: srcJob, address: columns[2], mailCount: 1, mailSent: 1, mailReceived: 0 });
                }

                // Add the target if we can't find it in the array of nodes.
                var tarFound = false;
                for (var n of newData.nodes) {
                    if (n.id === target) {
                        tarFound = true;
                        n.mailCount += 1;
                        n.mailReceived += 1;
                        break;
                    }
                }
                var tarJob = columns[6];
                if (!newJobs.includes(tarJob)) {
                    newJobs.push(tarJob);
                }
                if (!tarFound) {
                    newData.nodes.push({ id: target, job: tarJob, address: columns[5], mailCount: 1, mailSent: 0, mailReceived: 1 });
                }

                // Create the link between the source and target
                var linkFound = false;
                for (var l of newData.groupedLinks) {
                    if ((l.source === source && l.target === target) ||
                        (l.source === target && l.target === source)) {
                        linkFound = true;
                        l.date.push(dateInt);
                        l.sentiment.push(parseFloat(columns[8]));
                        l.type.push(columns[7]);
                        break;
                    }
                }

                if (!linkFound) {
                    newData.groupedLinks.push({
                        source: source,
                        target: target,
                        date: [dateInt],
                        sentiment: [parseFloat(columns[8])],
                        type: [columns[7]]
                    });
                }

                newData.individualLinks.push({
                    source: source,
                    target: target,
                    date: [dateInt],
                    sentiment: [parseFloat(columns[8])],
                    type: [columns[7]]
                });

            }

            // Initialize the adjecency matrix with all zeroes. https://stackoverflow.com/a/52727729
            const zeros = (m, n) => [...Array(m)].map(e => Array(n).fill(0));
            newData.adjacencyMatrix = zeros(maxId + 1, maxId + 1);

            // Fill the matrix with the data.
            for (const link of newData.individualLinks) {
                newData.adjacencyMatrix[link.source][link.target] += 1;
            }

            newData.nodes.sort((a, b) => (a.id > b.id ? 1 : -1));

            setJobs(newJobs);
            this.createLegend(this.legendWidth);

            this.data = newData;
            console.log("page: pushing new data to service...")
            DataShareService.updateData(newData);

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

            this.changeDateRange();
            document.getElementById('myRangeMax').innerText = maxDay + ' ' + maxMonth + ', ' + maxYear;
            document.getElementById('myRangeMin').innerText = minDay + ' ' + minMonth + ', ' + minYear

        };

        if (this.file) {
            fileReader.readAsText(this.file);
        }
    }

    // Add a legend.
    createLegend(width) {
        this.legendWidth = width;
        const legend = d3.select("#legend")
        legend.selectAll("*").remove();

        if (width < 340) {
            legend.attr("height", 350);
            for (var i = 0; i < jobs.length; i++) {
                legend.append("circle").attr("cx", 10).attr("cy", 30 + i * 35 - 6).attr("r", 6).style("fill", nodeColor(jobs[i]))
                legend.append("text").attr("x", 30).attr("y", 30 + i * 35).text(jobs[i]).style("font-size", "15px").attr("alignment-baseline", "middle")
            }
        } else {
            legend.attr("height", 200);
            for (var i = 0; i < jobs.length; i++) {
                legend.append("circle").attr("cx", 10 + (i % 2) * 160).attr("cy", 30 + (Math.floor(i / 2) % 5) * 35 - 6).attr("r", 6).style("fill", nodeColor(jobs[i]))
                legend.append("text").attr("x", 30 + (i % 2) * 160).attr("y", 30 + (Math.floor(i / 2) % 5) * 35).text(jobs[i]).style("font-size", "15px").attr("alignment-baseline", "middle")
            }
        }

    }

    onResized(event: ResizedEvent) {
        this.createLegend(event.newWidth);
    }

    setNewDate(changeContext: ChangeContext): void {
        if (!this.file) {
            this.value = changeContext.value
            this.highValue = changeContext.highValue
            return;
        }
        var newMinValue = changeContext.value
        var newMaxValue = changeContext.highValue

        //set newStartDate as the minimum date
        var newStartDate = new Date(this.minDate.toString().slice(0, 4) + "-" + this.minDate.toString().slice(4, 6) + "-" + this.minDate.toString().slice(6, 8) + "T00:00:00+0000")
        var newEndDate = new Date(this.minDate.toString().slice(0, 4) + "-" + this.minDate.toString().slice(4, 6) + "-" + this.minDate.toString().slice(6, 8) + "T00:00:00+0000");

        //set the date to be mindate
        newStartDate.setDate(newStartDate.getDate() + newMinValue);

        //Set newEndDate as 30 days after newStartDate
        newEndDate.setDate(newEndDate.getDate() + newMaxValue);

        this.startDate = parseInt(newStartDate.getFullYear() + ('0' + (newStartDate.getMonth())).slice(-2) + ('0' + newStartDate.getDate()).slice(-2));
        this.endDate = parseInt(newEndDate.getFullYear() + ('0' + (newEndDate.getMonth())).slice(-2) + ('0' + newEndDate.getDate()).slice(-2));

        this.changeDateLabels(newStartDate, newEndDate);

        globalBrushDisable();
        this.parseFile(false);
    }

    // setter for selectedNode, used to update info-card, triggered through html event
    updateNodeInfo(node): void {

        if (!node.hasOwnProperty('id')) {
            console.log("page: updateNodeInfo: node is empty!");
            
            let rows = document.querySelectorAll('tr');
            for (let i = 0; rows[i]; i++) {
                let row = (rows[i] as HTMLTableRowElement);
                row.remove();
            }
            return
        }

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
        createInfoRow(idTable, "nr of emails send/received:", node.mailCount)
    }

    setBrushMode(): void {
        BrushShareService.updateBrush({
            brushEnabled: true,
            brushedNodes: BrushShareService.brushSource.value.brushedNodes,
        });
    }

    setPanMode(): void {
        BrushShareService.updateBrush({
            brushEnabled: false,
            brushedNodes: BrushShareService.brushSource.value.brushedNodes,
        });
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

        globalBrushDisable();
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
            console.log("updating vis2fscr to: " + false)
            DataShareService.updateServiceVis2FullScreen(false);

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
            console.log("updating vis2fscr to: " + true)
            DataShareService.updateServiceVis2FullScreen(true);

        }

        globalBrushDisable();
    }

}
