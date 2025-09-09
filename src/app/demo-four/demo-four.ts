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

    // Get current UTC time and round down to the hour
const now = new Date();
const currentUtcHour = Date.UTC(
  now.getUTCFullYear(),
  now.getUTCMonth(),
  now.getUTCDate(),
  now.getUTCHours()
);

// Start 3 ticks (3 hours) before
const visibleMin = currentUtcHour - (3 * 3600 * 1000); // 3 hours back
const visibleMax = visibleMin + (6 * 3600 * 1000); // 6 hours forward = 7 ticks (every hour)

    // 3️⃣ Chart config
    this.chartOptions = {
      chart: {
        type: 'line',
        height: 400,
      //   scrollablePlotArea: {
      //     minWidth: 2400, // enough to show all 24 ticks clearly
      //     scrollPositionX: (visibleMin - minTime) / (maxTime - minTime),
      //   },
        scrollablePlotArea: {
    minWidth: 1000,  // decrease from 2400 or 1200
    scrollPositionX: 0
  },
        panning: {
          enabled: true,
          type: 'x'
        },
      },
      title: { text: 'Glucose (5-min interval)' },
      xAxis: [{
        tickInterval: 3600 * 1000, // 1 hour in milliseconds

        type: 'datetime',
//   min: visibleMin,
//   max: visibleMax,
//   tickAmount: 7,
  scrollbar: { enabled: false },
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
              if ([3, 6, 9, 12].includes(hour12)) {
                label += `<div style="font-size:10px">${ampm}</div>`;
              } else {
                label += `<div style="font-size:10px">&nbsp;</div>`;
              }
            } else {
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
