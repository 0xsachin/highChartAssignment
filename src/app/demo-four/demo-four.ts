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
  windowWidth:any = window.innerWidth;

  constructor() {
//////below block give me random sg value everty time after run prog for 288 object(1 obj per 5 min)//////////

    // 1️⃣ Generate 288 points (5 min interval over 24 hours)

    // const startDate = Date.UTC(2025, 8, 11, 0, 0); // 00:00 UTC
    // const endDate = Date.UTC(2025, 8, 11, 23, 55); // 23:55 UTC

    // for current date and hour
    // const nowDate = new Date();
    // const startDate:any = Date.UTC(
    //   nowDate.getFullYear(),
    //   nowDate.getMonth(),
    //   nowDate.getDate(),
    //   0,
    //   0, 
    //   0
    // ); // current hour, UTC

    // const endDate:any = Date.UTC(
    //   nowDate.getFullYear(),
    //   nowDate.getMonth(),
    //   nowDate.getDate(),
    //   23,
    //   55, 
    //   0
    // ); // current hour, UTC

    // const sgVal: { sg: number; ts: number }[] = [];

    // for (let i = 0; i < 288; i++) {
    //   const tsSec = startDate + i * 300000; // add 5 minutes in milliseconds
    //   sgVal.push({
    //     sg: Math.random() * 10 + 3,
    //     ts: tsSec
    //   });
    // }

    // // 2️⃣ Convert to Highcharts format
    // const glucoseData: [number, number][] = sgVal.map(d => [
    //   d.ts , // seconds → milliseconds
    //   d.sg
    // ]);
    // console.log("glucoseData-->",glucoseData)
/////////////////////////////////////////////////////////////////////////////////////////////////////    
//////below block give me same sg value everty time after run prog for 24 object(1 obj per hrs)//////////
    
    const startDate = Date.UTC(2025, 8, 15, 0, 0); // for fix date
    const endDate = Date.UTC(2025, 8, 15, 23, 55); // 23:55 UTC

    // for current date and hour
    // const nowDate = new Date();
    // const startDate:any = Date.UTC(
    //   nowDate.getFullYear(),
    //   nowDate.getMonth(),
    //   nowDate.getDate(),
    //   0,
    //   0, 
    //   0
    // ); // current hour, UTC

    // const endDate:any = Date.UTC(
    //   nowDate.getFullYear(),
    //   nowDate.getMonth(),
    //   nowDate.getDate(),
    //   23,
    //   55, 
    //   0
    // ); // current hour, UTC

    const sgVal: { sg: number; ts: number }[] = [];

    for (let i = 0; i < 24; i++) {
      // this method convert local time zone to UTC time zone
      // const tsMs = this.returnConvertedDateTimeZone(startDate + i * 3600000).getTime(); // every 1 hour

      const tsMs = startDate + i * 3600000; // every 1 hour

      // deterministic glucose value: sine wave oscillation between 4 and 12
      const sg = 8 + 4 * Math.sin(i * (Math.PI / 12)); 

      sgVal.push({
        sg: parseFloat(sg.toFixed(2)), // keep 2 decimals
        ts: tsMs
      });
    }

    // Convert to Highcharts format
    const glucoseData: [number, number][] = sgVal.map(d => [
      d.ts, // timestamp in ms
      d.sg
    ]);

///////////////////////////////////////////////////////////////////////////////////////////////


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
    var visibleMax = givenEndData + (4 * 3600 * 1000); // 08:00 UTC
    console.log("visibleMax-->",visibleMax);
    console.log("endDate-->",endDate);
    // if(endDate < visibleMax){
    //   visibleMax = givenEndData;
    // }
    // 3️⃣ Chart config
    this.chartOptions = {
      chart: {
        type: 'line',
        height: 400,
        panning: {
          enabled: true,
          type: (this.windowWidth < 760) ? 'x' : undefined,
        },
        panKey: 'none' as any, // 👈 avoids TypeScript error
        // panKey: undefined // ✅ Drag with finger or mouse directly
        zooming: {
          type: (this.windowWidth < 760) ? 'x' : undefined, // ✅ Enables panning & pinch zoom
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

  returnConvertedDateTimeZone(utcDate:any){
    //if("UTC"){
      const localDate = new Date(utcDate);
      if (!(localDate instanceof Date)) {
        throw new Error("Invalid date. Please provide a valid Date object.");
      }
 
      // Get the current time in New York time zone using Intl.DateTimeFormat
      // const localOffset = localDate.getTimezoneOffset(); // Offset for local time zone in minutes
      const iDateObj = localDate.toLocaleString("en-US", { timeZone: "UTC" });
      const dateTimeZone = new Date(iDateObj);
      return dateTimeZone;
    // }else{
    //   return new Date(utcDate);
    // }
  }
}
