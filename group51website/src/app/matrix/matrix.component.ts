import { Component, AfterViewInit, Input, OnChanges, SimpleChanges, ViewChild, ElementRef, OnInit, EventEmitter, Output } from '@angular/core';
import * as d3 from 'd3';
import { nodeColor } from '../app.component';

@Component({
    selector: 'app-matrix',
    templateUrl: './matrix.component.html',
    styles: [
    ]
})
export class MatrixComponent implements AfterViewInit, OnChanges, OnInit{

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

    checkMatrixView(event) : void {
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
        console.log(links);
        var nodes = JSON.parse(JSON.stringify(data.nodes))
        var jobs = ["CEO", "President", "Managing Director", "Director", "Trader", "In House Lawyer", "Manager", "Vice President",
        "Employee", "Unknown"];
        var idToJobs = {};//dictionary
        makeIDtoJobDict();
        console.log(idToJobs);
        
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
    
        //console.log(links);
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
        function makeIDtoJobDict() {
            for(var node of nodes) {
                idToJobs[node.id] = node.job; // {node.id:node.job}
            }
        }
        function makeJobLinks(array) {
            for(var link of links) {
                var linkFound = false
                for (var l of jobLinks) {
                    if (idToJobs[link.source] == l.jobSource && idToJobs[link.target] == l.jobTarget) {
                        linkFound = true
                        l.weight +=1
                    }
                }
                if (!linkFound) {
                    jobLinks.push({jobSource: idToJobs[link.source], jobTarget: idToJobs[link.target], weight: 1})    
                } 
            }      
        }    

        if (this.matrixSort == 'id') {
            sortNodesID();
        } else if (this.matrixSort == 'job') {
            sortNodesJob();
        } else if (this.matrixSort == 'amount') {
            sortNodesAmount();
        }      

        function rectColor(weight) {
            //var colors = ["#ffadad", "#ff8585", "#ff5e5e", "#ff3737", "#ff1010"]; //Based on saturation
            var colors = ["#ffadad", "#ff4b4b", "#e70000", "#ad0000"] //Based on different shades and/or saturations, just 4 to improve comparability
            var colorChooser = maxWeight / (colors.length+1);
            var index = Math.floor(weight / colorChooser); //integer division to determine saturation of red
            if (index>=colors.length){//makes sure that the maximum value isn't hogging a color for itself.
                index = colors.length-1;
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
        const legend = d3.select("#matrix-legend")
        .attr("width", this.width)
        .attr("height", 80);

        function makeGridData() {
            var gridData = [];
            for (var i=0; i< nodeID.length; i++) {
                for (var j=0; j<nodeID.length; j++) {
                    gridData.push({source: nodeID[i], target: nodeID[j]})
                }
            }
            return gridData;
        }
        
        function colourGrid(a, d) {
            if(a.source === d.source) {
                return nodeColor(idToJobs[d.source])
            }
            if (a.target === d.target) {
                return nodeColor(idToJobs[d.target]);
            }
            return "none"
        }

        function makeJobGridData(array) {
            var gridData = []
            for (var i=0; i< array.length; i++) {
                for (var j=0; j<array.length; j++) {
                    gridData.push({source: array[i], target: array[j]})
                }
            }
            return gridData;
        }

        if (this.matrixView == "job") {
            var xMargin = 5; 
            var yMargin = 5;
            var jobLinks = []; //[{jobSource: , jobTarget: , weight: }]
            makeJobLinks(jobLinks);
            nodes = jobs
            var gridData = makeJobGridData(nodes);
            console.log(gridData);
            var x = d3.scalePoint()
                .range([xMargin, this.width-xMargin-(this.width - 2*xMargin) / nodes.length])
                .padding(0.5)
                .domain(nodes);

            var y = d3.scalePoint()
                .range([yMargin, this.height-yMargin-(this.height - 2*yMargin) / nodes.length])
                .padding(0.5)
                .domain(nodes);
            
            const grid = svg.selectAll("grid")
                .data(gridData)
                .enter()
                .append("rect")
                .attr("stroke", "black")
                .attr('stroke-width', 0.3)
                .attr('stroke-opacity', 0.5)
                .attr("width", ((this.width - 2*xMargin) / nodes.length)-5)
                .attr("height", (this.height - 2*yMargin) / nodes.length)
                .attr("x", function (d: any) { return x(d.target)}) //x position depends on target ID
                .attr("y", function (d: any) { return y(d.source)}) //y postion depends on source ID
                .style("fill", "none");

            /*const linkBox = svg.selectAll("myBoxes")
            .data(jobLinks)
            .enter()
            .append("rect")
            .attr("stroke", "black")
            .attr("width", (this.width - xMargin) / nodeID.length)
            .attr("height", (this.height - yMargin) / nodeID.length)
            .attr("x", function (d: any) { return (x(d.target) + xMargin) }) //x position depends on target ID
            .attr("y", function (d: any) { return (y(d.source)) }) //y postion depends on source ID
            .attr("fill", (d: any) => (data.adjacencyMatrix[d.source][d.target]==maxWeight)? "#4b0000":rectColor(data.adjacencyMatrix[d.source][d.target])) //color depends on the weight of the link (directed links)
            .on("mouseover", function(event, d: any) {
                grid.style('fill', (a : any) => colourGrid(a, d))

            })
            .on("mouseout", function(event, d) {
                grid.style('fill', "none")
            });
        linkBox.append("title")
            .text((d: any) => {
                return "source: " + d.source + "\n" +
                    "target: " + d.target + "\n" +
                    "weight :" + data.adjacencyMatrix[d.source][d.target];
            });*/
        }

        if (this.matrixView == "all") {
            var xMargin = 7; //the amount of space in the matrix reserved for text
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
                .range([xMargin, this.width-(this.width - xMargin) / nodeID.length])
                .padding(0.5)
                .domain(nodeID);

            var y = d3.scalePoint()
                .range([yMargin, this.height-(this.height - yMargin) / nodeID.length])
                .padding(0.5)
                .domain(nodeID);
            console.log(nodeID);
            var gridData = makeGridData();
            sortLinksID(gridData);
            console.log(gridData);
            const grid = svg.selectAll("grid")
                    .data(gridData)
                    .enter()
                    .append("rect")
                    .attr("stroke", "black")
                    .attr('stroke-width', 0.3)
                    .attr('stroke-opacity', 0.5)
                    .attr("width", (this.width - xMargin) / nodeID.length)
                    .attr("height", (this.height - yMargin) / nodeID.length)
                    .attr("x", function (d: any) { return (x(d.target) + xMargin) }) //x position depends on target ID
                    .attr("y", function (d: any) { return y(d.source) }) //y postion depends on source ID
                    .style("fill", "none");        

            const linkBox = svg.selectAll("myBoxes")
                .data(links)
                .enter()
                .append("rect")
                .attr("stroke", "black")
                .attr("width", (this.width - xMargin) / nodeID.length)
                .attr("height", (this.height - yMargin) / nodeID.length)
                .attr("x", function (d: any) { return (x(d.target) + xMargin) }) //x position depends on target ID
                .attr("y", function (d: any) { return (y(d.source)) }) //y postion depends on source ID
                .attr("fill", (d: any) => (data.adjacencyMatrix[d.source][d.target]==maxWeight)? "#ad0000" : rectColor(data.adjacencyMatrix[d.source][d.target])) //color depends on the weight of the link (directed links), If we really wanna emphasize the max weight: #4b0000
                .on("mouseover", function(event, d: any) {
                    grid.style('fill', (a : any) => colourGrid(a, d))
    
                })
                .on("mouseout", function(event, d) {
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
                .attr("transform", (d: any) => `translate(${d.x = x(d.id) + xMargin},${0}) rotate(90)`)
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