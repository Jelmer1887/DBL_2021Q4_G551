import { Injectable } from '@angular/core';
import { Observable, of, BehaviorSubject } from 'rxjs';

declare global {
    type MailNode = {
        id: number;
        job: string;
        address: string;
        mailCount: number;
    }

    type GroupedLink = {
        date: number;
        source: number;
        target: number;
        sentiment: number[];
    }

    type IndividualLink = {
        date: number;
        source: number;
        target: number;
        sentiment: number;
    }

    type Data = {
        nodes: MailNode[];
        groupedLinks: GroupedLink[];
        individualLinks: IndividualLink[];
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
