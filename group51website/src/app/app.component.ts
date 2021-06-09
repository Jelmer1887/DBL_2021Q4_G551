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

export const jobs: string[] = ["CEO", "President", "Managing Director", "Director", "Trader", "In House Lawyer", "Manager", "Vice President",
    "Employee", "Unknown"];

//node colour based on job title
export function nodeColor(job): string {
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