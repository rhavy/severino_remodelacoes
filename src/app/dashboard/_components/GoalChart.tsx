"use client"

import { RadialBarChart, RadialBar, PolarAngleAxis, ResponsiveContainer } from "recharts";

interface GoalChartProps {
  data: {
    name: string;
    value: number;
    fill: string;
  }[];
  label: string;
}

export function GoalChart({ data, label }: GoalChartProps) {
  return (
    <ResponsiveContainer width="100%" height={350}>
      <RadialBarChart
        innerRadius="80%"
        outerRadius="100%"
        data={data}
        startAngle={90}
        endAngle={-270}
        barSize={20}
      >
        <PolarAngleAxis
          type="number"
          domain={[0, 100]}
          angleAxisId={0}
          tick={false}
        />
        <RadialBar
          background
          dataKey="value"
          angleAxisId={0}
          data={data}
        />
        <text
          x="50%"
          y="50%"
          textAnchor="middle"
          dominantBaseline="middle"
          className="fill-current text-4xl font-bold text-yellow-500"
        >
          {`${data[0]?.value.toFixed(0) || 0}%`}
        </text>
        <text
          x="50%"
          y="60%"
          textAnchor="middle"
          dominantBaseline="middle"
          className="fill-current text-lg text-gray-400"
        >
          {label}
        </text>
      </RadialBarChart>
    </ResponsiveContainer>
  );
}