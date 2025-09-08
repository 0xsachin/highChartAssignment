import { Component } from '@angular/core';
import * as Highcharts from 'highcharts/highstock';
import HCExporting from 'highcharts/modules/exporting';
import HCData from 'highcharts/modules/data';
import { HighchartsChartModule } from 'highcharts-angular';
import HCMore from 'highcharts/highcharts-more';
import { CommonModule } from '@angular/common';

// HCExporting(Highcharts);
// HCData(Highcharts);
HCMore(Highcharts);       //  Enables arearange, columnrange, etc.

// build time axis for ~14 days
const start = Date.UTC(2025, 3, 9); // Apr 9 (month is 0‑based)
const points = 14 * 48; // 48 half‑hours per day
function rand(base = 120, spread = 80) { return base + (Math.random() - 0.5) * spread * 2; }

function buildLine(base: number, spread: number) {
  const out: [number, number][] = [];
  for (let i = 0; i < points; i++) {
    out.push([start + i * 30 * 60 * 1000, Math.max(0, rand(base, spread))]);
  }
  return out;
}

function day(ms = 24 * 3600 * 1000) { return ms; }

@Component({
  selector: 'app-demo-three',
  imports: [CommonModule,HighchartsChartModule],
  templateUrl: './demo-three.html',
  styleUrl: './demo-three.css'
})
export class DemoThree {
  

  Highcharts: typeof Highcharts = Highcharts;
  legendArr1:any = [  
    {svg:'',title:'Cal factor'},
    {svg:'',title:'ISIG'},
    {svg:'',title:'ARD cal BG'},
    {svg:'',title:'ARD meter BG'},
    {svg:'',title:'Sensor warm up'},
    {svg:'',title:'Noise (Alert)'},
  ]
  legendArr2:any = [  
    {svg:'',title:'SG'},
    {svg:'',title:'BG'},
    {svg:'',title:'Calibration'},
    {svg:'',title:'Calibration not accepted'},
    {svg:'',title:'Meter BG now alert'},
    {svg:'',title:'Check BG alert'},
    {svg:'',title:'Sensor start'},
    {svg:'',title:'Sensor end'},
    {svg:'',title:'Sensor updating'},
    {svg:'',title:'Sensor expired'},
    {svg:'',title:'All alarms'},
    {svg:'',title:'Low predictive alert'},
    {svg:'',title:'Suspend before low alert'},
    {svg:'',title:'Low alert'},
    {svg:'',title:'High alert'},
    {svg:'',title:'No delivery alert'},
  ];
  legendArr3:any = [
    {svg:'',title:'TDD'},
    {svg:'',title:'Carbs'},
    {svg:'',title:'Bolus'},
    {svg:'',title:'Food bolus'},
    {svg:'',title:'Correction bolus'},
    {svg:'',title:'Square bolus'},
    {svg:'',title:'Basal'},
    {svg:'',title:'Bolus override'},
   ];
  legendArr4:any = [
    {svg:'',title:'SmartGuard exit'},
    {svg:'',title:'Temp target'},
    {svg:'',title:'Auto basal'},
    {svg:'',title:'Auto correction'},
  ];

