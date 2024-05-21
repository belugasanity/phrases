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

  getSheetData(): Observable<any> {
    const url = `https://sheets.googleapis.com/v4/spreadsheets/${this.spreadsheetId}/values/${this.range}?key=${this.apiKey}`;
    return this.http.get<any>(url).pipe(
      map((response) => {
        const rows = response.values;
        const headers = rows[0].slice(2); // Exclude the first two column headers
        const data = rows.slice(1).map((row: string | any[]) => ({
          year: row[1], // Column B as year
          values: row.slice(2) // Omit the first two columns
        }));

        const formattedData = headers.map((header: any, colIndex: string | number) => {
          return {
            type: "line",
            name: header,
            dataPoints: data.map((row: { year: any; values: { [x: string]: any; }; }) => ({
              x: new Date(row.year, 0, 1),
              y: parseFloat(row.values[colIndex] || 0)
            }))
          };
        });

        return formattedData;
    })
  );
  }
}
