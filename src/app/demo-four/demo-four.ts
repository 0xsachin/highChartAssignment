import { Component } from '@angular/core';
import * as Highcharts from 'highcharts/highstock';
import HCExporting from 'highcharts/modules/exporting';
import HCData from 'highcharts/modules/data';
import { HighchartsChartModule } from 'highcharts-angular';

HCExporting(Highcharts);
HCData(Highcharts);

// --- Helper: generate mock series data that "looks" like the screenshot ---
function day(ms = 24 * 3600 * 1000) { return ms; }
function rand(base = 120, spread = 80) { return base + (Math.random() - 0.5) * spread * 2; }


// build time axis for ~14 days
const start = Date.UTC(2025, 3, 9); // Apr 9 (month is 0‑based)
const points = 14 * 48; // 48 half‑hours per day


function buildLine(base: number, spread: number) {
  const out: [number, number][] = [];
  for (let i = 0; i < points; i++) {
    out.push([start + i * 30 * 60 * 1000, Math.max(0, rand(base, spread))]);
  }
  return out;
}


// Pane 1: ISIG step‑line style
const isig = buildLine(40, 20).map(([t, v]) => [t, Math.round(v)] as [number, number]);


// Pane 2: SG (glucose) w/ noise and events
const sg = buildLine(160, 90);


// Events (scatter) on pane 2
const eventTimes = [3, 35, 90, 160, 180, 240, 350, 420, 520, 600, 620].map(i => start + i * 30 * 60 * 1000);


// Pane 3: Carbs + Bolus (stacked columns)
const carbs = Array.from({ length: 14 }, (_, d) => [start + d * day(), Math.round(10 + Math.random() * 30)] as [number, number]);
const bolusFood = buildLine(0, 0).filter((_, i) => i % 16 === 0).map(([t]) => [t, Math.round(Math.random() * 3)] as [number, number]);
const bolusCorrection = buildLine(0, 0).filter((_, i) => i % 22 === 0).map(([t]) => [t, Math.round(Math.random() * 3)] as [number, number]);
const basal = buildLine(0.05, 0.03).filter((_, i) => i % 2 === 0);


// Pane 4: Auto delivery (step)
const autoDelivery = buildLine(0.1, 0.08).map(([t, v]) => [t, Math.max(0, v)] as [number, number]);
const tempTarget = Array.from({ length: 6 }, (_, k) => {
const s = start + (k * 2 + 2) * day();
return [s, s + 12 * 3600 * 1000] as [number, number];
});
@Component({
  selector: 'app-demo-four',
  imports: [HighchartsChartModule],
  templateUrl: './demo-four.html',
  styleUrl: './demo-four.css'
})
export class DemoFour {
  Highcharts: typeof Highcharts = Highcharts;
  constructorType: 'stockChart' = 'stockChart';
  chartOptions: Highcharts.Options = {
    chart: {
      backgroundColor: '#fff',
      spacingLeft: 60,
      spacingRight: 240, // space for right legend
    },
    time: { useUTC: true },
    legend: {
      enabled: true,
      align: 'right',
      verticalAlign: 'middle',
      layout: 'vertical',
      itemStyle: { fontSize: '12px' }
    },
    rangeSelector: { enabled: false },
    navigator: { enabled: true, height: 45 },
    scrollbar: { enabled: true },
    credits: { enabled: false },
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
    xAxis: [{
      type: 'datetime',
      crosshair: { width: 1, color: '#999' },
      gridLineWidth: 0,
      tickInterval: day(),
      labels: { format: '{value:%b %e}' },
      ordinal: false,
      min: start,
      max: start + 13 * day()
    }],
    // --- Four stacked panes via multiple yAxis ---
    yAxis: [
      // Pane 1: ISIG
      {
        title: { text: 'ISIG' },
        height: '18%',
        offset: 0,
        top: '3%',
        gridLineWidth: 0,
        min: 0,
        max: 100
      },
      // Pane 2: SG
      {
        title: { text: 'SG' },
        height: '28%',
        top: '23%',
        offset: 0,
        plotBands: [{ // green band 70‑180
          from: 70, to: 180, color: 'rgba(0,128,0,0.08)'
        }],
        min: 0,
        max: 350
      },
      // Pane 3: TDD / Carbs / Bolus
      {
        title: { text: 'TDD / Carbs' },
        height: '24%',
        top: '54%',
        offset: 0,
        min: 0
      },
      // Pane 4: Auto Delivery
      {
        title: { text: 'Auto Delivery' },
        height: '18%',
        top: '82%',
        offset: 0,
        min: 0
      }
    ],
    plotOptions: {
      series: {
        dataGrouping: { enabled: false },
        marker: { enabled: false },
        states: { hover: { enabled: true } }
      },
      column: { pointPadding: 0, groupPadding: 0.08, borderWidth: 0 },
      areaspline: { fillOpacity: 0.15 },
      arearange: { enableMouseTracking: false }
    },
    series: [
      // --- Pane 1 ---
      {
        type: 'line',
        name: 'ISIG',
        yAxis: 0,
        step: 'left',
        data: isig,
        tooltip: { valueDecimals: 2 }
      },


      // --- Pane 2 (SG line) ---
      {
        type: 'line',
        name: 'SG',
        yAxis: 1,
        data: sg,
        color: '#111',
        lineWidth: 1
      },
      // Example event markers on SG pane (various shapes/colors)
      {
        type: 'scatter',
        name: 'BG',
        yAxis: 1,
        data: eventTimes.map(t => [t, 60 + Math.random() * 260] as [number, number]),
        marker: { symbol: 'circle', radius: 4 },
        tooltip: { pointFormat: '<b>BG:</b> {point.y:.0f}' }
      },
      {
        type: 'scatter',
        name: 'Calibration',
        yAxis: 1,
        data: eventTimes.slice(2, 6).map(t => [t, 200 + Math.random() * 80] as [number, number]),
        marker: { symbol: 'diamond', radius: 5 },
      },
      {
        type: 'scatter',
        name: 'Low Alert',
        yAxis: 1,
        data: eventTimes.slice(5, 9).map(t => [t, 70 + Math.random() * 30] as [number, number]),
        marker: { symbol: 'triangle-down', radius: 5 }
      },
      // --- Pane 3 (stacked columns resembling carbs/bolus/basal) ---
      {
        type: 'column',
        name: 'Carbs',
        yAxis: 2,
        data: carbs,
        pointRange: day(),
        tooltip: { valueSuffix: ' g' }
      },
      {
        type: 'column',
        name: 'Food bolus',
        yAxis: 2,
        data: bolusFood,
        stacking: 'normal'
      },
      {
        type: 'column',
        name: 'Correction bolus',
        yAxis: 2,
        data: bolusCorrection,
        stacking: 'normal'
      },
      {
        type: 'areaspline',
        name: 'Basal',
        yAxis: 2,
        data: basal,
        tooltip: { valueDecimals: 2 }
      },
      // --- Pane 4 ---
      {
        type: 'line',
        name: 'Auto basal',
        yAxis: 3,
        step: 'left',
        data: autoDelivery
      },
      {
        // type: 'xrange',
        // name: 'Temp Target',
        // yAxis: 3,
        // data: tempTarget.map(([s, e], i) => ({ x: s, x2: e, y: i % 1 })),
        // pointPadding: 0.2,
        // pointWidth: 6,
        // dataLabels: { enabled: false },
        // showInLegend: true
        
      }
    ]
  } as Highcharts.Options;
}