  charts = Highcharts.Chart
   chartOptions: Highcharts.Options = {
    chart: {
            //zoomType: 'x' // Or 'y' or 'xy'
    },
    title: {
      text: 'CGM Overview',
      style: {
        fontSize: '10px' // or any size you prefer
      }
    },
    exporting: {    // to hide context menu
        enabled: false
    },
    xAxis: {
      type: 'datetime',
      crosshair: { width: 1, color: '#999' },
      gridLineWidth: 0.5, // Add grid lines
      gridLineColor: '#e6e6e6', // Light gray color for grid lines
      showFirstLabel: true,
      showLastLabel: true,
      tickInterval: day(),
      labels: { format: '{value:%b %e}' },
      ordinal: false,
      min: start,
      alternateGridColor: 'rgba(128, 128, 128, 0.1)',  // al

      max: start + 13 * day(),
      // plotBands: (function () {   //to set background color for alternate days
      //   const bands = [];
      //   const colors = ['rgba(255, 255, 255, 0.3)', 'rgba(128, 128, 128, 0.3)']; // alternating colors
      //   for (let i = 0; i < 20; i++) {
      //       bands.push({
      //           from: start + (i) * day() ,
      //           to: start + (i+1) * day(),
      //           color: colors[i % colors.length]
      //       });
      //   }
      //   console.log("bands",bands);
      //   return bands;
      // })()
    },
    legend: {
      enabled: false,
      align: 'right',
      verticalAlign: 'top',
      layout: 'vertical',
      itemStyle: { fontSize: '12px' },
      useHTML: true, // allow custom HTML
      labelFormatter: function () {
        return `<span style="display:inline-flex;align-items:center;">
          ${this.name}
        </span>`;
      }
    },
    
    navigator: {    // zoom nevigator
      enabled: true, // or false to disable the navigator entirely
      height: 20,
       series: {    // This hides the chart inside the navigator
        type: 'line',
        data: [],
        enableMouseTracking: false
      }
    },
    scrollbar: { enabled: true },
    credits: { enabled: false },
    yAxis: [
      { // ISIG
        title: { text: 'ISIG' },
        top: '0%',
        height: '20%',
        offset: 0,
        min: 0,
        max: 100,
      },

     {  //SG
        
        title: { text: 'Sensor Glucose (SG)' },
        top: '25%',
        height: '20%',
        offset: 0,
        // max: 350,
        // softMax: 350,
        endOnTick: false,
        plotBands: [{
          from: 100,
          to: 160,
          color: '#eaf5dc'
        }],
        plotLines: [{
          value: 100,
          color: '#000',
          width: 1
        }, {
          value: 160,
          color: '#000',
          width: 1
        }]
      },

      { // TDD
        title: { text: 'TDD + Carbs' },
        top: '50%',
        height: '20%',
        offset: 0,
      },
      { // Auto delivery
        title: { text: 'Auto Delivery' },
        top: '75%',
        height: '20%',
        offset: 0
      }
    ],
    tooltip: {
          shared: false,
          useHTML: true,
          formatter: function () {
            const x = (this as any).x as number;
            const date = Highcharts.dateFormat('%A, %b %e, %H:%M', x);
            const p = this.point as Highcharts.Point & { series: Highcharts.Series };
            return `<b>${date}</b><br/>` +
            `<span style="opacity:0.7">${p.series.name}:</span> <b>${Highcharts.numberFormat(p.y as number, 2)}</b>`;
          }
    },
    plotOptions: {
      series: {
        dataGrouping: { enabled: false },
        marker: { enabled: false },
        states: { hover: { enabled: true } }
      },
      column: { pointPadding: 0, groupPadding: 0},
      areaspline: { fillOpacity: 0.15 },
      arearange: { enableMouseTracking: false },
      scatter: {
                marker: {
                    radius: 2.5,
                    symbol: 'circle',
                    states: {
                        hover: {
                            enabled: true,
                            lineColor: 'rgb(100,100,100)'
                        }
                    }
                },
                states: {
                    hover: {
                        // marker: {
                        //     enabled: false
                        // }
                    }
                },
                jitter: {
                    x: 0.005
                }
            }
    },
    series: [

      {
        type: 'line',
        name: 'ISIG',
        yAxis: 0,
        step: 'left', // due to pump data being stepwise
        data: this.generateISIGData(),
        tooltip: { valueDecimals: 2 },
        
        marker: {},
      },

      {
        type: 'scatter',
        name: 'Sensor warn up',
        yAxis: 0,
        data: [{
          x: Date.UTC(2025, 3, 12, 14, 30),
          y: 30,
          marker: {
            enabled: true, // ✅ Ensures the marker is always visible
            radius: 2,
            fillColor: 'blue',
            lineColor: 'blue',
            lineWidth: 1,
            symbol: 'circle'
          }
        }],
        tooltip: {
          pointFormat: 'Highlighted Point<br><b>{point.x:%e %b, %H:%M}</b><br>Value: <b>{point.y}</b>'
        },
      },

      {
        type: 'scatter',
        name: 'Sensor warn up',
        yAxis: 0,
        data: [{
          x: Date.UTC(2025, 3, 15, 14, 30),
          y: 30,
          marker: {
            width: 16,
            height: 16,
            symbol: 'url(/assets/icons/custom-marker.svg)', // 📁 Place it in your assets folder
          }
        }],
        tooltip: {
          pointFormat: 'Highlighted Point<br><b>{point.x:%e %b, %H:%M}</b><br>Value: <b>{point.y}</b>'
        },
      },


      {
        type: 'scatter',
        name: 'Noise',
        yAxis: 0,
        data: [{
          x: Date.UTC(2025, 3, 16, 14, 30),
          y: 70,
          marker: {
            enabled: true, // ✅ Ensures the marker is always visible
            radius: 3,
            fillColor: 'orange',
            lineColor: 'orange',
            lineWidth: 1,
            symbol: 'circle'
          }
        }],
        tooltip: {
          pointFormat: 'Highlighted Point<br><b>{point.x:%e %b, %H:%M}</b><br>Value: <b>{point.y}</b>'
        },
      },

      {
        type: 'scatter',
        name: 'ARD cal BG',
        yAxis: 0,
        data: [{
          x: Date.UTC(2025, 3, 18, 14, 30),
          y: 80,
          marker: {
            enabled: true, // ✅ Ensures the marker is always visible
            radius: 3,
            fillColor: 'red',
            lineColor: 'red',
            lineWidth: 1,
            symbol: 'diamond'
          }
        }],
        tooltip: {
          pointFormat: 'Highlighted Point<br><b>{point.x:%e %b, %H:%M}</b><br>Value: <b>{point.y}</b>'
        },
      },
      
      ///////////////////////////////////////////2 nd ////////////////////////////////////////////////
      {
        type: 'line',
        name: 'SG',
        yAxis: 1,
        data: this.generateSGData(),
        color: '#111',
        lineWidth: 1,
        marker: {

        }
      },
      {
        type: 'scatter',
        name: 'BG',
        yAxis: 1,
        data: [{
          x: Date.UTC(2025, 3, 12, 14, 30),
          y: 270,
          marker: {
            enabled: true, // ✅ Ensures the marker is always visible
            radius: 3,
            fillColor: 'white',
            lineColor: 'red',
            lineWidth: 1,
            symbol: 'diamond',
          }
        }],
        tooltip: {
          pointFormat: 'Highlighted Point<br><b>{point.x:%e %b, %H:%M}</b><br>Value: <b>{point.y}</b>'
        },
      },
       {
        type: 'scatter',
        name: 'Sensor updating',
        yAxis: 1,
        data: [{
          x: Date.UTC(2025, 3, 15, 14, 30),
          y: 270,
          marker: {
            enabled: true, // ✅ Ensures the marker is always visible
            radius: 3,
            fillColor: 'blue',
            lineColor: 'blue',
            lineWidth: 1,
            symbol: 'triangle'
          }
        }],
        tooltip: {
          pointFormat: 'Highlighted Point<br><b>{point.x:%e %b, %H:%M}</b><br>Value: <b>{point.y}</b>'
        },
      },

      // Left vertical green line
      {
        type: 'line',
        yAxis: 1,
        data: [
          { x: Date.UTC(2025, 3, 11, 14, 0), y: 0 },
          { x: Date.UTC(2025, 3, 11, 14, 0), y: 300 }
        ],
        color: '#8ed046',
        lineWidth: 5,
     //   dashStyle: 'ShortDot',
        marker: { enabled: false },
        enableMouseTracking: false,
        showInLegend: false
      },

      // righ vertical red line
      {
        type: 'line',
        yAxis: 1,
        data: [
          { x: Date.UTC(2025, 3, 13, 15, 45), y: 0 },
          { x: Date.UTC(2025, 3, 13, 15, 45), y: 300 }
        ],
        color: 'red',
        lineWidth: 5,
    //    dashStyle: 'ShortDot',
        marker: { enabled: false },
        enableMouseTracking: false,
        showInLegend: false
      },

      // Left vertical green line
      {
        type: 'line',
        yAxis: 1,
        data: [
          { x: Date.UTC(2025, 3, 16, 14, 0), y: 0 },
          { x: Date.UTC(2025, 3, 16, 14, 0), y: 300 }
        ],
        color: '#8ed046',
        lineWidth: 5,
     //   dashStyle: 'ShortDot',
        marker: { enabled: false },
        enableMouseTracking: false,
        showInLegend: false
      },

      // righ vertical red line
      {
        type: 'line',
        yAxis: 1,
        data: [
          { x: Date.UTC(2025, 3, 16, 16, 30), y: 0 },
          { x: Date.UTC(2025, 3, 16, 16, 30), y: 300 }
        ],
        color: 'red',
        lineWidth: 5,
    //    dashStyle: 'ShortDot',
        marker: { enabled: false },
        enableMouseTracking: false,
        showInLegend: false
      },
      /////////////////////////////////// 3nd /////////////////////////////////////////////////////////////
    
      {
        type: 'column',
        name: 'food bolus',
        data: this.generateCarbsData(),
        yAxis: 2,
        color: '#ac27f7',
        pointRange: day(),
        pointPadding: 1,
        groupPadding: 1,
        borderWidth: 1,
        maxPointWidth:5,
        borderRadius:0
      },
      {
        type: 'column',
        name: 'Square bolus',
        data: this.generateCarbsData2(),
        yAxis: 2,
        color: '#8d8df3',
        pointRange: day(),
        pointPadding: 1,
        groupPadding: 1,
        borderWidth: 1,
        maxPointWidth:5,
        borderRadius:0
      },
      {
        type: 'column',
        name: 'Corrections bolus',
        data: this.generateCarbsData3(),
        yAxis: 2,
        color: 'black',
        pointRange: day(),
        pointPadding: 1,
        groupPadding: 1,
        borderWidth: 1,
        maxPointWidth:5,
        borderRadius:0
      },
      /////////////////////////////////////// 4th /////////////////////////////////////////////////////////
      {
        type: 'line',
        name: 'Auto Basal',
        yAxis: 3,
        step: 'left', // due to pump data being stepwise
        data: this.generateISIGData(),
        tooltip: { valueDecimals: 2 },
        dashStyle: 'Dash',
        color: '#b8d99e'
      },
      {
        type: 'column',
        name: 'food bolus',
        data: this.generateCarbsData(),
        yAxis: 3,
        color: '#1b1beb',
        pointRange: day(),
        pointPadding: 1,
        groupPadding: 1,
        borderWidth: 1,
        maxPointWidth:5,
        borderRadius:0
      },

      // Left dotted vertical line
      {
        type: 'line',
        yAxis: 3,
        data: [
          { x: Date.UTC(2025, 3, 16, 14, 30), y: 0 },
          { x: Date.UTC(2025, 3, 16, 14, 30), y: 100 }
        ],
        color: '#b0b0b0',
        lineWidth: 2,
        dashStyle: 'ShortDot',
        marker: { enabled: false },
        enableMouseTracking: false,
        showInLegend: false
      },

      // Right dotted vertical line
      {
        type: 'line',
        yAxis: 3,
        data: [
          { x: Date.UTC(2025, 3, 17, 1, 30), y: 0 },
          { x: Date.UTC(2025, 3, 17, 1, 30), y: 100 }
        ],
        color: '#b0b0b0',
        lineWidth: 2,
        dashStyle: 'ShortDot',
        marker: { enabled: false },
        enableMouseTracking: false,
        showInLegend: false
      },

      {
        type: 'arearange',
        name: 'Highlight Region',
        yAxis: 3,
        data: [
          {
            x: Date.UTC(2025, 3, 16, 14, 30),
            low: 0,
            high: 100
          },
          {
            x: Date.UTC(2025, 3, 17, 1, 30),
            low: 0,
            high: 100
          }
        ],
        color: '#f4f4f4', // Highlight color
        lineWidth: 2,
        enableMouseTracking: false,
        showInLegend: false,
        marker: { enabled: false },
        //fillOpacity: 0.8
      },
      
    ]
  };

