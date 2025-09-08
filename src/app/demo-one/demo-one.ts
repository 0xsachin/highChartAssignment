import { Component } from '@angular/core';
import { HighchartsChartModule } from 'highcharts-angular';
import * as Highcharts from 'highcharts';
import { Options } from 'highcharts';

@Component({
  selector: 'app-demo-one',
  imports: [HighchartsChartModule],
  templateUrl: './demo-one.html',
  styleUrl: './demo-one.css'
})
export class DemoOne {
  highcharts = Highcharts;
  chartOptions: Options = {
    chart: {
      // zoomType: 'x'
    },
    title: {
      text: 'SG, TDD, ISIG Over Time'
    },
    xAxis: {
      type: 'datetime',
      title: {
        text: 'Time'
      }
    },
    yAxis: [
      {
        title: {
          text: 'ISIG'
        }
      },
      {
        title: {
          text: 'SG'
        },
        opposite: true
      }
    ],
    tooltip: {
      // shared: true
    },
    navigator: {
      enabled: true, // ⬅️ Enables the zoom bar
      height: 30,
      series: {
        type: 'line'
      }
    },
    rangeSelector: {
      enabled: true // ⬅️ Adds the date range buttons
    },
    series: [
      {
        name: 'SG',
        type: 'line',
        data: [
          [Date.UTC(2025, 8, 1, 10), 120],
          [Date.UTC(2025, 8, 1, 11), 130]
        ]
      },
      {
        name: 'TDD',
        type: 'column',
        yAxis: 1,
        data: [
          [Date.UTC(2025, 8, 1, 10), 18],
          [Date.UTC(2025, 8, 1, 11), 20]
        ]
      },
      {
        name: 'ISIG',
        type: 'line',
        dashStyle: 'Dash',
        data: [
          [Date.UTC(2025, 8, 1, 10), 8],
          [Date.UTC(2025, 8, 1, 11), 9]
        ]
      }
    ]
  };
}
