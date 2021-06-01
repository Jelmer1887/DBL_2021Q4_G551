import { Component, AfterViewInit, Input, OnChanges, SimpleChanges, ViewChild, ElementRef, OnInit, EventEmitter, Output } from '@angular/core';
import * as d3 from 'd3';

@Component({
    selector: 'app-matrix',
    templateUrl: './matrix.component.html',
    styles: [
    ]
})
export class MatrixComponent implements AfterViewInit, OnChanges, OnInit {

    @Input() file;
    //@Input() showIndividualLinks;
    //@Input() selectedNode;  //id of the node last clicked
    
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

    /*
    private links = [
        { "source": 0, "target": 1, "value": 1, "sentiment": [0.0] },
        { "source": 0, "target": 5, "value": 1, "sentiment": [0.4] },
        { "source": 2, "target": 1, "value": 1, "sentiment": [0.9] },
        { "source": 3, "target": 5, "value": 1, "sentiment": [-0.5] },
        { "source": 2, "target": 4, "value": 1, "sentiment": [-0.8] },
    ]
    */

    private groupedLinks = []
    private individualLinks = []

    //This will hold the number of links every node has
    private mLinkNum = []

    private width;
    private height = 800;

    private beginPosX = 0;
    private beginPosY = 0;
    private beginScale = 1;

    // Filter start and end date.
    private startDate = 20011201;
    private endDate = 20011231;

    // variable holding information of clicked node
    nodeinfo = { "id": 0, "sendto": [], "receivedfrom": [] };

    constructor() { }

    private zoom = d3.zoom()
        .scaleExtent([0.5, 10])

    ngOnInit() {
    }

    //Variables for setting the slider
    private minDate = Math.min();
    private maxDate = Math.max();
    public dateRange;

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

        let fileReader = new FileReader();

        fileReader.onload = (e) => {

            // Array of strings with every string being a line.
            var lines = fileReader.result.toString().split('\n');
            lines.shift();

            // Empty the nodes and links so we can read the new ones.
            this.nodes = [];
            this.individualLinks = [];
            this.groupedLinks = [];
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

                //Set minimum and maximum date for the slider range
                if (dateInt > this.maxDate) {
                    this.maxDate = dateInt;
                }
                if (dateInt < this.minDate) {
                    this.minDate = dateInt;
                }

                // This comparison works because the format is YY-MM-DD,
                // So the bigger number will always be later in time.
                if (dateInt < this.startDate || dateInt > this.endDate) {
                    continue;
                }

                // Convert the source and target to an integer.
                var source = parseInt(columns[1]);
                var target = parseInt(columns[4]);

                var sourceNode;
                var targetNode;

                // Add the source if we can't find it in the array of nodes.
                var srcFound = false;
                for (var n of this.nodes) {
                    if (n.id === source) {
                        srcFound = true;
                        sourceNode = n;
                        n.mailCount += 1;
                        break;
                    }
                }
                if (!srcFound) {
                    // console.log(source);
                    sourceNode = { "id": source, "job": columns[3], "address": columns[2], "mailCount": 1 };
                    this.nodes.push(sourceNode);
                }

                // Add the target if we can't find it in the array of nodes.
                var tarFound = false;
                for (var n of this.nodes) {
                    if (n.id === target) {
                        tarFound = true;
                        targetNode = n;
                        n.mailCount += 1;
                        break;
                    }
                }
                if (!tarFound) {
                    //console.log(target);
                    targetNode = { "id": target, "job": columns[6], "address": columns[5], "mailCount": 1 };
                    this.nodes.push(targetNode);
                }

                // Create the link between the source and target
                var linkFound = false;
                for (var l of this.groupedLinks) {
                    if (l.source.id === source && l.target.id === target) {
                        linkFound = true;
                        l.weight +=1;
                        l.sentiment.push(parseFloat(columns[8]));
                        break;
                    }
                    /*else if (l.source.id === target && l.target.id === source) {
                        linkFound = true;
                        //l.value += 1;
                        l.sentiment.push(parseFloat(columns[8]));
                        break;
                    }*/
                }

                if (!linkFound) {
                    this.groupedLinks.push({
                        "source": sourceNode,
                        "target": targetNode,
                        "sentiment": [parseFloat(columns[8])],
                        "weight" : 1
                    });
                }
            }

