import { Component, AfterViewInit, Input, OnChanges, SimpleChanges, ViewChild, ElementRef, OnInit, EventEmitter, Output } from '@angular/core';
import * as d3 from 'd3';
import { Subscription } from 'rxjs';
import { jobs, nodeColor } from '../app.component';
import { DataShareService } from '../data-share.service';

@Component({
    selector: 'app-matrix',
    templateUrl: './matrix.component.html',
    styles: [
    ]
})
export class MatrixComponent implements AfterViewInit, OnChanges, OnInit {

    data: Data;
    matrixSort = "id";
    matrixView = "job"; //this will be an input variable determining if we show all id's or just per jobtitle etc.

    private dataSubscription: Subscription;

    //@Input() showIndividualLinks;
    //@Input() selectedNode;  //id of the node last clicked

    private width;
    private height = 800;
    private weighted = false;
    // variable holding information of clicked node
    nodeinfo = { "id": 0, "sendto": [], "receivedfrom": [] };

    constructor() { }

    private zoom = d3.zoom()
        .scaleExtent([0.5, 10])

    ngOnInit() {
        this.dataSubscription = DataShareService.sdatasource.subscribe(newData => {
            console.log("matrix: Datashareservice: data update detected!");
            this.data = newData;
            this.initiateGraph();
        })
        this.displayAccordingly();
    }

    checkMatrixSortOption(event): void {
        this.matrixSort = event.target.value
        this.initiateGraph();
    }

    checkMatrixView(event): void {
        this.matrixView = event.target.value
        this.initiateGraph();
    }

    checkWeighted(event): void {
        this.weighted = event.target.checked;
        this.initiateGraph();
    }



