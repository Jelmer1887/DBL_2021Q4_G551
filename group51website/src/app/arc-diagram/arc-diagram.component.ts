import { Component, AfterViewInit, Input, OnChanges, SimpleChanges, ViewChild, ElementRef, EventEmitter, Output } from '@angular/core';
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

    // Input variables.
    @Input() file;
    @Input() sort;
    @Input() selectedNode;

    @Output() nodeToParent = new EventEmitter<any>(); //event to send node selected to parent


    //Slider variables
    private minDate = Math.min();

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
        console.log("arcdiagram: NODE SELECTED IS " + this.selectedNode)
        this.initiateDiagram()
    }

    initiateDiagram(){
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

                //Find min date for the slider
                if (dateInt < this.minDate) {
                    this.minDate = dateInt;
                }

                /// Filter to a specific month for more clarity.
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
                        n.mailCount += 1;
                        break;
                    }
                }
                if (!srcFound) {
                    //console.log(source);
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
                if (!linkFound) {
                    this.links.push({
                        "source": source,
                        "target": target,
                        "sentiment": [parseFloat(columns[8])]
                    });
                }
            }

            // Start the simulation with the new links and nodes.
            this.runDiagram(this.links, this.nodes, this.mLinkNum);
            //console.log(this.nodes)
        };

        if (this.file) {
            fileReader.readAsText(this.file);
        }
    }

    runDiagram(links, nodes, mLinkNum): void {
        var inst = this; // crude fix to store instance info

        var jobs = ["CEO", "President", "Managing Director", "Director", "Trader", "In House Lawyer", "Manager", "Vice President",
            "Employee", "Unknown"];

        if (this.sort == "id") {
            sortNodesID();
        } else if (this.sort == "job") {
            sortNodesJob();
        } else if (this.sort == "amount") {
            sortNodesAmount();
        }
        //console.log(nodes);
        const svg = d3.select("#arc-diagram")
            //.append("svg")
            .attr("width", this.width)
            .attr("height", this.height);
        //.append("g")
        //.attr("transform", "translate(0,50)");

        svg.selectAll("*").remove()


        // Add a legend.
        const legend = d3.select("#arc-legend")
            .attr("width", this.width)
            .attr("height", 80);

        for (var i = 0; i < jobs.length; i++) {
            legend.append("circle").attr("cx", 20 + (i % 5) * 160).attr("cy", 30 + (i % 2) * 35 - 6).attr("r", 6).style("fill", nodeColor(jobs[i]))
            legend.append("text").attr("x", 30 + (i % 5) * 160).attr("y", 30 + (i % 2) * 35).text(jobs[i]).style("font-size", "15px").attr("alignment-baseline", "middle")
        }
        //CEO, President, Vice President, Managing Director, Director, In House Lawyer, Trader, Employee, Unknown.
        function sortNodesJob() {
            nodes.sort(function (a, b) {
                if (a.job == b.job) {
                    return (a.id < b.id ? -1 : 1);
                } else { //broky
                    return jobs.indexOf(a.job) - jobs.indexOf(b.job); //either positive or negative, sorted accordingly
                }
            })
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

        function sortNodesAmount() {
            nodes.sort(function (a, b) {
                if (a.mailCount == b.mailCount) {
                    return (a.id < b.id ? -1 : 1);
                } else {
                    return (a.mailCount > b.mailCount ? -1 : 1);
                }
            })
        }

        //console.log(nodes);
        var nodeID = [];
        for (var i = 0; i < nodes.length; i++) {
            //nodeID.push(Object.values(Object.values(Object.values(nodes))[i]));
            nodeID.push(Object.values(nodes[i])[0]);
        }

        var x = d3.scalePoint()
            .range([0, this.height])
            .padding(0.5)
            .domain(nodeID);

        var nodeRadius = 2;
        //add circles for the nodes
        svg.append("style").text(`

.hover path {
  stroke: #ccc;
}

.hover text {
  fill: #ccc;
} 

.hover mylabels.primary text {
  fill: black;
  font-weight: bold;
}

.hover mylabels.secondary text {
  fill: #333;
}

.hover path.primary {
  stroke: #333;
  stroke-opacity: 1;
}

`);
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
          //link colour based on sentiment of message
    function linkColor(sentiment): string {
        // console.log(sentiment);
        for (var s of sentiment) {
            if (s > 0.1) {
                return "#55EE55";
            }

            if (s < -0.1) {
                return "#EE5555";
            }
        }

        return "#999999";
    }
        //This is the ugliest solution ever. It makes the text boxes longer, making it easier to interact with them with mouse-events
        function makeText(d) {
            if (d.id.length == 3) {
                return " \u00A0" + d.id + "\u00A0 \u00A0 \u00A0"; //\u00A0 is unicode for NO-BREAK SPACE. HTML will ignore " "...
            } else if (d.id.length == 2) {
                return " \u00A0 \u00A0 \u00A0 \u00A0" + d.id + "\u00A0\u00A0\u00A0";
            } else {
                return " \u00A0 \u00A0 \u00A0 \u00A0 \u00A0" + d.id + "\u00A0\u00A0\u00A0";
            }
        }

        const node = svg.selectAll("mynodes")
            .data(nodes)
            .enter()
            .append("circle")
            .attr("cy", function (d: any) { return (x(d.id)) })
            .attr("cx", 30)
            .attr("r", nodeRadius)
            .style("fill", (d: any) => nodeColor(d.job));
        //function(d){ return(x(d.name))}
        //add labels for nodes 
        node.append("title")
            .text((d: any) => {
                return "id: " + d.id + "\n" +
                    "e-mail: " + d.address + "\n" +
                    "function: " + d.job;
            });

        const label = svg.selectAll("mylabels")
            .data(nodes)
            .enter()
            .append("text")
            .attr("font-size", "8")
            .attr("font-family", "sans-serif")
            .attr("x", 12)
            .attr("transform", (d: any) => `translate(${0},${d.y = x(d.id) + nodeRadius + 1})`)
            .text(d => makeText(d))
            .style("text-anchor", "middle")
            .on("click",(event, d: any) => {
                inst.nodeToParent.emit(d.id)
            })
            //creating rectangles would make this event handling a lot more consistent, now you really have to aim your mouse to hit the text
            .on("mouseover", function (event, d: any) {
                label.style('fill', "#ccc")
                d3.select(this).style('font-weight', 'bold')
                d3.select(this).style('fill', "#000")
                link.style('stroke', (a: any) => a.source === d.id || a.target === d.id ? nodeColor(d.job) : '#ccc')
                //.style('stroke-width', (a: any) => a.source === d.id || a.target === d.id ? 2 : 1)
            })
            .on("mouseout", function (event, d) {
                label.style('fill', "#000")
                d3.select(this).style('fill', '#000')
                d3.select(this).style('font-weight', 'normal')
                link.style('stroke', (a: any) => linkColor(a.sentiment))
                //.style('stroke-width', 1)
            })
            .call(mylabels => mylabels.append("text")
                .attr("x", 0)
                .attr("dy", "0.35em")
                .attr("fill", "#008000") //d3.lab(color(d.group)).darker(2)
                .text(d => makeText(d)));
        label.append("title")
            .text((d: any) => {
                return "id: " + d.id + "\n" +
                    "e-mail: " + d.address + "\n" +
                    "function: " + d.job;
            });
        /*const overlay = svg.append("g")
            .attr("fill", " none")
            .attr("pointer-events", "all")
            .selectAll('rect')
            .data(nodes)
            .join('rect')
                .attr("width", 23)
                .attr("height", 3)
                .attr('y', d=>x(d.id) - 1.5)
                .on("mouseover", function(event,d) {
                    label.style('fill', "#ccc")
                    d3.selectAll("mylabels").select(label).style('fill', '#69b3b2')
                    link.style('stroke', a=> a.source === d.id || a.target === d.id ? '#69b3b2' : '#ccc')   
                    .style('stroke-width', a=>a.source === d.id || a.target === d.id ? 2 : 1)
                })
                */
        //add the links
        const link = svg.selectAll('mylinks')
            .data(links)
            .enter()
            .append('path')
            .attr('d', function (d: any) {
                var start = x(d.source)    // X position of start node on the X axis
                //console.log(start);
                var end = x(d.target)      // X position of end node
                return ['M', 30, start,    // the arc starts at the coordinate x=start, y=height-30 (where the starting node is)
                    'A',                            // This means we're gonna build an elliptical arc
                    (start - end) / 2, ',',    // Next 2 lines are the coordinates of the inflexion point. Height of this point is proportional with start - end distance
                    (start - end) / 2, 0, 0, ',',
                    start < end ? 1 : 0, 30, ',', end] // We always want the arc on top. So if end is before start, putting 0 here turn the arc upside down. Final numerical value of this line determines x coordinate of endpoints of arc.
                    .join(' ');
            })
            .style("fill", "none")
            .attr("stroke", (d: any) => linkColor(d.sentiment))
            .attr("stroke-opacity", 0.6)
            .attr("stroke-width", (d: any) => Math.max(Math.min(Math.sqrt(d.sentiment.length), nodeRadius * 2), 1));
    }

    ngAfterViewInit(): void {
        this.width = this.container.nativeElement.offsetWidth;
        this.runDiagram(this.links, this.nodes, this.mLinkNum);
    }

    @ViewChild('container')
    container: ElementRef;

    //Set the data to be shown
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

        this.initiateDiagram()
    }

}


