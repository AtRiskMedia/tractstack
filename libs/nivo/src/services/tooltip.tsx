// @ts-ignore
import React, { useEffect, useMemo, useState, ReactNode } from "react";

export interface NonOverflowTooltipWrapperProps {
  point: { x: number; y: number };
  children?: ReactNode;
}

export const NonOverflowTooltipWrapper = (
  props: NonOverflowTooltipWrapperProps,
) => {
  const [tooltipSize, setTooltipSize] = useState<{
    width: number;
    height: number;
  }>({ width: 0, height: 0 });

  // dynamically get the size of the tooltip
  useEffect(() => {
    const tooltip = document.querySelector(".nivo_tooltip");
    if (tooltip) {
      const { width, height } = tooltip.getBoundingClientRect();
      setTooltipSize({ width, height });
    }
  }, [setTooltipSize]);

  // only show it to the right of the pointer when we are close to the left edge
  const translateX = useMemo(
    () =>
      props.point.x < (tooltipSize.width * 1.05) / 2 ? 0 : -tooltipSize.width,
    [tooltipSize, props.point.x],
  );

  // only show it below the pointer when we are close to the top edge
  const translateY = useMemo(
    () =>
      props.point.y < (tooltipSize.height * 1.05) / 2 ? 0 : -tooltipSize.height,
    [tooltipSize, props.point.y],
  );

  return (
    <div
      className={"nivo_tooltip"}
      style={{
        position: "absolute",
        transform: `translate(${translateX}px, ${translateY}px)`,
        width: "fit-content",
      }}
    >
      <div
        className="w-full max-w-xl rounded-md drop-shadow-lg"
        style={{
          width: "20rem",
          position: "relative",
          background: "rgb(255,255,255)",
        }}
      >
        {props.children}
      </div>
    </div>
  );
};
