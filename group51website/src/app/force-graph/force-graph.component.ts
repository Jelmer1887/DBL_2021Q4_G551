import { ForceGraphDataShareService } from './../force-graph-data-share.service';
import { ThrowStmt } from '@angular/compiler';
import { Component, AfterViewInit, Input, OnChanges, SimpleChanges, ViewChild, ElementRef, OnInit, EventEmitter, Output } from '@angular/core';
import * as d3 from 'd3';

@Component({
    selector: 'app-force-graph',
    templateUrl: './force-graph.component.html',
    styles: [
    ]
})
export class ForceGraphComponent implements AfterViewInit, OnChanges, OnInit {

    @Input() file;
    @Input() showIndividualLinks;

    @Output() getDate = new EventEmitter<any>();
    @Output() uploaded = new EventEmitter<string>();
    @Output() nodeEmailsEvent = new EventEmitter<Array<any>>();  // custom event updatting emails from clicked node to parent component

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

    private beginPosX = 0;
    private beginPosY = 0;
    private beginScale = 1;

    // Filter start and end date.
    private startDate = 20011201;
    private endDate = 20011231;

    // variable holding information of clicked node
    nodeinfo = { "id": 0, "sendto": [], "receivedfrom": [] };

    constructor(private shareService: ForceGraphDataShareService) { }

    private zoom = d3.zoom()
        .scaleExtent([0.5, 10])

    ngOnInit() {
    }

    //Variables for setting the slider
    private minDate = Math.min();
    private maxDate = Math.max();
    public dateRange;

    ngOnChanges(changes: SimpleChanges): void {
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

                // Add the source if we can't find it in the array of nodes.
                var srcFound = false;
                for (var n of this.nodes) {
                    if (n.id === source) {
                        srcFound = true;
                        n.mailCount += 1;
                        break;
                    }
                }
                if (!srcFound) {
                    // console.log(source);
                    this.nodes.push({ "id": source, "job": columns[3], "address": columns[2], "mailCount": 1 });
                }

                // Add the target if we can't find it in the array of nodes.
                var tarFound = false;
                for (var n of this.nodes) {
                    if (n.id === target) {
                        tarFound = true;
                        n.mailCount += 1;
                        break;
                    }
                }
                if (!tarFound) {
                    //console.log(target);
                    this.nodes.push({ "id": target, "job": columns[6], "address": columns[5], "mailCount": 1 });
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
                if (!linkFound || this.showIndividualLinks) {
                    this.links.push({
                        "source": source,
                        "target": target,
                        "sentiment": [parseFloat(columns[8])]
                    });
                }
            }

            // Start the simulation with the new links and nodes.
            this.runSimulation(this.links, this.nodes, this.mLinkNum);
        };

