import { ForceGraphComponent } from './force-graph/force-graph.component';
import { Injectable } from '@angular/core';
import { Observable, BehaviorSubject, ReplaySubject, Subscription } from 'rxjs'

type Brush = {
    brushEnabled: boolean,
    brushedNodes: number[],
}

@Injectable({
    providedIn: 'root'
})
export class BrushShareService {
    // this is the variable holding the data, it's a special 'replaysubject', basically a log holding all (1) past values of the variable.
    static brushSource: BehaviorSubject<Brush> = new BehaviorSubject({
        brushEnabled: false,
        brushedNodes: [],
    });

    public static updateBrush(newBrush: Brush) {
        this.brushSource.next(newBrush)
    }

    constructor() { }
}
