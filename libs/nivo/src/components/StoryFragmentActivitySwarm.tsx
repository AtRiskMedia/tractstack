// @ts-ignore
import React from 'react';
import { generateSwarmPlotData } from '@nivo/generators';
import { ResponsiveSwarmPlot } from '@nivo/swarmplot';

import { CustomCircle } from './CustomCircle';
import { DetailsPie } from './DetailsPie';
import { NonOverflowTooltipWrapper } from '../services/tooltip';
import { theme, oneDarkTheme } from '../services/theme';
import { IChartData } from './PaneActivitySwarm';

export type SwarmPlotDatum = ReturnType<
  typeof generateSwarmPlotData
>['data'][number];

/*
type ChartProps = {
  valueMin: number,
  valueMax: number,
  eventsValues: number[],
  eventsSizes: number[],
}
const MIN_EVENTS_NODE_SIZE: number = 10;
const MAX_EVENTS_NODE_EXTRA_SPACE_PCT: number = 0.05;
*/

export const StoryFragmentActivitySwarm = (payload: IChartData) => {
  const handleClick = payload.handleClick;
  const chartProps = {
    valueMin: 0,
    valueMax: 100,
    eventsValues: [0, 25],
    eventsSizes: [10, 25],
  };
  return (
    <ResponsiveSwarmPlot
      margin={{
        top: 10,
        right: 30,
        bottom: 80,
        left: 30,
      }}
      data={payload.data.data}
      groups={payload.data.groups}
      groupBy="group"
      id="id"
      value="engagement"
      valueScale={{
        type: 'linear',
        min: chartProps.valueMin,
        max: chartProps.valueMax,
      }}
      size={{
        key: 'events',
        values: chartProps.eventsValues,
        sizes: chartProps.eventsSizes,
      }}
      spacing={12}
      colors={oneDarkTheme}
      enableGridY={false}
      axisTop={null}
      axisRight={null}
      axisLeft={null}
      axisBottom={{
        legend: `Inactive nodes float left. Active nodes float right.`,
        legendPosition: 'middle',
        legendOffset: 50,
      }}
      circleComponent={CustomCircle}
      layout="horizontal"
      theme={theme}
      isInteractive={true}
      useMesh={true}
      tooltip={(p) => (
        <NonOverflowTooltipWrapper point={{ x: p.x, y: p.y }}>
          <div className="text-myblue px-4 pt-4 pb-2 font-main w-full flex flex-col flex-start">
            <span className="text-xl font-bold">{p.data.id}</span>
            <div className="h-36 w-72">
              <DetailsPie
                data={[
                  {
                    id: `skip`,
                    value: 0,
                  },
                  {
                    id: `Read`,
                    value:
                      typeof p?.data?.categories !== `undefined`
                        ? p.data.categories[1]
                        : 0,
                  },
                  {
                    id: `Glossed`,
                    value:
                      typeof p?.data?.categories !== `undefined`
                        ? p.data.categories[2]
                        : 0,
                  },
                  {
                    id: `Clicked`,
                    value:
                      typeof p?.data?.categories !== `undefined`
                        ? p.data.categories[3]
                        : 0,
                  },
                  {
                    id: `Entered`,
                    value:
                      typeof p?.data?.categories !== `undefined`
                        ? p.data.categories[4]
                        : 0,
                  },
                  {
                    id: `Discovered`,
                    value:
                      typeof p?.data?.categories !== `undefined`
                        ? p.data.categories[5]
                        : 0,
                  },
                ]}
              />
            </div>
          </div>
        </NonOverflowTooltipWrapper>
      )}
      //onMouseEnter={(e) => console.log('enter: ' + e.index, e)}
      onClick={(e) => handleClick(e)}
    />
  );
};
