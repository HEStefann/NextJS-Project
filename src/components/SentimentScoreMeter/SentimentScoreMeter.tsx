"use client";
import React from "react";
import ReactSpeedometer from "react-d3-speedometer";

interface SentimentScoreMeterProps {
  value: number;
}

export default function SentimentScoreMeter(props: SentimentScoreMeterProps) {

  const colors = ['#F30000', '#FF3700', '#FF6E00', '#FFA500', '#FFD300', '#FFFF00', '#BFFF00', '#7FFF00', '#3FFF00', '#198667'];

  return (
    <ReactSpeedometer
      startColor="#F30000"
      endColor="#198667"
      needleColor="#000000/80"
      value={props.value}
      minValue={-1}
      maxValue={1}
      segments={10}
      customSegmentStops={[-1, -0.5, 0.2, 0.4, 0.6, 0.8, 1]}
      customSegmentLabels={[
        { text: "Negative", color: "#fff" },
        { text: "", color: "#fff" },
        {
          text: "", color: "#fff"
        },
        { text: "", color: "#fff" },
        { text: "", color: "#fff" },
        { text: "Positive", color: "#fff" }
      ]}
      width={300}
      height={200}
    />
  );
}
