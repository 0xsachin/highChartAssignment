import { Component } from '@angular/core';
import * as Highcharts from 'highcharts/highstock';
import HCData from 'highcharts/modules/data';
import { HighchartsChartModule } from 'highcharts-angular';
import HighchartsMore from 'highcharts/highcharts-more';
import HCExporting from 'highcharts/modules/exporting';

HighchartsMore(Highcharts);
HCExporting(Highcharts);

@Component({
  selector: 'app-demo-four',
  standalone: true,
  imports: [HighchartsChartModule],
  templateUrl: './demo-four.html',
  styleUrl: './demo-four.css'
})
export class DemoFour {
  Highcharts: typeof Highcharts = Highcharts;
  chartOptions: Partial<Highcharts.Options>;

  constructor() {
    // 1️⃣ Generate 288 points (5 min interval over 24 hours)
    const startDate = Date.UTC(2025, 8, 9, 0, 0); // 00:00 UTC
    const sgVal: { sg: number; ts: number }[] = [];

    for (let i = 0; i < 288; i++) {
      const tsSec = Math.floor((startDate / 1000) + (i * 300)); // every 5 min
      sgVal.push({
        sg: Math.random() * 10 + 3, // random glucose between 3–13
        ts: tsSec
      });
    }

    // 2️⃣ Convert to Highcharts format
    const glucoseData: [number, number][] = sgVal.map(d => [
      d.ts * 1000, // seconds → milliseconds
      d.sg
    ]);

    const minTime = Date.UTC(2025, 8, 9, 0, 0);   // 00:00
    const maxTime = Date.UTC(2025, 8, 9, 23, 59); // 23:59

    // Calculate the timestamp for 2 PM UTC
    const givenData = Date.UTC(2025, 8, 9, 11, 0); // from where we want to start the graph

    // Calculate the visible range (you can set this as per your needs)
    const visibleMin = givenData;
    const visibleMax = givenData + (6 * 3600 * 1000); // Show 6 hours forward (until 8 PM)

    // 3️⃣ Chart config
    this.chartOptions = {
      chart: {
        type: 'line',
        height: 400,
        scrollablePlotArea: {
          minWidth: window.innerWidth < 768 ? 600 : 1000,  // Adjust based on screen size
          scrollPositionX: 0  // This makes sure the scroll starts from the left
        },
        panning: {
          enabled: true,
          type: 'x'
        }
      },
      title: { text: 'Glucose (5-min interval)' },
      xAxis: [{
        tickInterval: 3600 * 1000, // 1 hour in milliseconds
        type: 'datetime',
        min: visibleMin,  // Start the graph from 2 PM
        scrollbar: { enabled: true }, // Enable scrollbar
        startOnTick: false,
        endOnTick: false,
        labels: {
          useHTML: true,
          formatter: function (): any {
            if (!this.value) return '';
            const date = new Date(this.value);
            const hour = date.getUTCHours();
            const ampm = hour >= 12 ? 'PM' : 'AM';
            const hour12 = hour % 12 === 0 ? 12 : hour % 12;

            let label = `<div style="text-align:center; line-height:1.1">
                           <div>${hour12}</div>`;

            if (window.innerWidth < 768) {
              // Mobile-specific label logic
              if ([3, 6, 9, 12].includes(hour12)) {
                label += `<div style="font-size:10px">${ampm}</div>`;
              } else {
                label += `<div style="font-size:10px">&nbsp;</div>`;
              }
            } else {
              // Desktop-specific label logic
              label += `<div style="font-size:10px">${ampm}</div>`;
            }

            return label + '</div>';
          }
        }
      }],
      yAxis: {
        min: 2.2,
        max: 22.2,
        title: { text: 'mmol/l' },
        plotBands: [{
          from: 3.9,
          to: 10,
          color: 'rgba(0, 128, 0, 0.1)'
        }]
      },
      credits: { enabled: false },
      legend: { enabled: false },
      series: [{
        type: 'line',
        name: 'Glucose',
        data: glucoseData,
        lineWidth: 2,
        color: '#000000',
        marker: { enabled: false }
      }]
    };
  }
}
