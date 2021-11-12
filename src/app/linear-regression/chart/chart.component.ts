import { Component, ElementRef, Input, OnInit, ViewChild } from '@angular/core';
import { BarController, BarElement, CategoryScale, Chart, ChartConfiguration, ChartData, ChartItem, ChartOptions, LinearScale, LineController, LineElement, PointElement, ScatterController, Tooltip, TooltipItem } from 'chart.js';
import { Config, LRDatas } from 'src/app/_classes/config.class';

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
    let chartDatas = this.createDatasets()
    this.createChart(chartDatas)
  }
  @Input('thetas') set setThetas(thetas: [number, number]) {
    this.thetas = thetas
    this.refreshHypothesis()
  }
  config!: Config
  datas!: ChartData
  chart!: Chart
  thetas: [number, number] = [0, 0]

  constructor() { }

  private get ctx(): CanvasRenderingContext2D {
    return (this.chartRef.nativeElement as HTMLCanvasElement).getContext('2d') as CanvasRenderingContext2D;
  }

  ngOnInit(): void { }

  ngAfterViewInit(): void { }

  createDatasets(): ChartData {
    let linemin = Math.min(...this.config.datas.map(v => v.x))
    let linemax = Math.max(...this.config.datas.map(v => v.x))
    return {
      datasets: [{
        type: 'scatter',
        data: this.config.datas.map((v: LRDatas, i: number) => {
          return {
            x: v.x,
            y: v.y,
          }
        }),
        pointStyle: 'circle',
        backgroundColor: "#90e5ff",
        pointBorderColor: "#90e5ff",
        pointBorderWidth: 1,
      }, {
        type: 'line',
        data: [{
          x: linemin,
          y: this.thetas[0]
        }, {
          x: linemax,
          y: this.thetas[1]
        }],
        borderColor: 'rgb(255, 99, 132)',
        backgroundColor: 'rgba(255, 99, 132, 0.2)'
      }],
    }
  }

  refreshHypothesis() {
    if (this.config && this.chart) {
      let linemin = Math.min(...this.config.datas.map(v => v.x))
      let linemax = Math.max(...this.config.datas.map(v => v.x))
      this.thetas = this.thetas || [0, 0]
      if (this.chart) {
        this.chart.data.datasets[1].data = [{
          x: linemin,
          y: this.thetas[0]
        }, {
          x: linemax,
          y: this.thetas[1] * linemax + this.thetas[0]
        }]
        this.chart.update()
      }
    }
  }

  private createChart(chartData: ChartData): void {
    if (this.chart) {
      this.chart.destroy();
    }

    if (!this.ctx || !chartData) {
      return;
    }

    const chartConfiguration: ChartConfiguration = {
      type: 'scatter',
      data: chartData,
      options: {
        color: '#909090',
        scales: {
          x: {
            title: {
              text: this.config.header.x,
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
              text: this.config.header.y,
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
                return `${this.config.header.x} : ${Number(coords.x).toLocaleString()}`;
              },
              afterLabel: (item: TooltipItem<any>) => {
                let coords: any = item.raw
                return `${this.config.header.y} : ${Number(coords.y).toLocaleString()}`;
              },
            }
          }
        }
      },
    };

    this.chart = new Chart(this.ctx, chartConfiguration);
  }

}
