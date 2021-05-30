import { ForceGraphDataShareService } from './../force-graph-data-share.service';
import { Component, ElementRef, ViewChild, OnInit } from '@angular/core';
import { emptyData, UploadService } from './../upload.service';
import { ForceGraphComponent } from './../force-graph/force-graph.component';
import { ArcDiagramComponent } from '../arc-diagram/arc-diagram.component';

@Component({
    selector: 'app-visualisation-page',
    templateUrl: './visualisation-page.component.html',
    styleUrls: ['./visualisation-page.component.css']
})
export class VisualisationPageComponent implements OnInit {

    // configurables
    INFOCARD_COLUMNS = 4;

    data: Data = emptyData();
    filteredData: Data = emptyData();
    arcSort = "id";
    showIndividualLinks = false;
    max;
    selectedNode;
    selectedNodeInfo;   // holds array of all emails send and received.

    @ViewChild('fileInput', { static: false }) fileInput: ElementRef;
    @ViewChild(ForceGraphComponent) forcegraph;
    @ViewChild(ArcDiagramComponent) arcdiagram;

    constructor(private uploadService: UploadService, private FGshareService: ForceGraphDataShareService) { }
    ngOnInit(): void {
        this.uploadService.currentData.subscribe(newData => this.data = newData);
        this.FGshareService.currentNodeSelect.subscribe(newNode => this.selectedNodeInfo = newNode);
    }

    setMaxDate(event): void {
        //change the maximum value on the slider when signal comes from forcegraph
        this.max = this.forcegraph.dateRange;
    }

    showDate(dates) {
        var startDay = dates['newStartDate'].getDate()
        var startMonth = dates['newStartDate'].toLocaleString('default', { month: 'long' })
        var startYear = dates['newStartDate'].getFullYear()

        var endDay = dates['newEndDate'].getDate()
        var endMonth = dates['newEndDate'].toLocaleString('default', { month: 'long' })
        var endYear = dates['newEndDate'].getFullYear()

        console.log('Data showing from ' + startDay + ' ' + startMonth + ', ' + startYear)
        console.log('Data showing until ' + endDay + ' ' + endMonth + ', ' + endYear)
    }

    nodeToParent(nodeID): void {
        if (nodeID === this.selectedNode) {
            this.selectedNode = undefined;
        } else {
            this.selectedNode = nodeID;
        }
    }

    // setter for selectedNode, used to update info-card, triggered through html event
    updateNodeInfo(node): void {

        // function to add rows to a table
        function createRow(table: any, attribute: string, component: any): void {

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
            for (const elm in repeatdict) {
                let text = elm;
                if (repeatdict[elm] > 1) { text = text + "(x" + repeatdict[elm] + ")" }
                if (newRow.length < component.INFOCARD_COLUMNS - 1) {
                    newRow.push(text)
                } else {
                    newRow.push(text)
                    structure.push(newRow);
                    newRow = [];
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

        this.selectedNodeInfo = node;
        for (let i = 0; i < this.selectedNodeInfo["receivedfrom"].length; i++) {
            var id = this.selectedNodeInfo["receivedfrom"][i]
            this.selectedNodeInfo["receivedfrom"][i] = " " + id.toString(); // I need to hvae a space between every element
        }
        for (let i = 0; i < this.selectedNodeInfo["sendto"].length; i++) {
            var id = this.selectedNodeInfo["sendto"][i]
            this.selectedNodeInfo["sendto"][i] = id.toString() + " "; // I need to hvae a space between every element
        }

        // -- code to update the table of send id's -- \\
        // get the tables in the infocard
        let receivedTable = document.getElementById('nodeinfo_table_received');     // table containing rows of received email id's
        let sendTable = document.getElementById('nodeinfo_table_send');             // table containing rows of send     email id's

        // - remove old rows
        let received_rows = receivedTable.getElementsByTagName('tr');               // list of rows in received table
        let send_rows = sendTable.getElementsByTagName('tr');                   // list of rows in send table

        if (received_rows.length > 0) {                                              // remove all rows from received table (if any)
            for (let i = 0; i < received_rows.length; i++) {
                receivedTable.removeChild(received_rows[i])
            }
        }
        if (send_rows.length > 0) {                                                  // remove all rows from send table (if any)
            for (let i = 0; i < send_rows.length; i++) {
                sendTable.removeChild(send_rows[i])
            }
        }

        // - create and append rows for each set of id's (configured by INFOCARD_COLUMNS) -
        createRow(receivedTable, "receivedfrom", this);
        createRow(sendTable, "sendto", this);
    }

    checkLinksOption(event): void {
        //console.log(event);
        this.showIndividualLinks = event.target.checked;
    }

    checkSortOption(event): void {
        // console.log(event.target);
        this.arcSort = event.target.value
    }

}
