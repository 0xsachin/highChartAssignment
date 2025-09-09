import { Component } from '@angular/core';
import * as Highcharts from 'highcharts/highstock';
import HCData from 'highcharts/modules/data';
import { HighchartsChartModule } from 'highcharts-angular';
import HighchartsMore from 'highcharts/highcharts-more';
import HCExporting from 'highcharts/modules/exporting';
// import DraggablePoints from 'highcharts/modules/draggable-points';
// DraggablePoints(Highcharts);
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

    // Calculate the timestamp for 2 PM UTC
    // const givenStartData = Date.UTC(2025, 8, 9, 15, 0); // from where we want to start the graph
    const now = new Date();
    const givenStartData = Date.UTC(
      now.getFullYear(),
      now.getMonth(),
      now.getDate(),
      now.getHours(),
      0, 0
    ); // current hour, UTC

    const givenEndData = givenStartData // End of actual data (18:00 UTC)


    // Show 3 hours *backward* from givenData
    const visibleMin = givenStartData - (3 * 3600 * 1000); // 08:00 UTC
    const visibleMax = givenEndData + (4 * 3600 * 1000); // 08:00 UTC


    // 3️⃣ Chart config
    this.chartOptions = {
      chart: {
        type: 'line',
        height: 400,
        panning: {
          enabled: true,
          type: 'x',
        },
        panKey: 'none' as any, // 👈 avoids TypeScript error
        // panKey: undefined // ✅ Drag with finger or mouse directly
        zooming: {
          type: 'x' // ✅ Enables panning & pinch zoom
        },

      },
      title: { 
        text: 'show start end within given range when page load',
        style: {
          fontSize: '10px' // or any size you prefer
        } 
      },
      exporting: {    // to hide context menu
        enabled: false
      },
      tooltip: {
        followTouchMove: false // Crucial: allows one-finger panning on mobile
      },
      xAxis: [{
        tickInterval: 3600 * 1000, // 1 hour in milliseconds
        type: 'datetime',
        min: visibleMin,  
        max: visibleMax,
        scrollbar: { enabled: false }, // Enable scrollbar
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
        opposite: true,
        lineWidth: 1,
        gridLineWidth: 1,
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
        marker: { enabled: false },
        enableMouseTracking: true, // ✅ Prevent tooltips/hover on points
        // dragDrop: {
        //     draggableX: true, // Enable dragging on the X-axis
        //     draggableY: true, // Enable dragging on the Y-axis
        // }

      }]
    };
  }
}
