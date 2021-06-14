import { Component } from '@angular/core';

@Component({
    selector: 'app-root',
    templateUrl: './app.component.html',
    styleUrls: ['./app.component.css']
})
export class AppComponent {
    title = 'group51website';
}

declare global {
    type MailNode = {
        id: number,
        mailCount: number,
        address: string,
        job: string
    }

    type Link = {
        source: number, // Id of source
        target: number, // Id of target
        date: number[],
        sentiment: number[],
        type: string[] // TO or CC
    }

    type Data = {
        nodes: MailNode[],
        groupedLinks: Link[],
        individualLinks: Link[],
        adjacencyMatrix: number[][] // Usage: adjacencyMatrix[sourceId][targetId] will return the amount of e-mails
    }

}

export var jobs: string[] = [];

export function setJobs(newJobs) {
    jobs = newJobs;
}

//node colour based on job title
export function nodeColor(job): string {
    switch (job) {
        /*
        case 0:
            return "#8a56e2";
        case 1:
            return "#e2cf56";
        case 2:
            return "#e28956";
        case 3:
            return "#e25668";
        case 4:
            return "#cf56e2";
        case 5:
            return "#5668e2";
        case 6:
            return "#56aee2";
        case 7:
            return "#56e2cf";
        case 8:
            return "#68e256";
        case 9:
            return "#555555";
            */
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
            return "#000000";
    }
}