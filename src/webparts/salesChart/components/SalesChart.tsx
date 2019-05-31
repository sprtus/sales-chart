import { escape } from '@microsoft/sp-lodash-subset';
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
      </div>
    );
  }
}
