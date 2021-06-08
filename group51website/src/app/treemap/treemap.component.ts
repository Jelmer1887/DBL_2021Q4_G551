import { Component, AfterViewInit, Input, OnChanges, SimpleChanges, ViewChild, ElementRef, OnInit, EventEmitter, Output } from '@angular/core';
import * as d3 from 'd3';

// all possible jobs in a dataset to group by in the map
const jobs = [
  "CEO", "President", "Managing Director", 
  "Director", "Trader", "In House Lawyer", 
  "Manager", "Vice President", "Employee", 
  "Unknown"
];

@Component({
  selector: 'app-treemap',
  templateUrl: './treemap.component.html',
  styleUrls: ['./treemap.component.css']
})


/** following documentation and examples from:
 * D3 official examples site - simple treemap:  https://www.d3-graph-gallery.com/graph/treemap_basic.html 
 * D3 hierarchy documentaiton on Observable:    https://observablehq.com/@d3/d3-hierarchy 
 */
export class TreemapComponent implements OnInit {

  // -- Properties
  public margin = {top: 10, right: 10, bottom: 10, left: 10} // px
  public padding = 20; // px
  public width: number = 500; // px
  public height: number = 500;  // px

  // -- Input
  @Input() data: Data;

  // -- Output
  @Output() nodeEmailsEvent = new EventEmitter<Array<any>>();

  // -- Private variables
  private svg;

  // compute actual constant values of properties
  constructor() { 
    this.width = this.width - this.margin.left - this.margin.right;
    this.height = this.height - this.margin.top - this.margin.bottom;
  }

  // set width etc on loading
  ngOnInit(): void {
    this.svg = d3.select("#tree_map_d3")
    // set the width and height of the element (account for margins)
    this.svg.append("svg") 
      .attr("width", this.width + this.margin.left + this.margin.right)
      .attr("height", this.height + this.margin.top + this.margin.bottom)
    // move the element to apply the margins
    this.svg.append("g")  
      .attr("transform", "translate("+ this.margin.left + "," + this.margin.top + ")");
  }

  // graphs is build upon a change in data (or any change for that matter)
  ngOnChanges(changes: SimpleChanges): void {
    this.buildGraph();
  }

  // -- GRAPH CREATION FUNCTIONS --------------------------------------------------- -- \\

  // create child-elements, compute their position, sizes, etc...
  buildGraph(): void {
    // get the data into a usable format
    let links = JSON.parse(JSON.stringify(this.data.groupedLinks))
    let nodes = JSON.parse(JSON.stringify(this.data.nodes))

    // -- create hierarchic data structure that can be read (visualised) as a treemap
    
    // 1. create a 'root' representing all email ever send
    // every entry in the map is a modified version of a 'node' from 'nodes', it also has a children and name field.
    let root = {name: "root", id: undefined, job: undefined, address: undefined, mailCount: 0, children: []}

    // 2. create special children, by faking a new node, that has 'root' as job to make it a child of root...
    //    ... and has the employees as children.
    let joblist = []
    for (const i in jobs){
      joblist.push({name: jobs[i], id: undefined, job: "root", address: undefined, mailCount: 0, children: []})
    }

    // 3. assign each node from 'nodes' to a job 'node', and update the mailCount of that job 'node'
    for (const i in nodes){
      for (const j in joblist){
        if (joblist[j].name == nodes[i].job){
          nodes[i].name = nodes[i].adress
          joblist[j].children.push(nodes[i])
          joblist[j].mailCount += nodes[i].mailCount;
          break;
        }
      }
    }

    // 4. assign the jobs as children of the root, and update the root count of mails.
    //    also convert this elaborate structure to a d3 data type.
    root.children = joblist                                             // assign the jobs as children at the root
    //for (const j in joblist){root.mailCount += joblist[j].mailCount;}   // update the roots mailCount now that is has children
    let rootd3 = d3.hierarchy(root).sum(function(node){ return node.mailCount})                                     // convert to d3 hierarchy structure to tranform into a treemap


    // -- compute the graph

    // 1. compute the coordinates, sizes, etc for all the nodes, for the given size
    d3.treemap()                          // use d3 function to compute coordinates etc...
      .size([this.width, this.height])    // tell function what size graph to compute for
      .padding(this.padding)              // tell function what space to take between groups (jobs)
      (rootd3)                            // assign all results to augmented nodes in rootd3
    
    console.log(rootd3.leaves())
    // 2. create rectangles according to the computated coordinates, and add those properties to svg
    this.svg
      .selectAll('rect')                                                    // select / create a rectangle
      .data(rootd3.leaves())                                                // get the datapoints
      .enter()                                                              // go over each element (right?)
        .append('rect')                                                     // create a rectangle for the rectangle
          .attr('x',      function (node) { return node.x0; })              // set the x-coordinate
          .attr('y',      function (node) { return node.y0; })              // set the y-coordinate
          .attr('width',  function (node) { return node.x1 - node.x0; })    // set the width of the rectangle
          .attr('height', function (node) { return node.y1 - node.y0; })    // set the height of the rectangle
          .style('stroke', 'black')             // add a black outline
          .style('fill', 'red')                 // make the rectangle filled in with red.
  }

}