  generateISIGData(): [number, number][] {
    return [
      [Date.UTC(2025, 3, 9), 30],
      [Date.UTC(2025, 3, 10), 40],
      [Date.UTC(2025, 3, 11), 50],
      [Date.UTC(2025, 3, 12), 60],
      [Date.UTC(2025, 3, 13), 55],
      [Date.UTC(2025, 3, 14), 70],
      [Date.UTC(2025, 3, 15), 80],
      [Date.UTC(2025, 3, 16), 80],
      [Date.UTC(2025, 3, 17), 60],
      [Date.UTC(2025, 3, 18), 60],
      [Date.UTC(2025, 3, 19), 70],
      [Date.UTC(2025, 3, 20), 80],
      [Date.UTC(2025, 3, 21), 50],
      [Date.UTC(2025, 3, 22), 50],
    ];
    // const isig = buildLine(40, 20).map(([t, v]) => [t, Math.round(v)] as [number, number]);
    // return isig;
  }

  generateSGData(): [number, number][] {
    // return [
    //   [Date.UTC(2025, 3, 9), 180],
    //   [Date.UTC(2025, 3, 10), 220],
    //   [Date.UTC(2025, 3, 11), 160],
    //   [Date.UTC(2025, 3, 12), 140],
    //   [Date.UTC(2025, 3, 13), 200],
    //   [Date.UTC(2025, 3, 14), 240],
    //   [Date.UTC(2025, 3, 15), 180],
    // ];
    const sg = buildLine(160, 90);
    return sg;
  }

