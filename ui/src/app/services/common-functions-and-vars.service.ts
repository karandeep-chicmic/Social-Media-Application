import { Injectable, signal } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class CommonFunctionsAndVarsService {
  showNavbar = new BehaviorSubject<boolean>(false);
  constructor() { }
}
