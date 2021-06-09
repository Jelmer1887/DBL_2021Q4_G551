import { ForceGraphComponent } from './force-graph/force-graph.component';
import { Injectable } from '@angular/core';
import { Observable, BehaviorSubject, ReplaySubject, Subscription } from 'rxjs'

@Injectable({
    providedIn: 'root'
})
export class DataShareService {


    // this is the variable holding the data, it's a special 'replaysubject', basically a log holding all (1) past values of the variable.
    static sdatasource: BehaviorSubject<Data> = new BehaviorSubject({
        nodes: [],
        groupedLinks: [],
        individualLinks: [],
        adjacencyMatrix: [[]]
    });

    public static updateData(newData: Data) {
        console.log("service: new data incoming!")
        console.log(newData);
        this.sdatasource.next(newData)

        // debugging logging
        //console.log("service: found: ")
        //this.sdatasource.subscribe(console.log)
        // console.log("stored as replayobject:")
        // console.log(this.sdatasource)
    }

    constructor() { }
}
