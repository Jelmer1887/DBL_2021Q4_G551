import { Component, AfterViewInit, Input, OnChanges, SimpleChanges, ViewChild, ElementRef } from '@angular/core';
import * as d3 from 'd3';
//we need to import this component in the app.module.ts
//we need to add the line below to visualisation-page.component.html:
//<app-arc-diagram [file]="file"></app-arc-diagram>

@Component({
    selector: 'app-arc-diagram',
    templateUrl: './arc-diagram.component.html',
    styles: [
    ]
})
export class ArcDiagramComponent implements AfterViewInit, OnChanges {

    @Input() file;

    private nodes = [
        /*
        { "id": 0, "job": "Employee" },
        { "id": 1, "job": "Unknown" },
        { "id": 2, "job": "Employee" },
        { "id": 3, "job": "Employee" },
        { "id": 4, "job": "Vice President" },
        { "id": 5, "job": "Manager" },
        */
    ];

    private links = [
        /*
        { "source": 0, "target": 1, "value": 1, "sentiment": [0.0] },
        { "source": 0, "target": 5, "value": 1, "sentiment": [0.4] },
        { "source": 2, "target": 1, "value": 1, "sentiment": [0.9] },
        { "source": 3, "target": 5, "value": 1, "sentiment": [-0.5] },
        { "source": 2, "target": 4, "value": 1, "sentiment": [-0.8] },
        */
    ]

    //This will hold the number of links every node has
    private mLinkNum = []

    private width;
    private height = 800;

    // Filter start and end date.
    private startDate = 20011201;
    private endDate = 20011231;

    constructor() { }

    ngOnChanges(changes: SimpleChanges): void {
        if (this.container) {
            this.width = this.container.nativeElement.offsetWidth;
        }

        let fileReader = new FileReader();

        fileReader.onload = (e) => {

            // Array of strings with every string being a line.
            var lines = fileReader.result.toString().split('\n');

            // Empty the nodes and links so we can read the new ones.
            this.nodes = [];
            this.links = [];
            this.mLinkNum = [];

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
                // This comparison works because the format is YY-MM-DD,
                // So the bigger number will always be later in time.
                if (dateInt < this.startDate || dateInt > this.endDate) {
                    continue;
                }

                // Convert the source and target to an integer.
                var source = parseInt(columns[1]);
                var target = parseInt(columns[4]);

                // Add the source if we can't find it in the array of nodes.
                var srcFound = false;
                for (var n of this.nodes) {
                    if (n.id === source) {
                        srcFound = true;
                        break;
                    }
                }
                if (!srcFound) {
                    this.nodes.push({ "id": source, "job": columns[3] });
                }

                // Add the target if we can't find it in the array of nodes.
                var tarFound = false;
                for (var n of this.nodes) {
                    if (n.id === target) {
                        tarFound = true;
                        break;
                    }
                }
                if (!tarFound) {
                    this.nodes.push({ "id": target, "job": columns[6] });
                }

                // Create the link between the source and target
                var linkFound = false;
                for (var l of this.links) {
                    if ((l.source === source && l.target === target) ||
                        (l.source === target && l.target === source)) {
                        linkFound = true;
                        //l.value += 1;
                        l.sentiment.push(parseFloat(columns[8]));
                        break;
                    }
                }
                //if (!linkFound) {
                this.links.push({
                    "source": source,
                    "target": target,
                    //"value": 1,
                    "sentiment": [parseFloat(columns[8])]
                });
                //}
            }

            // Start the simulation with the new links and nodes.
            this.runDiagram(this.links, this.nodes, this.mLinkNum);
            console.log(this.nodes)
        };

        if (this.file) {
            fileReader.readAsText(this.file);
        }
    }
    
    runDiagram(links, nodes, mLinkNum): void{
        const svg = d3.select("#arc-diagram")
            //.append("svg")
            .attr("width", this.width)
            .attr("height", this.height);
            //.append("g")
            //.attr("transform", "translate(0,50)");
        
        svg.selectAll("g").remove();
        
        var nodeID = [];
        for(var key in nodes) {
            nodeID.push(key);
        }
        console.log(nodeID);

        //linear scale for spacing nodes on x-axis
        var x = d3.scalePoint()
            .range([0, this.height])
            .domain(nodeID);
        
        //add circles for the nodes
        svg.selectAll("mynodes")
            .data(nodes)
            .enter()
            .append("circle")
                .attr("cy", function(d) {return(x(d.id))})
                .attr("cx", 10)
                .attr("r", 2)
                .style("fill", "#69b3a2");
        //function(d){ return(x(d.name))}
        //add labels for nodes 
        svg.selectAll("mylabels")
            .data(nodes)
            .enter()
            .append("text")
            .attr("y", function(d){ return(x(d.id))})
            .attr("x", 30)
            .attr("transform", "scale(0.5)")
            .text(function(d){ return(d.id)})
            .style("text-anchor", "middle");
        
        //add the links
        svg.selectAll('mylinks')
            .data(links)
            .enter()
            .append('path')
            .attr('d', function (d) {
            var start = x(d.source)    // X position of start node on the X axis
            //console.log(start);
            var end = x(d.target)      // X position of end node
            return ['M', 15, start,    // the arc starts at the coordinate x=start, y=height-30 (where the starting node is)
                'A',                            // This means we're gonna build an elliptical arc
                (start - end)/2, ',',    // Next 2 lines are the coordinates of the inflexion point. Height of this point is proportional with start - end distance
                (start - end)/2, 0, 0, ',',
                start < end ? 1 : 0, 15, ',', end] // We always want the arc on top. So if end is before start, putting 0 here turn the arc upside down.
                .join(' ');
            })
            .style("fill", "none")
            .attr("stroke", "black");
    }
    ngAfterViewInit(): void {
        this.width = this.container.nativeElement.offsetWidth;
        this.runDiagram(this.links, this.nodes, this.mLinkNum);
    }
    @ViewChild('container')
    container: ElementRef;
}


