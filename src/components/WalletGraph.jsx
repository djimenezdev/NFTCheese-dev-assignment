import React, { useMemo } from "react";
import { AreaClosed, LinePath } from "@visx/shape";
import { curveNatural } from "@visx/curve";
import { scaleTime, scaleLinear } from "@visx/scale";
import { Group } from "@visx/group";
import { useTooltip, TooltipWithBounds, defaultStyles } from "@visx/tooltip";
import { LinearGradient } from "@visx/gradient";
import { AxisLeft, AxisBottom } from "@visx/axis";
import { max, extent } from "d3-array";
import { timeFormat } from "d3-time-format";
import { GlyphCircle } from "@visx/glyph";
import { localPoint } from "@visx/event";
import { GraphDataTimeline } from "../constants/GraphOneData";
import { BsCircleFill } from "react-icons/bs";

// accessors
const getDate = (d) => new Date(d.createdAt);
const getProfitValue = (d) => d.profit;

const WalletGraph = ({
  width,
  height,
  margin = { top: 40, right: 60, bottom: 40, left: 40 },
}) => {
  //tooltip
  const { tooltipData, tooltipLeft, tooltipTop, showTooltip, hideTooltip } =
    useTooltip();
  const tooltipStyles = {
    ...defaultStyles,
    color: "white",
    background: "#242230",
    padding: 10,
  };
  // bounds
  // this also got changed to fit with new margins
  const innerWidth = width - margin.left - margin.right;
  const innerHeight = height - margin.top - margin.bottom;

  // scales
  const dateScale = useMemo(
    () =>
      scaleTime({
        // has to start at 0
        range: [0, innerWidth + margin.left],
        domain: extent(GraphDataTimeline, getDate),
      }),
    [innerWidth, margin.left]
  );

  const profitValueScale = useMemo(
    () =>
      scaleLinear({
        range: [innerHeight + margin.top, margin.top],
        domain: [-3, max(GraphDataTimeline, getProfitValue)],
        nice: true,
      }),
    [margin.top, innerHeight]
  );
  //tooltip
  const showInfo = (event, info) => {
    const coords = localPoint(event.target.ownerSVGElement, event);

    showTooltip({
      tooltipLeft: coords.x,
      tooltipTop: coords.y,
      tooltipData: info,
    });
  };
  // custom marker mapp function

  const getX = (d) => dateScale(getDate(d)) ?? 0;
  const getY = (d) => profitValueScale(getProfitValue(d)) ?? 0;

  const getMarkerFill = (type) => {
    switch (type) {
      case "SELL":
        return "#4BC585";
      case "BUY":
        return "#FECF4A";
      case "TRANSFER":
        return "#7E22CE";
      case "MINT":
        return "#EF4444";
      default:
        return "red";
    }
  };

  return (
    <div style={{ background: "#000" }}>
      <p className="text-white relative top-12 left-4 m-0">Gains</p>
      <aside className="flex relative top-6 left-20 text-white">
        <section className="flex items-center mr-2">
          <BsCircleFill className="text-[#4BC585] mr-1 text-xs" />
          <p className="m-0">Sell</p>{" "}
        </section>
        <section className="flex items-center mr-2">
          <BsCircleFill className="text-[#FECF4A] mr-1 text-xs" />
          <p className="m-0">Buy</p>
        </section>
        <section className="flex items-center mr-2">
          <BsCircleFill className="text-purple-700 mr-1 text-xs" />
          <p className="m-0">Transfer</p>
        </section>
        <section className="flex items-center mr-2">
          <BsCircleFill className="text-red-500 mr-1 text-xs" />
          <p className="m-0">Mint</p>
        </section>
      </aside>
      <svg width={width} height={height}>
        {/* Wrap everything into a group shifting */}
        <Group left={margin.left}>
          <AxisLeft
            scale={profitValueScale}
            stroke={"#4BC585"}
            tickStroke={"transparent"}
            tickLabelProps={() => ({
              fill: "#fff",
              fontSize: 11,
              textAnchor: "end",
              verticalAnchor: "middle",
            })}
            tickValues={[-2, 0, 2, 4]}
          />

          <LinearGradient
            id="area-gradient"
            from={"#4BC585"}
            to={"#30644B"}
            toOpacity={0.1}
          />

          <LinePath
            data={GraphDataTimeline}
            curve={curveNatural}
            x={(d) => dateScale(getDate(d)) ?? 0}
            y={(d) => profitValueScale(getProfitValue(d)) ?? 0}
            stroke={"red"}
            markerMid="url(#line-marker)"
          />

          {GraphDataTimeline?.map((val, i) => {
            if (i !== 0 && i !== GraphDataTimeline.length - 1) {
              return (
                <>
                  <g style={{ cursor: "pointer", zIndex: 10 }}>
                    <image
                      onMouseOver={(event) => showInfo(event, val)}
                      onMouseLeave={() => hideTooltip()}
                      key={i}
                      width={30}
                      height={30}
                      x={getX(val) - 8}
                      y={getY(val) - 40}
                      href={val.assetThumbnailUrl}
                    />
                  </g>
                  <g fill={getMarkerFill(val.transactionType)}>
                    <GlyphCircle left={getX(val)} top={getY(val)} />
                  </g>
                </>
              );
            }
          })}

          <AreaClosed
            data={GraphDataTimeline}
            x={(d) => dateScale(getDate(d)) ?? 0}
            y={(d) => profitValueScale(getProfitValue(d)) ?? 0}
            yScale={profitValueScale}
            strokeWidth={1}
            stroke="url(#area-gradient)"
            fill="url(#area-gradient)"
            curve={curveNatural}
          />
          {/* Adjust this for the margin, I think this should actually be top */}
          <AxisBottom
            scale={dateScale}
            top={innerHeight + margin.bottom}
            stroke={"#4BC585"}
            tickLabelProps={() => ({
              fill: "#fff",
              fontSize: 11,
              textAnchor: "middle",
              verticalAnchor: "middle",
            })}
            numTicks={3}
            tickFormat={timeFormat("%Y/%d/%m")}
            tickStroke={"transparent"}
          />
        </Group>
      </svg>
      {tooltipData && (
        <div>
          <TooltipWithBounds
            key={Math.random()}
            top={tooltipTop + 60}
            left={tooltipLeft + 210}
            style={tooltipStyles}
          >
            <div className="flex">
              <aside>
                <h5 className="mb-2">
                  {tooltipData.transactionType} {tooltipData.token}{" "}
                  {tooltipData.collectionName}
                </h5>
                <p className="mb-1">
                  <span className="mr-1">Listing Price:</span>
                  <span className="font-semibold">
                    {tooltipData.listingPrice}
                  </span>
                </p>
                <p className="mb-1">
                  <span className="mr-1">Profit:</span>
                  <span
                    className={`${
                      parseInt(tooltipData.profit) >= 0
                        ? "text-[#4BC585]"
                        : "text-red-500"
                    } font-semibold`}
                  >
                    {tooltipData.profit}
                  </span>
                </p>
                <p>
                  <span className="mr-1">Rarity Rank:</span>
                  <span className="font-semibold">
                    {tooltipData.rarityRank}
                  </span>
                </p>
              </aside>
              <img
                src={tooltipData.assetThumbnailUrl}
                className="w-20 h-20 ml-2 rounded-md"
                alt={`${tooltipData.token} item display`}
              />
            </div>
          </TooltipWithBounds>
        </div>
      )}
    </div>
  );
};
export default WalletGraph;
