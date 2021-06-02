import { Component, AfterViewInit, Input, OnChanges, SimpleChanges, ViewChild, ElementRef, OnInit, EventEmitter, Output } from '@angular/core';
import * as d3 from 'd3';

@Component({
    selector: 'app-matrix',
    templateUrl: './matrix.component.html',
    styles: [
    ]
})
export class MatrixComponent implements AfterViewInit, OnChanges, OnInit {

    @Input() data: Data;
    //@Input() showIndividualLinks;
    //@Input() selectedNode;  //id of the node last clicked

    private width;
    private height = 800;

    private beginPosX = 0;
    private beginPosY = 0;
    private beginScale = 1;

    // variable holding information of clicked node
    nodeinfo = { "id": 0, "sendto": [], "receivedfrom": [] };

    constructor() { }

    private zoom = d3.zoom()
        .scaleExtent([0.5, 10])

    ngOnInit() {
    }

    ngOnChanges(changes: SimpleChanges): void {
        /*if('selectedNode' in changes){  //if a new node is selected then no need to refresh the whole graph
            console.log("forcediagram: The node selected is " + this.selectedNode)      
        } else{
            this.initiateGraph();
        } */
        this.initiateGraph();
    }

    initiateGraph() {
        //console.log(this.showIndividualLinks);
        if (this.container) {
            this.width = this.container.nativeElement.offsetWidth;
        }

        this.runMatrix(this.data);
    }

