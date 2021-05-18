import { Directive, Injectable } from '@angular/core';
import { Observable, of, BehaviorSubject } from 'rxjs';


@Injectable({
  providedIn: 'root'
})
export class ForceGraphDataShareService {

  // Node selection data (NOT USED ATM)
  private nodeSelectSource = new BehaviorSubject(new Array);  // think of this variable as a pile of versions of the currentNodeSelect variable
  currentNodeSelect = this.nodeSelectSource.asObservable();  // hold the info to be shared, is the latest updated version.

  constructor() { }

  // funtion to update the selectednodeinfo across all components that need it.
  updateSelection(newSelectedNodeInfo){
    console.log(newSelectedNodeInfo);
    this.nodeSelectSource.next(newSelectedNodeInfo);  // add version of the variable to the 'pile' of versions, service will notice and update other components versions
  }
}
