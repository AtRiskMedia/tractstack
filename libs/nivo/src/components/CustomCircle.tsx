// @ts-ignore
import React from "react";
import { useCallback } from "react";
import { CircleProps } from "@nivo/swarmplot";
import { useTooltip } from "@nivo/tooltip";
import { generateSwarmPlotData } from "@nivo/generators";
import { usePie } from "@nivo/pie";

import { oneDarkTheme } from "../services/theme";

export type SwarmPlotDatum = ReturnType<
  typeof generateSwarmPlotData
>["data"][number];

//https://github.com/plouc/nivo/blob/master/packages/bar/src/BarItem.tsx
export const CustomCircle = (props: CircleProps<SwarmPlotDatum>) => {
  const { /* showTooltipFromEvent,*/ hideTooltip } = useTooltip();

  const pie = usePie({
    data:
      props.node.data.categories?.map((value: number, id: number) => ({
        id,
        value: value,
        hidden: false,
        data: value,
        color: "",
        formattedValue: `${value}`,
        label: value,
      })) || [],
    radius: props.node.size / 2,
    innerRadius: (props.node.size / 2) * 0.7,
    sortByValue: true,
  });

  const handleMouseEnter = useCallback(
    (event: React.MouseEvent) => {
      props.onMouseEnter?.(props.node, event);
      //showTooltipFromEvent(renderTooltip(), event)
    },
    [props /*, showTooltipFromEvent, renderTooltip*/],
  );
  const handleMouseLeave = useCallback(
    (event: React.MouseEvent) => {
      props.onMouseLeave?.(props.node, event);
      hideTooltip();
    },
    [props, hideTooltip],
  );

  return (
    <g
      transform={`translate(${props.node.x},${props.node.y})`}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      <circle
        r={props.node.size / 2}
        stroke="rgb(167, 177, 183)"
        strokeWidth={12}
      />
      <circle
        r={props.node.size / 2}
        fill="rgb(227,227,227)"
        stroke="rgb(227,227,227)"
        strokeWidth={6}
      />
      {pie.dataWithArc.map((datum, i) => {
        return (
          <path
            key={i}
            d={pie.arcGenerator(datum.arc) || undefined}
            fill={oneDarkTheme[i % 16]}
          />
        );
      })}
      {props.node.size > 52 && (
        <text
          fill="black"
          textAnchor="middle"
          dominantBaseline="central"
          style={{
            fontSize: 14,
            fontWeight: 800,
          }}
        >
          {props.node.value.toString()}
        </text>
      )}
    </g>
  );
};
