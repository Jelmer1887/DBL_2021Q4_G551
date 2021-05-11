import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { Navbarfile } from './nav-bar/nav-bar.component'


@Injectable({
  providedIn: 'root'
})
export class UploadService {

  constructor() { }

  // returns a observable file to be used by consumer
  getFile(): Observable<File>{
    const file = of(Navbarfile);

    console.log("service: found file object: ")
    console.log(Navbarfile);
    console.log("service: providing: " + file)
    return file;
  }


}
