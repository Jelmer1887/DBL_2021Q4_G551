import { Injectable } from '@angular/core';
import { Observable, of, BehaviorSubject } from 'rxjs';


@Injectable({
    providedIn: 'root'
})
export class UploadService {

    private fileSource = new BehaviorSubject(null)
    currentFile = this.fileSource.asObservable();

    constructor() { }

    // returns a observable file to be used by consumer

    changeFile(newfile: File) {
        // console.log("service: got new file!");
        // console.log(newfile);
        this.fileSource.next(newfile);
    }

}
