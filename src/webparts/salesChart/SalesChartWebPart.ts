import { BaseClientSideWebPart } from '@microsoft/sp-webpart-base';
import { IPropertyPaneConfiguration, PropertyPaneTextField, PropertyPaneDropdown } from '@microsoft/sp-property-pane';
import { Version } from '@microsoft/sp-core-library';
import * as React from 'react';
import * as ReactDom from 'react-dom';

import { ISalesChartProps } from './components/SalesChart';
import SalesChart from './components/SalesChart';

export interface ISalesChartWebPartProps {
  chartTitle: string;
  chartType: string;
  listName: string;
}

export default class SalesChartWebPart extends BaseClientSideWebPart<ISalesChartWebPartProps> {
  public render(): void {
    const element: React.ReactElement<ISalesChartProps > = React.createElement(
      SalesChart,
      {
        chartTitle: this.properties.chartTitle,
        chartType: this.properties.chartType,
        context: this.context,
        listName: this.properties.listName,
      },
    );
    ReactDom.render(element, this.domElement);
  }

  protected onDispose(): void {
    ReactDom.unmountComponentAtNode(this.domElement);
  }

  protected get dataVersion(): Version {
    return Version.parse('1.0');
  }

  protected getPropertyPaneConfiguration(): IPropertyPaneConfiguration {
    return {
      pages: [
        {
          groups: [
            {
              groupName: 'Data',
              groupFields: [
                PropertyPaneTextField('listName', {
                  label: 'List Name',
                }),
              ],
            },
            {
              groupName: 'Chart',
              groupFields: [
                PropertyPaneTextField('chartTitle', {
                  label: 'Chart Title',
                }),
                PropertyPaneDropdown('chartType', {
                  selectedKey: this.properties.chartType,
                  label: 'Chart Type',
                  options: [
                    { key: 'barv', text: 'Bar Chart (Vertical)' },
                    { key: 'barh', text: 'Bar Chart (Horizontal)' },
                    { key: 'line', text: 'Line Chart' },
                  ],
                }),
              ],
            },
          ],
        },
      ],
    };
  }
}
