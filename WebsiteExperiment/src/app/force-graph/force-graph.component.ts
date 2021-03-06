import { Component, OnInit, Input, OnChanges, SimpleChanges } from '@angular/core';
import * as d3 from 'd3';

@Component({
    selector: 'app-force-graph',
    templateUrl: './force-graph.component.html',
    styles: [
    ]
})
export class ForceGraphComponent implements OnInit, OnChanges {

    @Input() file;

    private nodes = [
        { "id": 0, "job": "Employee" },
        { "id": 1, "job": "Unknown" },
        { "id": 2, "job": "Employee" },
        { "id": 3, "job": "Employee" },
        { "id": 4, "job": "Vice President" },
        { "id": 5, "job": "Manager" },
    ];

    private links = [
        { "source": 0, "target": 1, "sentiment": [0.0] },
        { "source": 1, "target": 0, "sentiment": [0.0] },
        { "source": 1, "target": 0, "sentiment": [0.0] },
        { "source": 1, "target": 0, "sentiment": [0.0] },
        { "source": 0, "target": 5, "sentiment": [0.4] },
        { "source": 0, "target": 5, "sentiment": [0.4] },
        { "source": 0, "target": 5, "sentiment": [0.4] },
        { "source": 5, "target": 0, "sentiment": [0.4] },
        { "source": 2, "target": 1, "sentiment": [0.9] },
        { "source": 3, "target": 5, "sentiment": [-0.5] },
        { "source": 2, "target": 4, "sentiment": [-0.8] },
    ]

    //This will hold the number of links every node has
    private mLinkNum=[]

    //width and height of screen
    private width = 1000;
    private height = 1000;

    //Set year and month
    private year = 2001;
    private month = 11;
    private day = 26;

    constructor() { }

    ngOnChanges(changes: SimpleChanges): void {
        let fileReader = new FileReader();

        fileReader.onload = (e) => {

            // Array of strings with every string being a line.
            var lines = fileReader.result.toString().split('\n');

            // Empty the nodes and links so we can read the new ones.
            this.nodes = [];
            this.links = [];
            this.mLinkNum = [];

            var filter = this.year + "-" + this.month + "-" + this.day;

            // Loop through all the lines, but skip the first since that one never contains data.
            for (var line of lines) {
                // Get the different columns by splitting on the "," .
                var columns = line.split(',');

                // Make sure it's not an empty line.
                if (columns.length <= 4) {
                    continue;
                }

                // Filter to a specific month for more clarity.
                if (!columns[0].includes(filter)) {
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
                        l.sentiment.push(parseFloat(columns[8]));
                        break;
                    }
                }
                //if (!linkFound) {
                    this.links.push({
                        "source": source,
                        "target": target,
                        "sentiment": [parseFloat(columns[8])]
                    });
                //}
            }

            // Start the simulation with the new links and nodes.
            this.runSimulation(this.links, this.nodes, this.mLinkNum);
        };

