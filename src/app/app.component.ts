import { Component, OnInit } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { GoogleSheetsService } from './google-sheets.service';
import { CanvasJSAngularChartsModule } from '@canvasjs/angular-charts';
import { JsonPipe } from '@angular/common';

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

  public chart!: any;

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
      toolTip:{
        contentFormatter: function (e: any) {
          return "<strong>" + e.entries[0].dataSeries.legendText + "</strong> " +  e.entries[0].dataPoint.x.getFullYear();
        },
      },
      data: this.selectedDataArray
      }

  }

  addToSelected(item: any) {
    this.selectedDataArray.push(item);
    this.createChart();
  }

  findItem(item: any) {
    return this.selectedDataArray.find((x) => x.name === item.name);
  }
}