    runMatrix(data: Data) {
        var links = JSON.parse(JSON.stringify(data.individualLinks))
        var nodes = JSON.parse(JSON.stringify(data.nodes))

        var jobs = ["CEO", "President", "Managing Director", "Director", "Trader", "In House Lawyer", "Manager", "Vice President",
            "Employee", "Unknown"];

        var xMargin = 7; //the amount of space in the matrix reserved for text
        var yMargin = 10; // idem

        // console.log(links);
        function findMaxWeight() {
            var maxWeight = 0;
            for (var x of data.adjacencyMatrix) {
                maxWeight = Math.max(maxWeight, Math.max(...x));
            }
            return maxWeight;
        }
        function sortLinksSourceID() {
            links.sort(function (a, b) {
                if (a.source > b.source) {
                    return 1;
                } else if (a.source < b.source) {
                    return -1
                }
            })
        }
        function sortLinksTargetID() {
            links.sort(function (a, b) {
                if (a.target > b.target) {
                    return 1;
                } else if (a.target < b.target) {
                    return -1
                }
            })
        }
        function sortLinksID() { //sort links first by target, then by source
            sortLinksTargetID();
            sortLinksSourceID();
        }

        sortLinksID();
        //console.log(links);
        var maxWeight = findMaxWeight();

        const svg = d3.select('#matrix')
            .attr("width", this.width)
            .attr("height", this.height); //800
        svg.selectAll("*").remove(); //what does this do exactly? it removes all children of the svg, so you get an empty graph. - Kay

        function sortNodesID() {
            nodes.sort(function (a, b) {
                if (a.id > b.id) {
                    return 1;
                } else if (a.id < b.id) {
                    return -1
                }
            })
        }
        sortNodesID();
        var nodeID = [];
        for (var i = 0; i < nodes.length; i++) {
            //nodeID.push(Object.values(Object.values(Object.values(nodes))[i]));
            nodeID.push(Object.values(nodes[i])[0]);
        }

        function rectColor(weight) {
            //using 12 differently saturated reds
            //TODO: Use less color saturations
            var colors = ["#ffffff", "#ffebeb", "#ffd8d8", "#ffc4c4", "#ffb1b1", "#ff9d9d", "#ff8989", "#ff7676", "#ff6262", "#ff4e4e", "#ff3b3b", "#ff2727", "#ff1414"];
            var colorChooser = maxWeight / colors.length;
            var index = Math.floor(weight / colorChooser); //integer division to determine saturation of red
            return colors[index];
        }

        function makeText(d) {
            if (d.id.length == 3) {
                return "\u00A0" + d.id + "\u00A0 \u00A0 \u00A0"; //\u00A0 is unicode for NO-BREAK SPACE. HTML will ignore " "...
            } else if (d.id.length == 2) {
                return " \u00A0 \u00A0 \u00A0 \u00A0" + d.id + "\u00A0\u00A0\u00A0";
            } else {
                return " \u00A0 \u00A0 \u00A0 \u00A0 \u00A0" + d.id + "\u00A0\u00A0\u00A0";
            }
        }
        //TODO: insert legend here...
        const legend = d3.select("#matrix-legend")
        .attr("width", this.width)
        .attr("height", 80);

        function nodeColor(job): string {
            switch (job) {
                case "Employee":
                    return "#68e256";
                case "Vice President":
                    return "#56e2cf";
                case "Manager":
                    return "#56aee2";
                case "In House Lawyer":
                    return "#5668e2";
                case "Trader":
                    return "#cf56e2";
                case "Director":
                    return "#e25668";
                case "Managing Director":
                    return "#e28956";
                case "President":
                    return "#e2cf56";
                case "CEO":
                    return "#8a56e2"
                case "Unknown":
                    return "#555555";

                default:
                    console.log(job);
                    return "#000000";
        }
    }
        //boxes are distanced based on the number and order of the nodes in nodeID
        var x = d3.scalePoint()
            .range([xMargin, this.width])
            .padding(0.5)
            .domain(nodeID);

        var y = d3.scalePoint()
            .range([yMargin, this.height])
            .padding(0.5)
            .domain(nodeID);

        var grid = svg.selectAll("grid");
        for (var i = 0; i < nodes.length; i++) {
            grid = svg.selectAll("grid")
                .data(nodes)
                .enter()
                .append("rect")
                .attr("stroke", "black")
                .attr('stroke-width', 0.3)
                .attr('stroke-opacity', 0.5)
                .attr("width", (this.width - xMargin) / nodeID.length)
                .attr("height", (this.height - yMargin) / nodeID.length)
                .attr("x", function (d: any) { return (x(d.id) + xMargin) }) //x position depends on target ID
                .attr("y", function (d: any) { return y(nodes[i].id) }) //y postion depends on source ID
                .style("fill", "none");
        }

        const linkBox = svg.selectAll("myBoxes")
            .data(links)
            .enter()
            .append("rect")
            .attr("stroke", "black")
            .attr("width", (this.width - xMargin) / nodeID.length)
            .attr("height", (this.height - yMargin) / nodeID.length)
            .attr("x", function (d: any) { return (x(d.target) + xMargin) }) //x position depends on target ID
            .attr("y", function (d: any) { return (y(d.source)) }) //y postion depends on source ID
            .style("fill", (d: any) => rectColor(data.adjacencyMatrix[d.source][d.target])); //color depends on the weight of the link (directed links)

        linkBox.append("title")
            .text((d: any) => {
                return "source: " + d.source + "\n" +
                    "target: " + d.target + "\n" +
                    "weight :" + data.adjacencyMatrix[d.source][d.target];
            });

        const yAxisLabel = svg.selectAll("myYlabels")
            .data(nodes)
            .enter()
            .append("text")
            .attr("font-size", "8")
            .attr("font-family", "sans-serif")
            .attr("x", 1)
            .attr("transform", (d: any) => `translate(${0},${d.y = y(d.id) + (this.height - yMargin) / nodeID.length})`)
            .text(d => makeText(d))
            .style("text-anchor", "middle")
            .style("fill", (d: any) => nodeColor(d.job))
            .on("click", (event, d: any) => {
                //inst.nodeToParent.emit(d.id)
            });

        const xAxisLabel = svg.selectAll("myXlabels")
            .data(nodes)
            .enter()
            .append("text")
            .attr("font-size", "5")
            .attr("font-family", "sans-serif")
            .attr("transform", (d: any) => `translate(${d.x = x(d.id) + xMargin},${0}) rotate(90)`)
            .text(d => makeText(d))
            .style("text-anchor", "middle")
            .style("fill", (d: any) => nodeColor(d.job))
            .on("click", (event, d: any) => {
                //inst.nodeToParent.emit(d.id)
            })/*
            .on("mouseover", function (event, d: any) {
                xAxisLabel.style('fill', '#ccc')
                d3.select(this).attr("font-size", "10")
                    .style('fill', '#000')
                    .style('font-weight', 'bold')
                    .attr("x")
            })*/;
    }

    ngAfterViewInit(): void {
        this.width = this.container.nativeElement.offsetWidth;
    }

    @ViewChild('container')
    container: ElementRef;

}
