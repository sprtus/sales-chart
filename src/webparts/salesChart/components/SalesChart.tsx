import { Bar, HorizontalBar, Line, ChartData } from 'react-chartjs-2';
import { SPHttpClient } from '@microsoft/sp-http';
import { WebPartContext } from '@microsoft/sp-webpart-base';
import * as React from 'react';

import { Sale } from '../Sale';
import styles from './SalesChart.module.scss';

export interface ISalesChartProps {
  chartTitle: string;
  chartType: string;
  context: WebPartContext;
  listName: string;
}

export interface ISalesChartState {
  data: ChartData<Chart.ChartData>;
  loading: boolean;
  sales: Sale[];
  totals: YearlyTotals;
}

export interface YearlyTotals {
  [index: string]: number[];
}

export interface Color {
  r: number;
  g: number;
  b: number;
}

// Months
const months = [
  'Jan',
  'Feb',
  'Mar',
  'Apr',
  'May',
  'Jun',
  'Jul',
  'Aug',
  'Sep',
  'Oct',
  'Nov',
  'Dec',
];

// Colors
const colors = [
  '93, 201, 136',
  '234, 120, 89',
  '123, 87, 186',
  '209, 37, 71',
];

export default class SalesChart extends React.Component<ISalesChartProps, ISalesChartState> {
  constructor(props: ISalesChartProps) {
    super(props);

    // Bind methods
    this.refresh = this.refresh.bind(this);
    this.getSalesData = this.getSalesData.bind(this);
    this.calculateTotals = this.calculateTotals.bind(this);
    this.data = this.data.bind(this);

    // State
    this.state = {
      data: {},
      loading: true,
      sales: [],
      totals: {},
    };
  }

  public render(): React.ReactElement<ISalesChartProps> {
    return (
      <div>
        {this.props.chartTitle && <h1 className={styles.title}>{this.props.chartTitle}</h1>}

        {this.props.chartType === 'barv' && <Bar data={this.state.data} />}
        {this.props.chartType === 'barh' && <HorizontalBar data={this.state.data} />}
        {this.props.chartType === 'line' && <Line data={this.state.data} />}

        <button className={styles.refresh} onClick={this.refresh}>Refresh</button>
      </div>
    );
  }

  // Get sales data on mount
  public componentDidMount(): void {
    this.refresh();
  }

  // Refresh data
  private async refresh(): Promise<void> {
    await this.getSalesData();
    this.calculateTotals();
    this.data();
  }

  // Get sales data
  private async getSalesData(): Promise<void> {
    // Loading
    this.setState({ loading: true });

    // Get sales data
    const response = await this.props.context.spHttpClient.get(`${this.props.context.pageContext.web.absoluteUrl}/_api/lists/getbytitle('${this.props.listName}')/items?$select=ORDERDATE,YEAR_ID,MONTH_ID,SALES,STATE&$orderby=ORDERDATE&$top=5000`, SPHttpClient.configurations.v1);
    const json = await response.json();

    // Update state
    this.setState({
      sales: json.value,
      loading: false,
    });
  }

  // Calculate totals from sales data
  private calculateTotals(): void {
    // Calculate monthly totals
    const totals: YearlyTotals = {};
    this.state.sales.forEach(sale => {
      // Init yearly total
      if (!totals[sale.YEAR_ID]) totals[sale.YEAR_ID] = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];

      // Increment total
      totals[sale.YEAR_ID][sale.MONTH_ID - 1] += Math.round(sale.SALES);
    });

    // Update state
    this.setState({ totals });
  }

  // Generate chart data
  private data(): void {
    // Add datasets
    const datasets: Chart.ChartDataSets[] = [];
    Object.keys(this.state.totals).forEach((year, i) => {
      // Next color
      const color = colors[i % colors.length];

      // Add dataset
      datasets.push({
        label: year,
        data: this.state.totals[year],
        backgroundColor: `rgba(${color}, ${this.props.chartType === 'line' ? '0.25' : '1'})`,
        borderColor: `rgba(${color}, 1)`,
      });
    });

    // Chart data
    this.setState({
      data: {
        labels: months,
        datasets,
      },
    });
  }
}