    displayAccordingly() {
        var sortOptions = document.getElementById("sortOptions");
        if (this.matrixView == 'job') {
            sortOptions.getElementsByTagName('option')[1].selected = true;
            sortOptions.getElementsByTagName('option')[0].hidden = true;
            document.getElementById("label").style.display = "inline";
            document.getElementById("cb").style.display = "inline";
        } else if (this.matrixView = "all") {
            sortOptions.getElementsByTagName('option')[0].hidden = false;
            sortOptions.getElementsByTagName("option")[0].selected = true;
            document.getElementById("cb").style.display = "none";
            document.getElementById("label").style.display = "none";
        }
    }
    ngOnChanges(changes: SimpleChanges): void {
        /*if('selectedNode' in changes){  //if a new node is selected then no need to refresh the whole graph
            console.log("forcediagram: The node selected is " + this.selectedNode)      
        } else{
            this.initiateGraph();
        } */
        if ('weighted' in changes) {
            this.initiateGraph();
        }
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
        console.log(this.weighted);
        var links = JSON.parse(JSON.stringify(data.individualLinks))
        // console.log(links);
        var nodes = JSON.parse(JSON.stringify(data.nodes))
        var idToJobs = {};//dictionary
        makeIDtoJobDict();
        var numJob = makeNumJob();
        var tempJobNodes = makeJobNodes();//[{job: , mailCount: }]
        var tempJobLinks = makeJobLinks(); //[{source: , target: , weight: }] needed to make weightedJobLinks
        var jobLinks;
        var jobNodes;
        if (this.weighted) {
            jobNodes = makeWeightedJobNodes();
            jobLinks = makeWeightedJobLinks()
        } else {
            jobLinks = tempJobLinks;
            jobNodes = tempJobNodes;
        }

        /*I made the mistake that some functions assume the existence of certain data, so the functions need to be called in
        a very specific order. It works, but it's not all too flexible...*/

        function findMaxWeight() {
            var maxWeight = 0;
            for (var i = 0; i < data.adjacencyMatrix.length; i++) {
                for (var j = 0; j < data.adjacencyMatrix[i].length; j++) {
                    maxWeight = Math.max(maxWeight, data.adjacencyMatrix[i][j]);
                }
            }
            return maxWeight;
        }

        function findMaxJobWeight(array) {
            var maxWeight = 0;
            for (var link of array) {
                maxWeight = Math.max(maxWeight, link.weight);
            }
            console.log(maxWeight);
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
            jobNodes.sort(function (a, b) {
                if (a.mailCount == b.mailCount) {
                    return (a.job < b.job ? -1 : 1);
                } else {
                    return (a.mailCount > b.mailCount ? -1 : 1);
                }
            })
            sortOrder = [];
            for (var i = 0; i < jobNodes.length; i++) {
                sortOrder.push(Object.values(jobNodes[i])[0]);
            }
            jobLinks.sort(function (a, b) {
                if (sortOrder.indexOf(a.source) > sortOrder.indexOf(b.source)) {
                    return 1;
                } else {
                    return -1;
                }
            })
        }

        function makeIDtoJobDict() {
            for (var node of nodes) {
                idToJobs[node.id] = node.job; // {node.id:node.job}
            }
        }
        function makeJobLinks() {
            var array = [];
            for (var link of links) {
                var linkFound = false
                for (var l of array) {
                    if (idToJobs[link.source] == l.source && idToJobs[link.target] == l.target) {
                        linkFound = true
                        l.weight += 1
                    }
                }
                if (!linkFound) {
                    array.push({ source: idToJobs[link.source], target: idToJobs[link.target], weight: 1 })
                }
            }
            return array;
        }
        function makeWeightedJobLinks() {
            var weightedLinks = [];
            for (var link of tempJobLinks) {
                weightedLinks.push({ source: link.source, target: link.target, weight: Math.round(link.weight / numJob[link.source.toString()]) })
            }
            return weightedLinks;
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

        function makeText(d) {
            if (d.id.length == 3) {
                return "\u00A0" + d.id + "\u00A0 \u00A0 \u00A0"; //\u00A0 is unicode for NO-BREAK SPACE. HTML will ignore " "...
            } else if (d.id.length == 2) {
                return " \u00A0 \u00A0 \u00A0 \u00A0" + d.id + "\u00A0\u00A0\u00A0";
            } else {
                return " \u00A0 \u00A0 \u00A0 \u00A0 \u00A0" + d.id + "\u00A0\u00A0\u00A0";
            }
        }
        /*function jobTextX(d) {
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
        */
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

        function makeNumJob() {
            var numJob = {};
            for (var job of jobs) {
                numJob[job] = 0;
            }
            for (var node of nodes) {
                numJob[node.job.toString()] += 1; //for example: {"CEO" : 2}. There are two instances of CEO in nodes
            }
            console.log(numJob);
            return numJob;
        }

        function makeWeightedJobNodes() {
            var weightedJobNodes = [];
            for (var node of tempJobNodes) {
                weightedJobNodes.push({ job: node.job, mailCount: node.mailCount / numJob[node.job] });
            }
            return weightedJobNodes;
        }

        const svg = d3.select('#matrix')
            .attr("width", this.width)
            .attr("height", this.height); //800
        svg.selectAll("*").remove(); //what does this do exactly? it removes all children of the svg, so you get an empty graph. - Kay

        if (this.matrixView == "job") {
            var sortOrder = [];

            if (this.matrixSort == 'amount') { //sortOrder will contain the correct order necessary
                sortJobNodesAmount();
            } else {
                sortOrder = jobs; //sortOrder will take the default jobs array as order
            }

            var xMargin = 60;
            var yMargin = 60;

            var heightBy2 = ((this.height - 2 * yMargin) / (jobs.length)) / 2;
            var widthBy2 = ((this.width - 2 * xMargin) / (jobs.length)) / 2;
            var maxWeight = findMaxJobWeight(jobLinks);
            var gridData = makeJobGridData(jobs);
            // console.log(gridData);
            var nodeRadius = 10;

            var x = d3.scalePoint()
                .range([xMargin, this.width - xMargin - (this.width - 2 * xMargin) / jobs.length])
                .padding(0)
                .domain(sortOrder);

            var y = d3.scalePoint()
                .range([yMargin, this.height - yMargin - (this.height - 2 * yMargin) / jobs.length])
                .padding(0)
                .domain(sortOrder);

            var myColor = d3.scaleLinear<string>()
                .range(["#d8d8ff", "#0000b1"]) //#000063
                .domain([1, maxWeight])

            const grid = svg.selectAll("grid")
                .data(gridData)
                .enter()
                .append("rect")
                .attr("stroke", "black")
                .attr('stroke-width', 0.3)
                .attr('stroke-opacity', 0.5)
                .attr("width", (this.width - 2 * xMargin) / (jobs.length))
                .attr("height", (this.height - 2 * yMargin) / (jobs.length))
                .attr("x", function (d: any) { return x(d.target) }) //x position depends on target ID
                .attr("y", function (d: any) { return y(d.source) }) //y postion depends on source ID
                .style("fill", "none");

            const linkBox = svg.selectAll("myBoxes")
                .data(jobLinks)
                .enter()
                .append("rect")
                .attr("stroke", "black")
                .attr("width", (this.width - 2 * xMargin) / (jobs.length))
                .attr("height", (this.height - 2 * yMargin) / (jobs.length))
                .attr("x", function (d: any) { return x(d.target) }) //x position depends on target job
                .attr("y", function (d: any) { return y(d.source) }) //y postion depends on source job
                .attr("fill", function (d: any) { return myColor(d.weight) })
                .on("mouseover", function (event, d: any) {
                    grid.style('fill', (a: any) => colourJobGrid(a, d))

                })
                .on("mouseout", function (event, d) {
                    grid.style('fill', "none")
                })
                .append("title")
                .text((d: any) => {
                    d.weight
                    return "source: " + d.source + "\n" +
                        "target: " + d.target + "\n" +
                        "weight :" + d.weight;
                });

            const yAxisLabel = svg.selectAll("myYlabels")
                .data(jobNodes)
                .enter()
                .append("circle")
                .attr("cx", 30)
                .attr("r", nodeRadius)
                .style("fill", (d: any) => nodeColor(d.job))
                .attr("cy", function (d: any) { return (y(d.job)) + heightBy2 }) // 

            yAxisLabel.append("title")
                .text((d: any) => {
                    return "function: " + d.job;
                });

            const xAxisLabel = svg.selectAll("myXlabels")
                .data(jobNodes)
                .enter()
                .append("circle")
                .attr("cy", 30)
                .attr("r", nodeRadius)
                .style("fill", (d: any) => nodeColor(d.job))
                .attr("cx", function (d: any) { return (x(d.job)) + widthBy2 })
            xAxisLabel.append("title")
                .text((d: any) => {
                    return "function: " + d.job;
                });

        }

        if (this.matrixView == "all") {

            //handles sorting requests
            if ((this.matrixSort == 'id')) {
                sortNodesID();
            } else if ((this.matrixSort == 'job')) {
                sortNodesJob();
            } else if ((this.matrixSort == 'amount')) {
                sortNodesAmount();
            }

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

            var myColor = d3.scaleLinear<string>()
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
        this.initiateGraph();
    }

    @ViewChild('container')
    container: ElementRef;

}