  // generateCarbsData(): [number, number][] {
  //   // return [
  //   //   [Date.UTC(2025, 3, 9), 10],
  //   //   [Date.UTC(2025, 3, 10), 15],
  //   //   [Date.UTC(2025, 3, 11), 12],
  //   // ];

  //   function day(ms = 24 * 3600 * 1000) { return ms; }
  //   const carbs = Array.from({ length: 114 }, (_, d) => [start + d *30 * 60 * 1000 , Math.round(10 + Math.random() * 15)] as [number, number]);
  //   return carbs;
  // }

  generateCarbsData(): [number, number][] {
    const start = Date.UTC(2025, 3, 9); // April 9, 2025
    const pointsPerDay = 10;
    const msPerDay = 24 * 3600 * 1000;
    const msPerPoint = msPerDay / pointsPerDay; // 6 hours

    const daysCount = 14; // total number of days to generate data for
    const totalPoints = daysCount * pointsPerDay;

    const carbs = Array.from({ length: totalPoints }, (_, i) => {
      const timestamp = start + i * msPerPoint;
      const value = Math.round(10 + Math.random() * 15); // random carbs between 10 and 25
      return [timestamp, value] as [number, number];
    });

    return carbs;
  }

  generateCarbsData2(): [number, number][] {
    return [
      
      [Date.UTC(2025, 3, 15), 50],
    ];
  }

  generateCarbsData3(): [number, number][] {
    return [
      [Date.UTC(2025, 3, 12), 10],
      [Date.UTC(2025, 3, 13), 15],
      [Date.UTC(2025, 3, 14), 12],
    ];
  }

  generateAutoBasalData(): [number, number][] {
    return [
      [Date.UTC(2025, 3, 9), 0.1],
      [Date.UTC(2025, 3, 10), 0.12],
      [Date.UTC(2025, 3, 11), 0.13],
    ];
  }

  generateSensorStartData(): [number, number][] {
    return [
      [Date.UTC(2025, 3, 9,23,59), 250],
      [Date.UTC(2025, 3, 15,1,4), 250],
      [Date.UTC(2025, 3, 20), 250],
    ];
  }

  generateSensorEndData(): [number, number][] {
    return [
      [Date.UTC(2025, 3, 10), 250],
      [Date.UTC(2025, 3, 15,1,4), 250],
      [Date.UTC(2025, 3, 21), 250],
    ];  
  }
}
