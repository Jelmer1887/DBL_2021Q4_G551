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
                var address = columns[2];
                // Add the source if we can't find it in the array of nodes.
                var srcFound = false;
                for (var n of this.nodes) {
                    if (n.id === source) {
                        srcFound = true;
                        break;
                    }
                }
                if (!srcFound) {
                    this.nodes.push({ "id": source, "address": address ,"job": columns[3] });
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
                    this.nodes.push({ "id": target, "address": address, "job": columns[6] });
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
        sortNodesID(); 
        nodes.shift();//remove NaNs.
        nodes.shift();
        //sortNodesJob();
        console.log(nodes);
        const svg = d3.select("#arc-diagram")
            //.append("svg")
            .attr("width", this.width)
            .attr("height", this.height);
            //.append("g")
            //.attr("transform", "translate(0,50)");
        
        svg.selectAll("g").remove();        
        
        var jobs = ["CEO", "President", "Vice President", "Managing Director", "Director", "Manager", "In House Lawyer", "Trader", 
        "Employee", "Unknown"];

        //CEO, President, Vice President, Managing Director, Director, In House Lawyer, Trader, Employee, Unknown.
        function sortNodesJob() {
            nodes.sort(function (a,b) {
                if (a.job == b.job) {
                    return a.id.localCompare(b.id);
                } else { //broky
                        return jobs.indexOf(a.job) - jobs.indexOf(b.job); //either positive or negative, sorted accordingly
                }
            })
        }

        function sortNodesID() {
            nodes.sort(function(a,b) {
            if (a.id > b.id) {
                return 1;
            } else if (a.id < b.id) {
                return -1
            }
            })
       }        
        //console.log(nodes);
        var nodeID = [];
        for (var i = 0; i< nodes.length; i++) {
            //nodeID.push(Object.values(Object.values(Object.values(nodes))[i]));
            nodeID.push(Object.values(nodes[i])[0]);
        }
        
    
        console.log(nodeID);
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
//This is the ugliest solution ever. It makes the text boxes longer, making it easier to interact with them with mouse-events
        function makeText(d){
            if (d.id.length == 3) {
                return " \u00A0" + d.id + "\u00A0 \u00A0 \u00A0"; //\u00A0 is unicode for NO-BREAK SPACE. HTML will ignore " "...
            } else if (d.id.length == 2) {
                return " \u00A0 \u00A0 \u00A0 \u00A0" + d.id + "\u00A0\u00A0\u00A0";
            } else {
                return " \u00A0 \u00A0 \u00A0 \u00A0 \u00A0" + d.id + "\u00A0\u00A0\u00A0";
            }
        }
        console.log("  ".length);
        const node = svg.selectAll("mynodes")
            .data(nodes)
            .enter()
            .append("circle")
                .attr("cy", function(d) {return(x(d.id))})
                .attr("cx", 30)
                .attr("r", nodeRadius)
                .style("fill", d => nodeColor(d.job));
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
                .attr("transform", d => `translate(${0},${d.y = x(d.id) + nodeRadius+1})`)
            .text(d => makeText(d))
            .style("text-anchor", "middle")
            //creating rectangles would make this event handling a lot more consistent, now you really have to aim your mouse to hit the text
            .on("mouseover", function(event,d) {
                label.style('fill', "#ccc")
                d3.select(this).style('font-weight', 'bold')
                d3.select(this).style('fill', "#000")
                link.style('stroke', a=> a.source === d.id || a.target === d.id ? nodeColor(d.job) : '#ccc')   
                .style('stroke-width', a=>a.source === d.id || a.target === d.id ? 2 : 1)
            })
            .on("mouseout", function(event, d) {
                label.style('fill', "#000")
                d3.select(this).style('fill', '#000')
                d3.select(this).style('font-weight', 'normal')
                link.style('stroke', a=> a.sentiment < -0.1 ? "#EE5555" : a.sentiment > 0.1? "#55EE55" : "#999999") 
                .style('stroke-width', 1)                                         
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
            .attr('d', function (d) {
            var start = x(d.source)    // X position of start node on the X axis
            //console.log(start);
            var end = x(d.target)      // X position of end node
            return ['M', 30, start,    // the arc starts at the coordinate x=start, y=height-30 (where the starting node is)
                'A',                            // This means we're gonna build an elliptical arc
                (start - end)/2, ',',    // Next 2 lines are the coordinates of the inflexion point. Height of this point is proportional with start - end distance
                (start - end)/2, 0, 0, ',',
                start < end ? 1 : 0, 30, ',', end] // We always want the arc on top. So if end is before start, putting 0 here turn the arc upside down. Final numerical value of this line determines x coordinate of endpoints of arc.
                .join(' ');
            })
            .style("fill", "none")
            .attr("stroke", d=> this.linkColor(d.sentiment));
    }
    ngAfterViewInit(): void {
        this.width = this.container.nativeElement.offsetWidth;
        this.runDiagram(this.links, this.nodes, this.mLinkNum);
    }
    @ViewChild('container')
    container: ElementRef;
    
    
    //link colour based on sentiment of message
    linkColor(sentiment): string {
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
}