            // Start the simulation with the new links and nodes.
            this.runMatrix(this.groupedLinks, this.nodes, this.mLinkNum);
        };

        if (this.file) {
            fileReader.readAsText(this.file);
        }
    }

    runMatrix(links, nodes, mLinkNum) {
        var xMargin = 15; //the amount of space in the matrix reserved for text
        var yMargin = 7; // idem
        console.log(links);
        function findMaxWeight() {
            var maxWeight= 0;
            for (var l of links) {
                if (l.weight> maxWeight) {
                    maxWeight = l.weight;
                }
            }
            return maxWeight;
        }
        function sortLinksSourceID() {
            links.sort(function (a, b) {
                if (a.source.id > b.source.id) {
                    return 1;
                } else if (a.source.id < b.source.id) {
                    return -1
                }
            })
        }
        function sortLinksTargetID() {
            links.sort(function (a, b) {
                if (a.target.id > b.target.id) {
                    return 1;
                } else if (a.target.id < b.target.id) {
                    return -1
                }
            })
        }
        function sortLinksID() { //sort links first by target, then by source
            sortLinksTargetID();
            sortLinksSourceID();
        }

        sortLinksID();        
        console.log(links);
        var maxWeight = findMaxWeight();

        const svg = d3.select('#matrix')
                        .attr("width", this.width)
                        .attr("height", this.height);
        svg.selectAll("*").remove(); //what does this do exactly?

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
            var colors = ["#ffffff", "#ffebeb", "#ffd8d8","#ffc4c4", "#ffb1b1", "#ff9d9d", "#ff8989", "#ff7676", "#ff6262", "#ff4e4e", "#ff3b3b", "#ff2727", "#ff1414"];
            var colorChooser = maxWeight/12;
            var index = Math.floor(weight/colorChooser); //integer division to determine saturation of red
            return colors[index];
        }
        
        function makeText(d) {
            if (d.id.length == 3) {
                return " \u00A0" + d.id + "\u00A0 \u00A0 \u00A0"; //\u00A0 is unicode for NO-BREAK SPACE. HTML will ignore " "...
            } else if (d.id.length == 2) {
                return " \u00A0 \u00A0 \u00A0 \u00A0" + d.id + "\u00A0\u00A0\u00A0";
            } else {
                return " \u00A0 \u00A0 \u00A0 \u00A0 \u00A0" + d.id + "\u00A0\u00A0\u00A0";
            }
        }
        //TODO: insert legend here...

        //boxes are distanced based on the number and order of the nodes in nodeID
        var x = d3.scalePoint()
        .range([xMargin, this.width])
        .padding(0.5)
        .domain(nodeID);

        var y = d3.scalePoint()
        .range([yMargin,this.height])
        .padding(0.5)
        .domain(nodeID);

        function makeGridArray() {

        }
        var grid = svg.selectAll("grid");
        for (var i = 0; i<nodes.length; i++) {
            var yloc = yMargin + (this.height/nodeID.length)*i; //might not need this...
            grid = svg.selectAll("grid") 
            .data(nodes) 
            .enter()
            .append("rect")
            .attr("stroke", "black")
            .attr('stroke-width', 0.3)
            .attr('stroke-opacity', 0.5)
            .attr("width", this.width/nodeID.length)
            .attr("height", this.height/nodeID.length)
            .attr("x", function (d : any) {return (x(d.id)+ xMargin) }) //x position depends on target ID
            .attr("y", function (d :any) {return y(nodes[i].id)}) //y postion depends on source ID
            .style("fill", "none");
        }
        
        const linkBox = svg.selectAll("myBoxes")
            .data(links)
            .enter()
            .append("rect")
            .attr("stroke", "black")
            .attr("width", this.width/nodeID.length)
            .attr("height", this.height/nodeID.length)
            .attr("x", function (d : any) {return (x(d.target.id)+ xMargin) }) //x position depends on target ID
            .attr("y", function (d :any) {return (y(d.source.id))}) //y postion depends on source ID
            .style("fill", (d: any) => rectColor(d.weight)); //color depends on the weight of the link (directed links)

        linkBox.append("title")
            .text((d:any) => {
                return "source: " + d.source.id + "\n" +
                    "target: " +d.target.id + "\n" +
                    "weight :" + d.weight;
            });

        const yAxisLabel = svg.selectAll("myYlabels")
            .data(nodes)
            .enter()
            .append("text")
            .attr("font-size", "8")
            .attr("font-family", "sans-serif")
            .attr("x", 12)
            .attr("transform", (d: any) => `translate(${0},${d.y = y(d.id) + yMargin})`)
            .text(d => makeText(d))
            .style("text-anchor", "middle")
            .on("click",(event, d: any) => {
                //inst.nodeToParent.emit(d.id)
            });
        
        const xAxisLabel = svg.selectAll("myXlabels")
            .data(nodes)
            .enter()
            .append("text")
            .attr("font-size", "8")
            .attr("font-family", "sans-serif")
            .attr("y", 5)
            .attr("transform", (d: any) => `translate(${d.x = x(d.id)},${0})`)
            .text(d => makeText(d))
            .style("text-anchor", "middle")
            .on("click",(event, d: any) => {
                //inst.nodeToParent.emit(d.id)
            });
    }
    ngAfterViewInit(): void {
        this.width = this.container.nativeElement.offsetWidth;
        this.runMatrix(this.groupedLinks, this.nodes, this.mLinkNum);
    }

    @ViewChild('container')
    container: ElementRef;

}