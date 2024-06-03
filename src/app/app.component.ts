import { Component, OnInit } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { GoogleSheetsService } from './google-sheets.service';
import { CanvasJSAngularChartsModule } from '@canvasjs/angular-charts';
import { JsonPipe } from '@angular/common';
import { FormControl, ReactiveFormsModule } from '@angular/forms';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    RouterOutlet,
    CanvasJSAngularChartsModule,
    JsonPipe,
    ReactiveFormsModule,
  ],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss',
})
export class AppComponent implements OnInit {
  public chartOptions: any;

  public chartDataArray!: any[];
  public headers: any;
  title = 'phrases';

  public chart: any;

  public selectedDataArray!: any[];

  public searchTerm = new FormControl('');

  constructor(public googleSheetsService: GoogleSheetsService) {
    this.chartDataArray = [];
    this.selectedDataArray = [];
  }

  ngOnInit() {
    this.googleSheetsService.getSheetData().subscribe((data) => {
      this.chartDataArray = this.chartDataArray.concat(data);
    });

    this.createChart();
  }

  createChart() {
    // Docs for this dumb chart
    // https://canvasjs.com/angular-charts/line-chart-with-date-time-axis/
    this.chartOptions = {
      title: {
        text: 'Phrases',
      },
      axisX: {
        valueFormatString: 'YYYY',
        intervalType: 'year',
      },
      toolTip: {
        contentFormatter: function (e: any) {
          return (
            '<strong>' +
            e.entries[0].dataSeries.legendText +
            '</strong> ' +
            e.entries[0].dataPoint.x.getFullYear() + ',<i> ' + e.entries[0].dataPoint.y + '</i>'
          );
        },
      },
      data: this.selectedDataArray,
    };

    // TODO: Add default selections to the chart
    // this.addDefaults();
    // console.log(this.selectedDataArray);
  }

  addToSelected(item: any) {
    this.selectedDataArray.push(item);
    this.chart.render();
  }

  removeFromSelected(item: any) {
    this.selectedDataArray = this.selectedDataArray.filter(
      (x: any) => x.name !== item.name
    );
    this.chartOptions.data = this.selectedDataArray;
    this.chart.render();
  }

  findItem(item: any) {
    if (!item || !item.name) {
      console.error('Invalid item provided:', item);
      return undefined;
    }

    return this.selectedDataArray.find((x: any) => x && x.name === item.name);
  }

  addDefaults() {
    const default1 = 'COVENANT PEOPLE';
    const default2 = 'INVITE YOU';

    let defaultList = [];
    defaultList.push(default1);
    defaultList.push(default2);

    defaultList.forEach((defaultItem) => {
      this.selectedDataArray.push(
        this.chartDataArray.find((x) => x.name === defaultItem)
      );
    });
  }

  getChartInstance(chart: object) {
    this.chart = chart;
    this.updateData();
  }

  updateData() {
    this.chart.data = this.selectedDataArray;
  }

  filteredChartDataArray() {
    if (!this.searchTerm) {
      return this.chartDataArray;
    }
    return this.chartDataArray.filter((item: any) =>
      item.name.toLowerCase().includes(this.searchTerm.value?.toLowerCase())
    );
  }
}
