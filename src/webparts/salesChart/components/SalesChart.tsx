import { Bar, HorizontalBar, Line, ChartData } from 'react-chartjs-2';
import * as React from 'react';
import styles from './SalesChart.module.scss';

export interface ISalesChartProps {
  chartTitle: string;
  chartType: string;
  listFields: string;
  listName: string;
}

export default class SalesChart extends React.Component<ISalesChartProps, {}> {
  public render(): React.ReactElement<ISalesChartProps> {
    return (
      <div>
        {this.props.chartTitle && <h1 className={styles.title}>{this.props.chartTitle}</h1>}

        {this.props.chartType === 'barv' && <Bar data={this.data()} />}
        {this.props.chartType === 'barh' && <HorizontalBar data={this.data()} />}
        {this.props.chartType === 'line' && <Line data={this.data()} />}
      </div>
    );
  }

  // Generate chart data
  private data(): ChartData<Chart.ChartData> {
    // Chart data
    const data: ChartData<Chart.ChartData> = {
      labels: [
        'Jan',
        'Feb',
        'Mar',
        'Apr',
        'May',
      ],
      datasets: [
        {
          label: 'Sample Dataset 1',
          data: [10, 15, 5, 25, 20],
          backgroundColor: `rgba(65, 123, 170, ${this.props.chartType === 'line' ? '0' : '1'})`,
          borderColor: `rgba(65, 123, 170, 1)`,
        },
        {
          label: 'Sample Dataset 2',
          data: [25, 5, 0, 15, 30],
          backgroundColor: `rgba(209, 70, 93, ${this.props.chartType === 'line' ? '0' : '1'})`,
          borderColor: `rgba(209, 70, 93, 1)`,
        },
      ],
    };

    return data;
  }
}