        if (this.file) {
            fileReader.readAsText(this.file);
        }
    }

    runSimulation(links, nodes, mLinkNum): void {
        sortLinks();
        setLinkIndexAndNum();

        //set slider information
        this.setSliderRange();

        const simulation = d3.forceSimulation(nodes)                            //automatically runs simulation
            .force("link", d3.forceLink(links).id((d: any) => d.id))            //Adds forces between nodes, depending on if they're linked
            .force("charge", d3.forceManyBody())                                // nodes repel each other
            .force("center", d3.forceCenter(this.width / 2, this.height / 2));  // nodes get pulled towards the centre of svg

        const svg = d3.select("#force-graph")   //let d3 know where the simulation takes place
            .attr("viewBox", `0 0 ${this.width} ${this.height}`)
            .attr("width", this.width)
            .attr("height", this.height)


        svg.selectAll("g").remove();

        // Add a legend.
        const legend = d3.select("#force-legend")
            .attr("width", this.width)
            .attr("height", 80);

        var jobs = ["CEO", "President", "Managing Director", "Director", "Trader", "In House Lawyer", "Manager", "Vice President",
            "Employee", "Unknown"];
        for (var i = 0; i < jobs.length; i++) {
            legend.append("circle").attr("cx", 20 + (i % 5) * 160).attr("cy", 30 + (i % 2) * 35 - 6).attr("r", 6).style("fill", this.nodeColor(jobs[i]))
            legend.append("text").attr("x", 30 + (i % 5) * 160).attr("y", 30 + (i % 2) * 35).text(jobs[i]).style("font-size", "15px").attr("alignment-baseline", "middle")
        }

        var edgeStyle = "line"
        if (this.showIndividualLinks) {
            edgeStyle = "path"
        }

        //adds visuals of the links
        const link = svg.append("g")        //"g" is an element of SVG used to group other SVG elements
            .attr("stroke-opacity", 0.6)
            .selectAll(edgeStyle)
            .data(links)
            .join(edgeStyle)
            .attr("stroke", (d: any) => this.linkColor(d.sentiment,0))  // 0 is just to show it is not highlighted so color is lighter
            .on("click", (d, i) => {
                linkGUI(i, this.showIndividualLinks);                                     //To display info about link
            })


        if (this.showIndividualLinks) {
            link.attr("stroke-width", 2)
            link.append("title")
                .text((d: any) => {
                    return "from: " + d.source.address + "\n" +
                        "to: " + d.target.address + "\n" +
                        "sentiment: " + d.sentiment[0];
                })
        } else {
            link.attr("stroke-width", (d: any) => Math.min(Math.sqrt(d.sentiment.length), 8))
        }

        var inst = this; // crude fix to store instance info
        const node = svg.append("g")
            .attr("stroke", "#fff")
            .attr("stroke-width", 1)
            .selectAll("circle")
            .data(nodes)
            .join("circle")
            .attr("r", (d: any) => Math.max(Math.min(Math.sqrt(d.mailCount), 20), 5))
            .attr("fill", (d: any) => this.nodeColor(d.job))    //colour nodes depending on job title
            .call(this.drag(simulation))                        //makes sure you can drag nodes
            .on("click", function (d, i) {
                nodeclicked(this, i);                              //Small animation of node
                nodeGUI(inst, i);                                  //To display info about node
            })
            .on("mouseover", function (event, d: any) {
                d3.select(this).style('font-weight', 'bold')
                    //.style('fill', "#000")
                    .attr("stroke", "black")
                    .attr("stroke-width", 2);
                link.style('stroke', (a: any) => a.source.id === d.id || a.target.id === d.id ? inst.linkColor(a.sentiment,1) : '#ccc')      
            })
            .on("mouseout", function (event, d) {
                d3.select(this).style('fill', (d: any) => inst.nodeColor(d.job))
                    .style('font-weight', 'normal')
                    .attr("stroke", "#fff")
                    .attr("stroke-width", 1)
                link.style('stroke', (a: any) => a.sentiment < -0.1 ? "#EE5555" : a.sentiment > 0.1 ? "#55EE55" : "#999999")
                
            })


        // Displays some useful info if you hover over a node.
        node.append("title")
            .text((d: any) => {
                return "id: " + d.id + "\n" +
                    "e-mail: " + d.address + "\n" +
                    "function: " + d.job;
            });

        svg.call(this.zoom
            .extent([[0, 0], [this.width, this.height]])
            .on("zoom", function ({ transform }) {
                node.attr("transform", transform);
                link.attr("transform", transform);
            })
        );

        //function that updates position of nodes and links
        simulation.on("tick", () => {
            if (this.showIndividualLinks) {
                link.attr("d", (d: any) => {
                    var dx = d.target.x - d.source.x,
                        dy = d.target.y - d.source.y,
                        dr = Math.sqrt(dx * dx + dy * dy);
                    // get the total link numbers between source and target node
                    var lTotalLinkNum = mLinkNum[d.target.id + "," + d.source.id] || mLinkNum[d.source.id + "," + d.target.id];
                    if (lTotalLinkNum > 1) {
                        // if there are multiple links between these two nodes, we need generate different dr for each path
                        dr = dr / (1 + (1 / lTotalLinkNum) * (d.linkindex - 0.5));
                    }
                    // generate svg path
                    return "M" + d.source.x + "," + d.source.y +
                        "A" + dr + "," + dr + " 0 0 1," + d.target.x + "," + d.target.y +
                        "A" + dr + "," + dr + " 0 0 0," + d.source.x + "," + d.source.y;
                });
            } else {
                link.attr("x1", (d: any) => d.source.x)
                    .attr("y1", (d: any) => d.source.y)
                    .attr("x2", (d: any) => d.target.x)
                    .attr("y2", (d: any) => d.target.y);
            }

            /*
            var left = Number.MAX_VALUE;
            var right = Number.MIN_VALUE;
            var top = Number.MAX_VALUE;
            var bottom = Number.MIN_VALUE;
            */

            node
                .attr("cx", (d: any) => {
                    // left = Math.min(left, d.x);
                    // right = Math.max(right, d.x);
                    return d.x;
                })
                .attr("cy", (d: any) => {
                    // top = Math.min(top, d.y);
                    // bottom = Math.max(bottom, d.y);
                    return d.y;
                });
            // console.log(right);
        });

        function nodeclicked(node, data) {
            var nodeRadius = Math.max(Math.min(Math.sqrt(data.mailCount), 20), 5)
            d3.select(node)
                .transition()
                .attr("stroke", "black")
                .attr("stroke-width", 2)
                .attr("r", nodeRadius * 2)

                .transition()
                .attr("stroke", "#fff")
                .attr("stroke-width", 1)
                .attr("r", nodeRadius);
        }

        function nodeGUI(ints, i) {
            var linklist = { "id": i.id, "sendto": [], "receivedfrom": [] };

            var sentLinks = links.filter(function (e) {
                return e.source.id == i.id;      //Finds emails sent
            })
            var receivedLinks = links.filter(function (e) {
                return e.target.id == i.id;      //Finds emails received
            })
            for (var link in sentLinks) {
                linklist["sendto"].push(sentLinks[link]['target']['id'])
            }
            for (var link in receivedLinks) {
                linklist["receivedfrom"].push(receivedLinks[link]['source']['id'])
            }
            ints.nodeEmailsEvent.emit(linklist);  // send lists of email senders/receivers to parent
            ints.nodeinfo = linklist;       // set local version
        }

        function linkGUI(i, showIndividualLinks) {
            if (showIndividualLinks) {
                var fromNode = nodes.filter(function (e) {
                    return e.id == i.source.id;      //Finds from node
                })
                var toNode = nodes.filter(function (e) {
                    return e.id == i.target.id;      //Finds to node
                })
                console.log("Email from " + fromNode[0]['id'] + " and to " + toNode[0]['id'])
            } else {
                console.log("Email transfers between " + fromNode[0]['id'] + " and " + toNode[0]['id'])
            }

        }

        // sort the links by source, then target
        function sortLinks() {
            links.sort(function (a, b) {
                if (a.source > b.source) {
                    return 1;
                }
                else if (a.source < b.source) {
                    return -1;
                }
                else {
                    if (a.target > b.target) {
                        return 1;
                    }
                    if (a.target < b.target) {
                        return -1;
                    }
                    else {
                        return 0;
                    }
                }
            });
        }

        //any links with duplicate source and target get an incremented 'linkindex'
        function setLinkIndexAndNum() {
            for (var i = 0; i < links.length; i++) {
                if (i != 0 &&
                    links[i].source == links[i - 1].source &&
                    links[i].target == links[i - 1].target) {
                    links[i].linkindex = links[i - 1].linkindex + 1;
                }
                else {
                    links[i].linkindex = 1;
                }
                // save the total number of links between two nodes
                if (mLinkNum[links[i].target + "," + links[i].source] !== undefined) {
                    mLinkNum[links[i].target + "," + links[i].source]++;
                }
                else {
                    mLinkNum[links[i].source + "," + links[i].target] = links[i].linkindex;
                }
            }
            //console.log(mLinkNum);
        }
    }

    setNewDate(event): void {
        //set newStartDate as the minimum date
        var newStartDate = new Date(this.minDate.toString().slice(0, 4) + "-" + this.minDate.toString().slice(4, 6) + "-" + this.minDate.toString().slice(6, 8) + "T00:00:00+0000")

        //set the date to be mindate
        newStartDate.setDate(newStartDate.getDate() + event.target.valueAsNumber);

        //Set newEndDate as 30 days after newStartDate
        var newEndDate = new Date(newStartDate);
        newEndDate.setDate(newEndDate.getDate() + 30);

        this.startDate = parseInt(newStartDate.getFullYear() + ('0' + (newStartDate.getMonth())).slice(-2) + ('0' + newStartDate.getDate()).slice(-2));
        this.endDate = parseInt(newEndDate.getFullYear() + ('0' + (newEndDate.getMonth())).slice(-2) + ('0' + newEndDate.getDate()).slice(-2));

        console.log(this.startDate)
        console.log(this.endDate)

        this.getDate.emit({ newStartDate, newEndDate });

        this.initiateGraph()
    }

    setSliderRange() {

        //YYYY-MM-DDTHH:MM:SS
        var minDate = new Date(this.minDate.toString().slice(0, 4) + "-" + this.minDate.toString().slice(4, 6) + "-" + this.minDate.toString().slice(6, 8) + "T00:00:00+0000")
        var maxDate = new Date(this.maxDate.toString().slice(0, 4) + "-" + this.maxDate.toString().slice(4, 6) + "-" + this.maxDate.toString().slice(6, 8) + "T00:00:00+0000")

        //number of days between the two days
        this.dateRange = (maxDate.getTime() - minDate.getTime()) / (1000 * 3600 * 24)

        //Emit signal that the daterange has been changed 
        this.uploaded.emit('complete');
    }

    //to drag nodes around
    //for a better understanding of alphaTarget (and alphaMin) check API or https://stackoverflow.com/questions/46426072/what-is-the-difference-between-alphatarget-and-alphamin
    drag(simulation) {
        let dragstarted = (event) => {
            if (!event.active) simulation.alphaTarget(0.3).restart();   //alphaTarget indicates how eager the nodes are to move. Changing this parameter changes behaviour of graph!!!
            event.subject.fx = event.subject.x;
            event.subject.fy = event.subject.y;
        }

        let dragged = (event) => {          //if node is being dragged, update position of node
            event.subject.fx = event.x;
            event.subject.fy = event.y;
        }

        let dragended = (event) => {
            if (!event.active) simulation.alphaTarget(0);       //drag has ended, the simulation stops moving  (alphaTarget(0))
            event.subject.fx = null;
            event.subject.fy = null;
        }

        return d3.drag()
            .on("start", dragstarted)
            .on("drag", dragged)
            .on("end", dragended);
    }

    //link colour based on sentiment of message
    linkColor(sentiment,highlighted): string {
        // console.log(sentiment);
        for (var s of sentiment) {
            if (s > 0.1) {
                return "#55EE55";
            }

            if (s < -0.1) {
                return "#EE5555";
            }
        }
        if(highlighted){
            return "#404040"
        }
        return "#999999";
    }

    //node colour based on job title
    nodeColor(job): string {
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
                //console.log(job);
                return "#000000";
        }
    }

    checkZoomReset(): void {
        console.log("Reset zoom!");
        const svg = d3.select("#force-graph");
        svg.selectAll("circle")
            .attr("transform", `translate(${this.beginPosX},${this.beginPosY}) scale(${this.beginScale})`)
        svg.selectAll("line")
            .attr("transform", `translate(${this.beginPosX},${this.beginPosY}) scale(${this.beginScale})`)

        svg.call(this.zoom.transform as any, d3.zoomIdentity.translate(this.beginPosX, this.beginPosY).scale(this.beginScale))
    }

    ngAfterViewInit(): void {
        this.width = this.container.nativeElement.offsetWidth;
        this.runSimulation(this.links, this.nodes, this.mLinkNum);
    }

    @ViewChild('container')
    container: ElementRef;
}
