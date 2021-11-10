import { Component, ElementRef, Input, OnInit, ViewChild } from '@angular/core';
import { BarController, BarElement, CategoryScale, Chart, ChartConfiguration, ChartData, ChartItem, ChartOptions, LinearScale, LineController, LineElement, PointElement, ScatterController, Tooltip, TooltipItem } from 'chart.js';
import { Config } from 'src/app/_classes/config.class';

Chart.register(CategoryScale, LinearScale, BarController, BarElement, LineController, LineElement, ScatterController, PointElement, Tooltip);
Chart.defaults.color = "#90e5ff";

const tooltipPlugin = Chart.registry.getPlugin('tooltip') as any;

tooltipPlugin.positioners.verticallyCenter = (elements: any, position: any) => {
  if (!elements.length) {
    return tooltipPlugin.positioners.average(elements);
  }
  const { x, y, base, width } = elements[0].element;
  const height = (base - y) / 2;
  const offset = x + width / 2;
  return {
    x: offset,
    y: y + height
  };
};


@Component({
  selector: 'app-chart',
  templateUrl: './chart.component.html',
  styleUrls: ['./chart.component.scss']
})
export class ChartComponent implements OnInit {
  @ViewChild('chartRef') chartRef!: ElementRef;
  @Input('config') set setData(config: Config) {
    if (!config) {
      if (this.chart) {
        this.chart.destroy();
      }
      return
    }
    this.config = config
    let chartDatas: ChartData = {
      datasets: [{
        data: config.datas.map((v: number[], i: number) => {
          return {
            x: v[0],
            y: v[1]
          }
        }),
        pointStyle: 'circle',
        backgroundColor: "#90e5ff",
        pointBorderColor: "#90e5ff",
        pointBorderWidth: 1,
      }],
    }
    this.createChart(chartDatas)
  }
  config!: Config
  datas!: ChartData
  chart!: Chart

  constructor() { }

  private get ctx(): CanvasRenderingContext2D {
    return (this.chartRef.nativeElement as HTMLCanvasElement).getContext('2d') as CanvasRenderingContext2D;
  }

  ngOnInit(): void { }

  ngAfterViewInit(): void { }

  private createChart(chartData: ChartData): void {
    if (this.chart) {
      this.chart.destroy();
    }

    if (!this.ctx || !chartData) {
      return;
    }

    const chartConfiguration: ChartConfiguration = {
      type: 'scatter',//this.chartType,
      data: chartData,
      options: {
        color: '#909090',
        scales: {
          x: {
            title: {
              text: this.config.header[0],
              display: true,
              color: '#FFF',
              font: {
                size: 18,
                family: 'Comfortaa_Regular',
              },
            },
            grid: {
              color: '#909090'
            }
          },
          y: {
            title: {
              text: this.config.header[1],
              display: true,
              color: '#FFF',
              font: {
                size: 18,
                family: 'Comfortaa_Regular',
              },
            },
            grid: {
              color: '#909090',
            }
          }
        },
        plugins: {
          tooltip: {
            displayColors: false,
            callbacks: {
              labelPointStyle: function (context) {
                return {
                  pointStyle: 'star',
                  rotation: 0
                };
              },
              label: (item: TooltipItem<any>) => {
                let coords: any = item.raw
                return `${this.config.header[0]} : ${Number(coords.x).toLocaleString()}`;
              },
              afterLabel: (item: TooltipItem<any>) => {
                let coords: any = item.raw
                return `${this.config.header[1]} : ${Number(coords.y).toLocaleString()}`;
              },
            }
          }
        }
      },//this.chartOptions,

    };

    this.chart = new Chart(this.ctx, chartConfiguration);
  }

}
