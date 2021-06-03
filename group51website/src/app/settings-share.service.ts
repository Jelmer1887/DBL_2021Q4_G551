import { Injectable } from '@angular/core';
import { Observable, BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class SettingsShareService {

  private serviceSource_showIndividualLinks = new BehaviorSubject(false);
  private serviceSource_arcSort = new BehaviorSubject("NONE");
  private serviceSource_matrixSort = new BehaviorSubject("NONE"); //Maurits: to be fair, idk why i added this
  //private serviceSource_maxDate = new BehaviorSubject(/*INSERT TYPE HERE */);

  private service_showIndividualLinks = this.serviceSource_showIndividualLinks.asObservable();

  constructor() { }
}
