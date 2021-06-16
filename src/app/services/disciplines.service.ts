import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
import { HttpClient } from '@angular/common/http';
import { DisciplineDTO } from '../model/api';
import { Observable } from 'rxjs';
import { shareReplay } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class DisciplinesService {
  private disciplines?: Observable<DisciplineDTO[]>;

  constructor(private httpClient: HttpClient) {
  }

  getDisciplines(): Observable<DisciplineDTO[]> {
    if (!this.disciplines) {
      this.disciplines = this.httpClient.get<DisciplineDTO[]>(`${environment.apiEndpoint}/disciplines`).pipe(
        shareReplay(1)
      );
    }

    return this.disciplines;
  }
}
