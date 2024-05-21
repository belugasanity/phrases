import { Injectable } from '@angular/core';
import { environment } from '../environments/environment';
import { HttpClient } from '@angular/common/http';
import { Observable, map } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class GoogleSheetsService {
  private apiKey: string = environment.sheetsAPI;
  private spreadsheetId: string = environment.sheetId;
  private range: string = 'Timeline: Phrases';

  constructor(private http: HttpClient) { }

  getSheetData(): Observable<any[]> {
    const url = `https://sheets.googleapis.com/v4/spreadsheets/${this.spreadsheetId}/values/${this.range}?key=${this.apiKey}`;
    return this.http.get<any>(url).pipe(
      map(response => response.values)
    );
  }
}
