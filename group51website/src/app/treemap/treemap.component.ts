import { DataShareService } from './../data-share.service';
import { Subscription } from 'rxjs';
import { Component, AfterViewInit, Input, OnChanges, SimpleChanges, ViewChild, ElementRef, OnInit, EventEmitter, Output } from '@angular/core';
import * as d3 from 'd3';
import { jobs, nodeColor } from '../app.component';
import { ResizedEvent } from 'angular-resize-event';

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
    public margin = { top: 10, right: 10, bottom: 10, left: 10 } // px
    public padding = 20; // px
    public width: number = 1000; // px
    public height: number = 800;  // px

    // -- Input
    data: Data;

    // -- Output
    @Output() nodeEmailsEvent = new EventEmitter<Array<any>>();

    // -- Private variables
    private svg;
    private datasubscription: Subscription;

    // compute actual constant values of properties
    constructor() {
    }

    // set width etc on loading
    ngOnInit(): void {
        this.svg = d3.select("#tree_map_d3")

        //console.log("TreeMap: initialising: subbing to Service!")
        this.datasubscription = DataShareService.sdatasource.subscribe(newData => {
            //console.log("TreeMap: Datashareservice: data update detected!");
            this.data = newData;
            this.buildGraph();
        })
    }

    ngOnDestroy(): void {
        this.datasubscription.unsubscribe();
    }

    // Make sure the width is updated on resize.
    onResized(event: ResizedEvent) {
        this.width = event.newWidth;
        this.height = event.newHeight;

        // set the width and height of the element (account for margins)
        this.svg
            .attr("width", this.width)
            .attr("height", this.height)
    }

    // graphs is build upon a change in data (or any change for that matter)
    ngOnChanges(changes: SimpleChanges): void {
        //this.buildGraph();
    }

    // -- GRAPH CREATION FUNCTIONS --------------------------------------------------- -- \\

    // create child-elements, compute their position, sizes, etc...
    buildGraph(): void {
        // Reset the treemap.
        this.svg.selectAll("*").remove();

        // get the data into a usable format
        // ^ this is not really about the format, 
        // but this is apparently how you copy arrays in JavaScript/TypeScript.
        // This was necessary because these are passed by reference, so if they would be changed here,
        // they would also be changed in the other components. Don't worry about performance, copying only takes 2-3ms.
        // - Kay
        //let links = JSON.parse(JSON.stringify(this.data.groupedLinks))
        let nodes = JSON.parse(JSON.stringify(this.data.nodes))

        // If there are no nodes, don't build the graph.
        if (nodes.length == 0) {
            return;
        }

        // Root node.
        let jsonTree = {
            "children": [],
            "name": "Company",
        }

        // Second layer of the tree; the job functions.
        for (const job of jobs) {
            jsonTree["children"].push({
                "name": job,
                "children": [],
                //"colname": "level2",
            })
        }

        // Add all the leaves i.e. the people, also keep track of the most e-mails send/received.
        let maxMails = 0;
        for (const node of nodes) {
            maxMails = Math.max(node.mailCount, maxMails);
            for (var j of jsonTree["children"]) {
                if (j["name"] == node.job) {
                    j["children"].push({
                        "name": node.id.toString(),
                        "value": node.mailCount.toString(),
                        //"colname": "level3",
                        "job": node.job
                    })
                }
            }
        }

        // Then d3.treemap computes the position of each element of the hierarchy
        const hierarchy = d3.hierarchy(jsonTree)
            .sum(d => d['value'])
            .sort((a, b) => b.value - a.value)

        // Settings for the treemap
        let padding = 5;
        const treemap = d3.treemap()
            .size([this.width, this.height])
            .padding(padding)
            .paddingTop(3 * padding)

        // Give the treemap the data.
        treemap(hierarchy)

        //console.log(hierarchy)
        // Create an opacity scale based on mails sent/received.
        var opacity = d3.scaleLinear()
            .domain([0, maxMails])
            .range([.5, 1])

        // Create the blocks for every leaf
        let block = this.svg.selectAll("g")
            .data(hierarchy.leaves())
            .enter()
            .append("g")
            .attr("transform", (d: any) => `translate(${d['x0']}, ${d['y0']})`)

        // Create the rectangle.
        block.append('rect')
            .attr("class", "tile")
            .attr("fill", (d: any) => nodeColor(d['data']['job']))
            .attr("opacity", (d: any) => opacity(d['data']['value']))
            .attr("data-name", (d: any) => "Id: " + d['data']['id'])
            .attr("data-category", (d: any) => d['data']['job'])
            .attr("data-value", (d: any) => d['data']['value'])
            .attr("width", (d: any) => d['x1'] - d['x0'])
            .attr("height", (d: any) => d['y1'] - d['y0'])


        // Add the Id to the rectangle if there is enough space.
        this.svg
            .selectAll("text")
            .data(hierarchy.leaves())
            .enter()
            .append("text")
            .attr("x", function (d) { return d.x0 + padding })    // +10 to adjust position (more right)
            .attr("y", function (d) { return d.y0 + padding * 3 })    // +20 to adjust position (lower)
            .text(function (d) {
                if ((Math.abs(d['x1'] - d['x0']) > 55) &&
                    (Math.abs(d['y1'] - d['y0']) > 15)) {
                    return "Id: " + d.data.name
                }
                return ""
            })
            .attr("font-size", "14px")
            .attr("fill", "white")

        // Add the amount of mails to the rectangle if there is enough space.
        this.svg
            .selectAll("vals")
            .data(hierarchy.leaves())
            .enter()
            .append("text")
            .attr("x", function (d) { return d.x0 + padding })    // +10 to adjust position (more right)
            .attr("y", function (d) { return d.y0 + padding * 6 })    // +20 to adjust position (lower)
            .text(function (d) {
                if ((Math.abs(d['x1'] - d['x0']) > 55) &&
                    (Math.abs(d['y1'] - d['y0']) > 40)) {
                    return "Mails: " + d.data.value
                }
                return ""
            })
            .attr("font-size", "11px")
            .attr("fill", "white")

        // Add title for the job functions
        this.svg
            .selectAll("titles")
            .data(hierarchy.descendants().filter(function (d) { return d.depth == 1 }))
            .enter()
            .append("text")
            .attr("x", function (d) { return d.x0 + padding })
            .attr("y", function (d) { return d.y0 + padding })
            .text(function (d) {
                if (d['x1'] - d['x0'] > d['data']['name'].length * 8) {
                    return d['data']['name']
                }
                return ""
            })
            .attr("font-size", "14px")
            .attr("fill", function (d) { return nodeColor(d.data.name) })
    }

}