        if (this.file != null) {
            fileReader.readAsText(this.file);
        }
    }

    runSimulation(links, nodes, mLinkNum): void {

        var data = {"nodes":nodes,"links":links};
        sortLinks();
        setLinkIndexAndNum();

        const simulation = d3.forceSimulation(nodes)                            //automatically runs simulation 
            .force("link", d3.forceLink(links).id((d: any) => d.id))            //Adds forces between nodes, depending on if they're linked
            .force("charge", d3.forceManyBody())                                // nodes repel each other
            .force("center", d3.forceCenter(this.width / 2, this.height / 2));  // nodes get pulled towards the centre of svg

        const svg = d3.select("#force-graph")   //let d3 know where the simulation takes place
            .attr("width", this.width)
            .attr("height", this.height);

        svg.selectAll("g").remove();

        //adds visuals of the links
        const link = svg.append("g")    //"g" is an element of SVG used to group other SVG elements
            .attr("stroke-opacity", 0.5)
            .selectAll("path")
            .data(links)
            .join("path")
            .attr("stroke-width",2)
            .attr("stroke", (d: any) => this.linkColor(d.sentiment))
            .on("click",function(d,i){
                linkGUI(i);                                     //To display info about link
            });

        const node = svg.append("g")
            .attr("stroke", "#fff")
            .attr("stroke-width", 1)
            .selectAll("circle")
            .data(nodes)
            .join("circle")
            .attr("r", 4)
            .attr("fill", (d: any) => this.nodeColor(d.job))    //colour nodes depending on job title
            .call(this.drag(simulation))                        //makes sure you can drag nodes
            .on("click",function(d,i){
                nodeclicked(this);                              //Small animation of node
                nodeGUI(i);                                     //To display info about node
                
            });

        node.append("title")
            .text((d: any) => d.id);   //gives each node element in the svg a title (its id). Visible when hovering over node.

        //function that updates position of nodes and links
        simulation.on("tick", () => {

            link.attr("d", (d:any) => {
                var dx = d.target.x - d.source.x,
                    dy = d.target.y - d.source.y,
                    dr = Math.sqrt(dx * dx + dy * dy);
                // get the total link numbers between source and target node
                var lTotalLinkNum = mLinkNum[d.target.id + "," + d.source.id] || mLinkNum[d.source.id + "," + d.target.id];
                if(lTotalLinkNum > 1)
                {
                    // if there are multiple links between these two nodes, we need generate different dr for each path
                    dr = dr/(1 + (1/lTotalLinkNum) * (d.linkindex - 1));
                }
                // generate svg path
                return "M" + d.source.x + "," + d.source.y + 
                       "A" + dr + "," + dr + " 0 0 1," + d.target.x + "," + d.target.y + 
                       "A" + dr + "," + dr + " 0 0 0," + d.source.x + "," + d.source.y;	
            });
            node
                .attr("cx", (d: any) => d.x)
                .attr("cy", (d: any) => d.y);
        });

        function nodeclicked(node){
            d3.select(node)
                .transition()
                .attr("stroke", "black")
                .attr("stroke-width",2)
                .attr("r",4*2)

                .transition()
                .attr("stroke", "#fff")
                .attr("stroke-width", 1)
                .attr("r",4);
        }

        function nodeGUI(i){
            var sentLinks = links.filter(function(e) {
                return e.source.id == i.id;      //Finds emails sent
            })
            var receivedLinks = links.filter(function(e) {
               return e.target.id == i.id;      //Finds emails received
            })
             for(var link in sentLinks){
                 console.log("Sent an email to " + sentLinks[link]['target']['id']);
             }
             for(var link in receivedLinks){
                console.log("Received an email from " + receivedLinks[link]['source']['id']);
            }
            
        }

        function linkGUI(i){
            var fromNode = nodes.filter(function(e) {
                return e.id == i.source.id;      //Finds from node
            })
            var toNode = nodes.filter(function(e) {
                return e.id == i.target.id;      //Finds to node
            })
            console.log("Email from "+fromNode[0]['id']+" and to "+toNode[0]['id'])
        }

        // sort the links by source, then target
        function sortLinks()
        {								
            data.links.sort(function(a,b) {
                if (a.source > b.source) 
                {
                    return 1;
                }
                else if (a.source < b.source) 
                {
                    return -1;
                }
                else 
                {
                    if (a.target > b.target) 
                    {
                        return 1;
                    }
                    if (a.target < b.target) 
                    {
                        return -1;
                    }
                    else 
                    {    
                        return 0;
                    }
                }
            });
        }
        
        //any links with duplicate source and target get an incremented 'linkindex'
        function setLinkIndexAndNum()
        {								
            for (var i = 0; i < data.links.length; i++) 
            {
                if (i != 0 &&
                    data.links[i].source == data.links[i-1].source &&
                    data.links[i].target == data.links[i-1].target) 
                {
                    data.links[i].linkindex = data.links[i-1].linkindex + 1;
                }
                else
                {
                    data.links[i].linkindex = 1;
                }
                // save the total number of links between two nodes
                if(mLinkNum[data.links[i].target + "," + data.links[i].source] !== undefined)
                {
                    mLinkNum[data.links[i].target + "," + data.links[i].source] ++;
                }
                else
                {
                    mLinkNum[data.links[i].source + "," + data.links[i].target] = data.links[i].linkindex;
                }
            }
            console.log(mLinkNum);
        }	
    }

    //to drag nodes around
    //for a better understanding of alphaTarget (and alphaMin) check API or https://stackoverflow.com/questions/46426072/what-is-the-difference-between-alphatarget-and-alphamin
    drag(simulation) {
        let dragstarted = (event) => {
            if (!event.active) simulation.alphaTarget(0.1).restart();   //alphaTarget indicates how eager the nodes are to move. Changing this parameter changes behaviour of graph!!!
            event.subject.fx = event.subject.x;
            event.subject.fy = event.subject.y;
        }

        let dragged = (event) => {  //if node is being dragged, update position of node
            event.subject.fx = event.x;
            event.subject.fy = event.y;
        }

        let dragended = (event) => {
            if (!event.active) simulation.alphaTarget(0);   //drag has ended, the simulation stops moving  (alphaTarget(0))
            event.subject.fx = null;
            event.subject.fy = null;
        }

        return d3.drag()
            .on("start", dragstarted)
            .on("drag", dragged)
            .on("end", dragended);
    }

    //link colour based on sentiment of message
    linkColor(sentiment): string {
        //console.log(sentiment);
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

    //node colour based on job title
    nodeColor(job): string {
        switch (job) {
            case "Employee":
                return "#0000FF";
            case "Vice President":
                return "#00FF00";
            case "Manager":
                return "#00FFFF";
            case "In House Lawyer":
                return "#FFFF00";
            case "Trader":
                return "#FF00FF";
            case "Director":
                return "#0808FF";
            case "Managing Director":
                return "#0404FF";
            case "President":
                return "#FF0707";
            case "CEO":
                return "#FF0000"
            case "Unknown":
                return "#555555";

            default:
                console.log(job);
                return "#000000";
        }
    }

    ngOnInit(): void {
        this.runSimulation(this.links, this.nodes, this.mLinkNum);
    }

}
