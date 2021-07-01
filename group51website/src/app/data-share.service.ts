import { ForceGraphComponent } from './force-graph/force-graph.component';
import { Injectable } from '@angular/core';
import { Observable, BehaviorSubject, ReplaySubject, Subscription } from 'rxjs'

@Injectable({
    providedIn: 'root'
})
export class DataShareService {


    // variables -------------------------------------------------------

    // common - Data (eg the nodes)
    static sdatasource: BehaviorSubject<Data> = new BehaviorSubject({
        nodes: [],
        groupedLinks: [],
        individualLinks: [],
        adjacencyMatrix: [[]]
    });

    // common - selected node
    static sselectednode: BehaviorSubject<any> = new BehaviorSubject({})

    // currently only arcDiagram (should it?) - vis2Fullscreen
    static svis2Fullscreen: BehaviorSubject<any> = new BehaviorSubject(false)

    static svis1Fullscreen: BehaviorSubject<any> = new BehaviorSubject(false)
    // update methods --------------------------------------------------

    public static updateData(newData: Data) {
        console.log("service: new data incoming!")
        this.sdatasource.next(newData)
    }

    public static updateServiceNodeSelected(newNode: {}){
        console.log("service: new selected node incoming!")
        this.sselectednode.next(newNode)
    }

    public static updateServiceVis2FullScreen(newVal: boolean){
        console.log("service: new fullscreen2 value incoming!")
        this.svis2Fullscreen.next(newVal)
    }

    public static updateServiceVis1FullScreen(newVal: boolean){
        console.log("service: new fullscreen2 value incoming!")
        this.svis1Fullscreen.next(newVal)
    }
    constructor() { }
}
