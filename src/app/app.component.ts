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

  public selectedDataArray!: any[];

  constructor (public googleSheetsService: GoogleSheetsService) {
    this.chartDataArray = [];
    this.selectedDataArray = [];
  }

  ngOnInit() {
    this.googleSheetsService.getSheetData().subscribe((data) => {
      this.chartData = data;
      this.chartDataArray = this.chartDataArray.concat(this.chartData);
    });
  }

  loadData() {
    this.createChart();
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
      data: this.selectedDataArray
      }

  }

  addToSelected(item: any) {
    this.selectedDataArray.push(item);
    console.log(this.selectedDataArray);
    this.createChart();
  }
}
