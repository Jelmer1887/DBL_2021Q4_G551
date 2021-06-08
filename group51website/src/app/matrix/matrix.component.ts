import { Component, AfterViewInit, Input, OnChanges, SimpleChanges, ViewChild, ElementRef, OnInit, EventEmitter, Output } from '@angular/core';
import * as d3 from 'd3';
import { jobs, nodeColor } from '../app.component';

@Component({
    selector: 'app-matrix',
    templateUrl: './matrix.component.html',
    styles: [
    ]
})
export class MatrixComponent implements AfterViewInit, OnChanges, OnInit {

    @Input() data: Data;
    @Input() matrixSort;
    @Input() matrixView = "all"; //this will be an input variable determining if we show all id's or just per jobtitle etc.
    //@Input() showIndividualLinks;
    //@Input() selectedNode;  //id of the node last clicked

    private width;
    private height = 800;

    // variable holding information of clicked node
    nodeinfo = { "id": 0, "sendto": [], "receivedfrom": [] };

    constructor() { }

    private zoom = d3.zoom()
        .scaleExtent([0.5, 10])

    ngOnInit() {
    }

    checkMatrixSortOption(event): void {
        this.matrixSort = event.target.value
        this.initiateGraph();
    }

    checkMatrixView(event): void {
        this.matrixView = event.target.value
        this.initiateGraph();
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
        // console.log(links);
        var nodes = JSON.parse(JSON.stringify(data.nodes))
        var idToJobs = {};//dictionary

        function findMaxWeight() {
            var maxWeight = 0;
            for (var x of data.adjacencyMatrix) {
                maxWeight = Math.max(maxWeight, Math.max(...x));
            }
            return maxWeight;
        }
        function sortLinksSourceID(links) {
            links.sort(function (a, b) {
                if (a.source > b.source) {
                    return 1;
                } else if (a.source < b.source) {
                    return -1
                }
            })
        }
        function sortLinksTargetID(links) {
            links.sort(function (a, b) {
                if (a.target > b.target) {
                    return 1;
                } else if (a.target < b.target) {
                    return -1
                }
            })
        }
        function sortLinksID(links) { //sort links first by target, then by source
            sortLinksTargetID(links);
            sortLinksSourceID(links);
        }

        function sortNodesID() {
            nodes.sort(function (a, b) {
                if (a.id > b.id) {
                    return 1;
                } else if (a.id < b.id) {
                    return -1
                }
            })
        }

        function sortNodesJob() {
            nodes.sort(function (a, b) {
                if (a.job == b.job) {
                    return (a.id < b.id ? -1 : 1);
                } else { //broky
                    return jobs.indexOf(a.job) - jobs.indexOf(b.job); //either positive or negative, sorted accordingly
                }
            })
        }

        function sortNodesAmount() {
            nodes.sort(function (a, b) {
                if (a.mailCount == b.mailCount) {
                    return (a.id < b.id ? -1 : 1);
                } else {
                    return (a.mailCount > b.mailCount ? -1 : 1);
                }
            })
        }

        function sortJobNodesAmount() {
            nodes.sort(function (a, b) {
                if (a.mailCount == b.mailCount) {
                    return (a.id < b.id ? -1 : 1);
                } else {
                    return (a.mailCount > b.mailCount ? -1 : 1);
                }
            })
        }

        function makeIDtoJobDict() {
            for (var node of nodes) {
                idToJobs[node.id] = node.job; // {node.id:node.job}
            }
        }
        function makeJobLinks(array) {
            for (var link of links) {
                var linkFound = false
                for (var l of array) {
                    if (idToJobs[link.source] == l.source && idToJobs[link.target] == l.target) {
                        linkFound = true
                        l.weight += 1
                    }
                }
                if (!linkFound) {
                    jobLinks.push({ source: idToJobs[link.source], target: idToJobs[link.target], weight: 1 })
                }
            }
        }

        function rectColor(weight) {
            //var colors = ["#ffadad", "#ff8585", "#ff5e5e", "#ff3737", "#ff1010"]; //Based on saturation
            var colors = ["#ffadad", "#ff4b4b", "#e70000", "#ad0000"] //Based on different shades and/or saturations, just 4 to improve comparability
            var colorChooser = maxWeight / (colors.length + 1);
            var index = Math.floor(weight / colorChooser); //integer division to determine saturation of red
            if (index >= colors.length) {//makes sure that the maximum value isn't hogging a color for itself.
                index = colors.length - 1;
            }
            return colors[index];
        }

        /*
        function rectColorJob(weight) { //TODO: Take a look a this (semantically)
            var colors= ["#ffadad", "#ff5e5e", "#ff2323", "#d40000", "#990000", "#5e0000"];
            var colorChooser = maxWeight / (colors.length); //+1
            var index = Math.floor(weight / colorChooser); //integer division to determine saturation of red
            if (index>=colors.length){//makes sure that the maximum value isn't hogging a color for itself.
                index = colors.length-1;
            }
            return colors[index];
        }
        */

        function makeText(d) {
            if (d.id.length == 3) {
                return "\u00A0" + d.id + "\u00A0 \u00A0 \u00A0"; //\u00A0 is unicode for NO-BREAK SPACE. HTML will ignore " "...
            } else if (d.id.length == 2) {
                return " \u00A0 \u00A0 \u00A0 \u00A0" + d.id + "\u00A0\u00A0\u00A0";
            } else {
                return " \u00A0 \u00A0 \u00A0 \u00A0 \u00A0" + d.id + "\u00A0\u00A0\u00A0";
            }
        }
        function jobTextX(d) {
            if (d.job.lastIndexOf(" ") == -1) {
                return d.job + "\u00A0 \u00A0 \u00A0"; //\u00A0 is unicode for NO-BREAK SPACE. HTML will ignore " "...
            } else {
                return d.job.substr(0, d.job.lastIndexOf(" ")) + "\n" + d.job.substr(d.job.lastIndexOf(" "));
            }
        }
        function jobTextY(d) {
            if (d.job.lastIndexOf(" ") == -1) {
                return "\u00A0 \u00A0 " + d.job; //\u00A0 is unicode for NO-BREAK SPACE. HTML will ignore " "...
            } else {
                return d.job.substr(0, d.job.lastIndexOf(" ")) + "\n" + d.job.substr(d.job.lastIndexOf(" "));
            }
        }

        function makeGridData() {
            var gridData = [];
            for (var i = 0; i < nodeID.length; i++) {
                for (var j = 0; j < nodeID.length; j++) {
                    gridData.push({ source: nodeID[i], target: nodeID[j] })
                }
            }
            return gridData;
        }

        function colourGrid(a, d) {
            if (a.source === d.source) {
                return nodeColor(idToJobs[d.source])
            }
            if (a.target === d.target) {
                return nodeColor(idToJobs[d.target]);
            }
            return "none"
        }

        function colourJobGrid(a, d) {
            if (a.source === d.source) {
                return nodeColor(d.source)
            }
            if (a.target === d.target) {
                return nodeColor(d.target);
            }
            return "none"
        }

        function makeJobGridData(array) {
            var gridData = []
            for (var i = 0; i < array.length; i++) {
                for (var j = 0; j < array.length; j++) {
                    gridData.push({ source: array[i], target: array[j] })
                }
            }
            return gridData;
        }

        function makeJobNodes() {
            var jobNodes = [];
            for (var node of nodes) {
                var nodeFound = false;
                for (var n of jobNodes) {
                    if (node.job == n.job) {
                        nodeFound = true;
                        n.mailCount += node.mailCount;
                    }
                }
                if (!nodeFound) {
                    jobNodes.push({ job: node.job, mailCount: node.mailCount })
                }
            }
            return jobNodes;
        }

        makeIDtoJobDict();

        //handles sorting requests
        if ((this.matrixSort == 'id') && (this.matrixView == 'all')) { //dont want to run these sorts in job view.
            sortNodesID();
        } else if ((this.matrixSort == 'job') && (this.matrixView == 'all')) {
            sortNodesJob();
        } else if ((this.matrixSort == 'amount') && (this.matrixView == 'all')) {
            sortNodesAmount();
        }

        const svg = d3.select('#matrix')
            .attr("width", this.width)
            .attr("height", this.height); //800
        svg.selectAll("*").remove(); //what does this do exactly? it removes all children of the svg, so you get an empty graph. - Kay

        const legend = d3.select("#matrix-legend")
            .attr("width", this.width)
            .attr("height", 80);

        if (this.matrixView == "job") {
            var xMargin = 15;
            var yMargin = 15;
            var jobLinks = []; //[{source: , target: , weight: }]
            makeJobLinks(jobLinks);
            var jobNodes = makeJobNodes();
            console.log(jobNodes);
            var maxWeight = findMaxWeight();
            var gridData = makeJobGridData(jobs);
            // console.log(gridData);
            var x = d3.scalePoint()
                .range([xMargin, this.width - xMargin - (this.width - 2 * xMargin) / jobs.length])
                .padding(0.5)
                .domain(jobs);

            var y = d3.scalePoint()
                .range([yMargin, this.height - yMargin - (this.height - 2 * yMargin) / jobs.length])
                .padding(0.5)
                .domain(jobs);

            var myColor = d3.scaleLinear()
                .range(["#d8d8ff", "#0000b1"])
                .domain([1, maxWeight])

            const grid = svg.selectAll("grid")
                .data(gridData)
                .enter()
                .append("rect")
                .attr("stroke", "black")
                .attr('stroke-width', 0.3)
                .attr('stroke-opacity', 0.5)
                .attr("width", (this.width - 2 * xMargin) / (jobs.length + 1)) //this somehow works, it probably makes sense if you think about it
                .attr("height", (this.height - 2 * yMargin) / (jobs.length + 1)) //yes, it's kinda hard coded
                .attr("x", function (d: any) { return x(d.target) }) //x position depends on target ID
                .attr("y", function (d: any) { return y(d.source) }) //y postion depends on source ID
                .style("fill", "none");

            const linkBox = svg.selectAll("myBoxes")
                .data(jobLinks)
                .enter()
                .append("rect")
                .attr("stroke", "black")
                .attr("width", (this.width - 2 * xMargin) / (jobs.length + 1))
                .attr("height", (this.height - 2 * yMargin) / (jobs.length + 1))
                .attr("x", function (d: any) { return x(d.target) }) //x position depends on target ID
                .attr("y", function (d: any) { return y(d.source) }) //y postion depends on source ID
                .attr("fill", function (d) { return myColor(d.weight) })
                .on("mouseover", function (event, d: any) {
                    grid.style('fill', (a: any) => colourJobGrid(a, d))

                })
                .on("mouseout", function (event, d) {
                    grid.style('fill', "none")
                })
                .append("title")
                .text((d: any) => {
                    return "source: " + d.source + "\n" +
                        "target: " + d.target + "\n" +
                        "weight :" + d.weight;
                });
            const yAxisLabel = svg.selectAll("myYlabels")
                .data(nodes)
                .enter()
                .append("text")
                .attr("font-size", "8")
                .attr("font-family", "sans-serif")
                //.attr("x", 1)
                .attr("transform", (d: any) => `translate(${37},${d.y = y(d.job) + (this.height - yMargin) / jobLinks.length})`)
                .text(d => jobTextY(d))
                .style("text-anchor", "end")
                .style('fill', "black")//.style("fill", (d: any) => nodeColor(d.job))
                .on("click", (event, d: any) => {
                    //inst.nodeToParent.emit(d.id)
                });

            const xAxisLabel = svg.selectAll("myXlabels")
                .data(nodes)
                .enter()
                .append("text")
                .attr("font-size", "8")
                .attr("font-family", "sans-serif")
                .attr("transform", (d: any) => `translate(${d.x = x(d.job) + 15},${45}) rotate(270) `)
                .text(d => jobTextX(d))
                .style("text-anchor", "start")
                .style('fill', "black")//.style("fill", (d: any) => nodeColor(d.job))
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

        if (this.matrixView == "all") {
            var xMargin = 15; //the amount of space in the matrix reserved for text
            var yMargin = 10; // idem
            sortLinksID(links);
            var nodeID = [];
            //console.log(data.adjacencyMatrix[6][6]);
            const svg = d3.select('#matrix')
                .attr("width", this.width)
                .attr("height", this.height); //800
            svg.selectAll("*").remove(); //what does this do exactly? it removes all children of the svg, so you get an empty graph. - Kay
            for (var i = 0; i < nodes.length; i++) {
                //nodeID.push(Object.values(Object.values(Object.values(nodes))[i]));
                nodeID.push(Object.values(nodes[i])[0]);
            }
            var maxWeight = findMaxWeight();
            //boxes are distanced based on the number and order of the nodes in nodeID
            var x = d3.scalePoint()
                .range([xMargin, this.width - ((this.width - xMargin) / (nodeID.length + 1))])
                .padding(0.5)
                .domain(nodeID);

            var y = d3.scalePoint()
                .range([yMargin, this.height - ((this.height - yMargin) / (nodeID.length + 1))])
                .padding(0.5)
                .domain(nodeID);

            var myColor = d3.scaleLinear()
                .range(["#d8d8ff", "#0000b1"])
                .domain([1, maxWeight])

            var gridData = makeGridData();

            sortLinksID(gridData);

            const grid = svg.selectAll("grid")
                .data(gridData)
                .enter()
                .append("rect")
                .attr("stroke", "black")
                .attr('stroke-width', 0.3)
                .attr('stroke-opacity', 0.5)                            //comments indicate previous version in case stuff breaks
                .attr("width", (this.width - xMargin) / (nodeID.length + 1)) //(this.width - xMargin) / nodeID.length) 
                .attr("height", (this.height - yMargin) / (nodeID.length + 1)) //(this.height - yMargin) / nodeID.length)
                .attr("x", function (d: any) { return (x(d.target)) }) //x position depends on target ID, function (d: any) { return (x(d.target) + xMargin) })
                .attr("y", function (d: any) { return y(d.source) }) //y postion depends on source ID, function (d: any) { return y(d.source) }) 
                .style("fill", "none");

            const linkBox = svg.selectAll("myBoxes")
                .data(links)
                .enter()
                .append("rect")
                .attr("stroke", "black")
                .attr("width", (this.width - xMargin) / (nodeID.length + 1))
                .attr("height", (this.height - yMargin) / (nodeID.length + 1))
                .attr("x", function (d: any) { return (x(d.target)) }) //x position depends on target ID
                .attr("y", function (d: any) { return (y(d.source)) }) //y postion depends on source ID
                .attr("fill", (d: any) => (myColor(data.adjacencyMatrix[d.source][d.target])))
                .on("mouseover", function (event, d: any) {
                    grid.style('fill', (a: any) => colourGrid(a, d))

                })
                .on("mouseout", function (event, d) {
                    grid.style('fill', "none")
                });
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
                .style('fill', "black")//.style("fill", (d: any) => nodeColor(d.job))
                .on("click", (event, d: any) => {
                    //inst.nodeToParent.emit(d.id)
                });

            const xAxisLabel = svg.selectAll("myXlabels")
                .data(nodes)
                .enter()
                .append("text")
                .attr("font-size", "5")
                .attr("font-family", "sans-serif")
                .attr("transform", (d: any) => `translate(${d.x = x(d.id)},${0}) rotate(90)`)
                .text(d => makeText(d))
                .style("text-anchor", "middle")
                .style('fill', "black")//.style("fill", (d: any) => nodeColor(d.job))
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
    }

    ngAfterViewInit(): void {
        this.width = this.container.nativeElement.offsetWidth;
    }

    @ViewChild('container')
    container: ElementRef;

}