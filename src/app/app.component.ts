import { AfterViewInit, Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { GoogleSheetsService } from './google-sheets.service';
import { CanvasJSAngularChartsModule } from '@canvasjs/angular-charts';
import { JsonPipe } from '@angular/common';
// import { Chart, ChartDataset, ChartOptions } from 'chart.js';
// import { Label } from 'ng2-charts';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, CanvasJSAngularChartsModule, JsonPipe],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent implements OnInit {
  public chartOptions: any;

  public chartData: any;
  public chartDataArray!: any[];
  public headers: any;
  title = 'phrases';

  constructor (public googleSheetsService: GoogleSheetsService) {
    this.chartDataArray = [];
  }

  ngOnInit() {

  }

  loadData() {
    this.googleSheetsService.getSheetData().subscribe(data => {
      this.chartData = data;
      console.log(this.chartData.length);
      this.chartDataArray = this.chartDataArray.concat(this.chartData[0]);
      this.createChart();
    });
  }

  createChart () {
    // Docs for this dumb chart
    // https://canvasjs.com/angular-charts/line-chart-with-date-time-axis/
    this.chartOptions = {
      title: {
        text: "Phrases"
      },
      axisX: {
        valueFormatString: "YYYY",
        intervalType: "year",
      },
      data: [
        {
          type: 'line',
          name: 'COVENANT PEOPLE',
          dataPoints: [
            { x: new Date(2024, 0, 1), y: 9 },
            { x: new Date (2023), y: 3 },
            { x: new Date(2022), y: 4 },
            { x: new Date(2021), y: 6 },
            { x: new Date(2020), y: 1 }
          ],
        }
      ]
      // data: this.chartDataArray
      }

  }
}
