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

    // configurables
    INFOCARD_COLUMNS = 5;

    file;
    arcSort = "id";
    showIndividualLinks = false;
    max;
    selectedNodeInfo;   // holds array of all emails send and received.

    @ViewChild('fileInput', { static: false }) fileInput: ElementRef;
    @ViewChild(ForceGraphComponent) forcegraph;

    constructor(private uploadService: UploadService, private FGshareService: ForceGraphDataShareService) { }
    ngOnInit(): void {
        this.uploadService.currentFile.subscribe(newfile => this.file = newfile);
        this.FGshareService.currentNodeSelect.subscribe(newNode => this.selectedNodeInfo = newNode);
    }

    setMaxDate(event): void {
        //change the maximum value on the slider when signal comes from forcegraph
        this.max = this.forcegraph.dateRange;
    }

    // setter for selectedNode, used to update info-card, triggered through html event
    updateNodeInfo(node): void {

        // function to add rows to a table
        function createRow(table: any, attribute: string, component: any): void {
            let i = 0;                                                                  // column index for a row
            let r = 0;                                                                  // nr of finished rows

            while (true){                                                               // make rows untill there are no elements left...
                let newRow = document.createElement('tr');                                // create a new row element
                
                // fill the row
                while (i < component.INFOCARD_COLUMNS){                                   // add INFOCARD_COLUMNS nr of cells to the current row
                    let i_id = i + r*component.INFOCARD_COLUMNS                           // compute what element should be in the cell
                    let newCell = document.createElement('td');                           // create cell element

                    // fill the cell
                    if (i_id >= component.selectedNodeInfo[attribute].length){
                        newCell.innerText = "";                                           // make cell empty is there are no elements left to put in.
                    } else {
                        newCell.innerText = component.selectedNodeInfo[attribute][i_id]   // set text to current element's id value
                    }
                    
                    // add cell to row
                    newRow.append(newCell)                                                // add new cell to the row that's being made
                    i++;                                                                  // increment i to keep track of nr of cells in row.
                }

                // append the row
                table.append(newRow);                                                   // add new row to the table
                                                                                        

                // check if enough rows / cells have been made to cover all elements
                if ((r*component.INFOCARD_COLUMNS + i) >= component.selectedNodeInfo["receivedfrom"].length){break;}
                i = 0;                                                                  // reset column counter
                r++;                                                                    // increment the row counter
            }
        }

        this.selectedNodeInfo = node;
        for (let i = 0; i < this.selectedNodeInfo["receivedfrom"].length; i++){
            var id = this.selectedNodeInfo["receivedfrom"][i]
            this.selectedNodeInfo["receivedfrom"][i] = " " + id.toString(); // I need to hvae a space between every element
        }
        for (let i = 0; i < this.selectedNodeInfo["sendto"].length; i++){
            var id = this.selectedNodeInfo["sendto"][i]
            this.selectedNodeInfo["sendto"][i] = id.toString() + " "; // I need to hvae a space between every element
        }

        // -- code to update the table of send id's -- \\
        // get the tables in the infocard
        let receivedTable = document.getElementById('nodeinfo_table_received');     // table containing rows of received email id's
        let sendTable = document.getElementById('nodeinfo_table_send');             // table containing rows of send     email id's

        // - remove old rows
        let received_rows = receivedTable.getElementsByTagName('tr');               // list of rows in received table
        let send_rows     = sendTable.getElementsByTagName('tr');                   // list of rows in send table
        
        if (received_rows.length > 0){                                              // remove all rows from received table (if any)
            for (let i = 0; i < received_rows.length; i++){
                receivedTable.removeChild(received_rows[i])
            }
        }
        if (send_rows.length > 0){                                                  // remove all rows from send table (if any)
            for (let i = 0; i < send_rows.length; i++){
                sendTable.removeChild(send_rows[i])
            }
        }

        // - create and append rows for each set of id's (configured by INFOCARD_COLUMNS) -
        createRow(receivedTable,"receivedfrom", this);
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
