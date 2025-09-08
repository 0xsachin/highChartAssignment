import { Component } from '@angular/core';
import { HighchartsChartModule } from 'highcharts-angular';
import * as Highcharts from 'highcharts';
import { Options } from 'highcharts';
@Component({
  selector: 'app-demo-two',
  imports: [HighchartsChartModule],
  templateUrl: './demo-two.html',
  styleUrl: './demo-two.css'
})
export class DemoTwo {

  highcharts = Highcharts;

  // ✅ Chart options with multiple yAxis and aligned subplots
  chartOptions: Options = {
    chart: {
     // zoomType: 'x',
      height: 600
    },
    title: {
      text: 'Diabetes Data Overview'
    },
    xAxis: {
      type: 'datetime',
      title: { text: 'Date/Time' }
    },
    yAxis: [
      {
        title: { text: 'ISIG' },
        height: '25%',
        lineWidth: 1
      },
      {
        title: { text: 'SG' },
        top: '30%',
        height: '25%',
        offset: 0,
        lineWidth: 1
      },
      {
        title: { text: 'TDD / Carbs' },
        top: '60%',
        height: '20%',
        offset: 0,
        lineWidth: 1
      },
      {
        title: { text: 'Auto Delivery' },
        top: '85%',
        height: '15%',
        offset: 0,
        lineWidth: 1
      }
    ],
    legend: {
      enabled: true
    },
    tooltip: {
      shared: true,
     // crosshairs: true
    },
    navigator: { enabled: true },
    rangeSelector: { enabled: false },

    series: [
      // ISIG (top panel)
      {
        name: 'ISIG',
        type: 'line',
        yAxis: 0,
        color: '#007bff',
        data: [
          [Date.UTC(2025, 7, 9, 10), 20],
          [Date.UTC(2025, 7, 10, 12), 40],
          [Date.UTC(2025, 7, 11, 15), 60],
          [Date.UTC(2025, 7, 12, 18), 50]
        ]
      },

      // SG (second panel)
      {
        name: 'SG',
        type: 'line',
        yAxis: 1,
        color: '#000',
        data: [
          [Date.UTC(2025, 7, 9, 10), 150],
          [Date.UTC(2025, 7, 10, 12), 220],
          [Date.UTC(2025, 7, 11, 15), 100],
          [Date.UTC(2025, 7, 12, 18), 250]
        ]
      },

      // TDD / Carbs (third panel)
      {
        name: 'TDD',
        type: 'column',
        yAxis: 2,
        color: '#8e44ad',
        data: [
          [Date.UTC(2025, 7, 9), 12],
          [Date.UTC(2025, 7, 10), 18],
          [Date.UTC(2025, 7, 11), 14],
          [Date.UTC(2025, 7, 12), 20]
        ]
      },
      {
        name: 'Carbs',
        type: 'column',
        yAxis: 2,
        color: '#f39c12',
        data: [
          [Date.UTC(2025, 7, 9), 10],
          [Date.UTC(2025, 7, 10), 16],
          [Date.UTC(2025, 7, 11), 12],
          [Date.UTC(2025, 7, 12), 14]
        ]
      },

      // Auto Delivery (fourth panel)
      {
        name: 'Auto Basal',
        type: 'line',
        dashStyle: 'Dash',
        yAxis: 3,
        color: '#27ae60',
        data: [
          [Date.UTC(2025, 7, 9), 0.1],
          [Date.UTC(2025, 7, 10), 0.15],
          [Date.UTC(2025, 7, 11), 0.05],
          [Date.UTC(2025, 7, 12), 0.2]
        ]
      },
      {
        name: 'Auto Correction',
        type: 'line',
        yAxis: 3,
        color: '#e74c3c',
        data: [
          [Date.UTC(2025, 7, 9), 0.05],
          [Date.UTC(2025, 7, 10), 0.1],
          [Date.UTC(2025, 7, 11), 0.07],
          [Date.UTC(2025, 7, 12), 0.15]
        ]
      }
    ]
  };
}
