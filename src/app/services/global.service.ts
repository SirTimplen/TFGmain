import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class GlobalService {
  private userTypeSubject = new BehaviorSubject<'usuario' | 'tutor' | 'tribunal' | null>(null);
  public userType$ = this.userTypeSubject.asObservable();

  setUserType(type: 'usuario' | 'tutor' | 'tribunal') {
    console.log('Setting userType to:', type); // Depuración
    this.userTypeSubject.next(type);
  }

  getUserType(): 'usuario' | 'tutor' | 'tribunal' | null {
    console.log('Getting userType:', this.userTypeSubject.value); // Depuración
    return this.userTypeSubject.value;
  }
}