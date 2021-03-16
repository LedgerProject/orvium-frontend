import { Injectable } from '@angular/core';
import { Discipline } from '../model/orvium';
import { environment } from '../../environments/environment';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class DisciplinesService {
  private disciplines: Discipline[];

  constructor(private httpClient: HttpClient) {
  }

  async init(): Promise<void> {
    this.disciplines = await this.httpClient.get<Discipline[]>(`${environment.apiEndpoint}/disciplines`).toPromise();
  }

  getDisciplines(): Discipline[] {
    return this.disciplines;
  }
}
