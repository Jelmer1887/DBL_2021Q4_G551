import { Injectable } from '@angular/core';
import { Observable, of, BehaviorSubject } from 'rxjs';

declare global {
    type MailNode = {
        id: number;
        job: string;
        address: string;
        mailCount: number;
    }

    type Link = {
        date: number;
        source: number;
        target: number;
        sentiment: number[];
    }

    type Data = {
        nodes: MailNode[];
        groupedLinks: Link[];
        individualLinks: Link[];
        adjacencyMatrix: number[][];
    }

}

export function emptyData(): Data {
    return {
        nodes: [],
        groupedLinks: [],
        individualLinks: [],
        adjacencyMatrix: [[]]
    };
}

@Injectable({
    providedIn: 'root'
})
export class UploadService {

    private dataSource = new BehaviorSubject(emptyData())
    currentData = this.dataSource.asObservable();

    constructor() { }

    // returns a observable file to be used by consumer

    changeData(newData: Data) {
        console.log("service: got new file!");
        console.log(newData);
        this.dataSource.next(newData);
    }

}
