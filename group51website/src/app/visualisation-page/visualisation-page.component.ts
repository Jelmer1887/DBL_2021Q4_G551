import { ForceGraphDataShareService } from './../force-graph-data-share.service';
import { Component, ElementRef, ViewChild, OnInit, Renderer2 } from '@angular/core';
import { UploadService } from './../upload.service';
import { ForceGraphComponent } from './../force-graph/force-graph.component';
import { ArcDiagramComponent } from '../arc-diagram/arc-diagram.component';

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


  // configurables
  INFOCARD_COLUMNS = 4;

  file;
  arcSort = "id";
  showIndividualLinks = false;
  max;
  selectedNode;
  selectedNodeInfo; // holds array of all emails send and received.

  @ViewChild('fileInput', {
    static: false
  }) fileInput: ElementRef;
  @ViewChild(ForceGraphComponent) forcegraph;
  @ViewChild(ArcDiagramComponent) arcdiagram;

  constructor(private uploadService: UploadService, private FGshareService: ForceGraphDataShareService, private renderer: Renderer2) {}
  ngOnInit(): void {
    this.uploadService.currentFile.subscribe(newfile => this.file = newfile);
    this.FGshareService.currentNodeSelect.subscribe(newNode => this.selectedNodeInfo = newNode);
  }

  setMaxDate(event): void {
    //change the maximum value on the slider when signal comes from forcegraph
    this.max = this.forcegraph.dateRange;
  }

  showDate(dates) {
    var startDay = dates['newStartDate'].getDate()
    var startMonth = dates['newStartDate'].toLocaleString('default', {
      month: 'long'
    })
    var startYear = dates['newStartDate'].getFullYear()

    var endDay = dates['newEndDate'].getDate()
    var endMonth = dates['newEndDate'].toLocaleString('default', {
      month: 'long'
    })
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
  function createRow(table: HTMLTableElement, attribute: string, component: any): void {

      // repetition detection
      let repeatdict = {};
      for (let i = 0; i <  component.selectedNodeInfo[attribute].length; i++){
          let p = component.selectedNodeInfo[attribute][i]
          if (repeatdict.hasOwnProperty(p) == false){
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
      for (const elm in repeatdict){
          let text = elm;
          if (repeatdict[elm] > 1){text = text + "(x"+repeatdict[elm]+")"}
          charslen += text.length;
          if (newRow.length < component.INFOCARD_COLUMNS-1){
              newRow.push(text)
          } else {
              newRow.push(text)
              structure.push(newRow);
              //console.log("nr of characters detected in row: "+charslen);
              if (charslen >= 22){
                  table.className = "table is narrow is-hoverable is-fullwidth is-size-7";
                  //console.log("table ("+table.id+") is possibly too big, reducing text size...")
              }
              newRow = [];
              charslen = 0;
          }
      }
      if (newRow.length != 0){structure.push(newRow)}

      // make the array square, by filling the possibly incomplete last row with empty strings.
      if (structure.length > 0){
          if (structure[structure.length-1].length < component.INFOCARD_COLUMNS){
              for (let i = structure[structure.length-1].length-1; i < component.INFOCARD_COLUMNS-1; i++){
                  structure[structure.length-1].push("");
              }
          }
      }

      // -- Converting structured array to HTML table on website -- \\
      for (const r in structure){
          let rowElement = document.createElement('tr');

          for (const c in structure[r]){
              let cellElement = document.createElement('td');
              cellElement.innerText = structure[r][c]

              rowElement.append(cellElement);
          }

          table.append(rowElement);
      }
  }

  this.selectedNodeInfo = node;
  for (let i = 0; i < this.selectedNodeInfo["receivedfrom"].length; i++){
      var id = this.selectedNodeInfo["receivedfrom"][i]
      this.selectedNodeInfo["receivedfrom"][i] = id.toString() + " "; // I need to hvae a space between every element
  }
  for (let i = 0; i < this.selectedNodeInfo["sendto"].length; i++){
      var id = this.selectedNodeInfo["sendto"][i]
      this.selectedNodeInfo["sendto"][i] = id.toString() + " "; // I need to hvae a space between every element
  }

  // -- code to update the table of send id's -- \\

  // remove ALL rows in the page assuming no other tables are here
  let rows = document.querySelectorAll('tr');
  for (let i = 0; rows[i]; i++){
    let row = (rows[i] as HTMLTableRowElement);
    row.remove();
  }

  // get the tables in the infocard
  let receivedTable = (document.getElementById('nodeinfo_table_received') as HTMLTableElement);     // table containing rows of received email id's
  let sendTable = (document.getElementById('nodeinfo_table_send') as HTMLTableElement);             // table containing rows of send     email id's

  // - create and append rows for each set of id's (configured by INFOCARD_COLUMNS) -
  createRow(receivedTable,"receivedfrom", this);
  createRow(sendTable, "sendto", this);

  // -- code to update node id + other future info -- \\
  let idcell = (document.getElementById("node_id") as HTMLTableCellElement);
  console.log(idcell)
  try{
    idcell.innerText = node.id.toString();
  } catch(e){
    console.log(e.message);
  }
  
}

  checkLinksOption(event): void {
    //console.log(event);
    this.showIndividualLinks = event.target.checked;
  }

  checkSortOption(event): void {
    // console.log(event.target);
    this.arcSort = event.target.value
  }

  vis1Fullscreen = false;
  vis2Fullscreen = false;

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
