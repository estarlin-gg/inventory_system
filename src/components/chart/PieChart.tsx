import {
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Tooltip,
} from "recharts";

interface AnalyticsPieChartProps {
  data: { name: string; value: number }[];
  height?: number;
  colors?: string[];
}

export const AnalyticsPieChart = ({
  data,
  height = 400,
  colors = ["#8884d8", "#82ca9d", "#ffc658", "#ff7f7f", "#a28bfd"],
}: AnalyticsPieChartProps) => {
  const total = data.reduce((acc, d) => acc + d.value, 0);

  return (
    <div style={{ width: "100%", height }}>
      <ResponsiveContainer>
        <PieChart>
          <Tooltip
            formatter={(value, _name, props) => {
              const percent = ((value as number) / total) * 100;
              return [`${value} unidades (${percent.toFixed(1)}%)`, props.payload.name];
            }}
          />

          <Pie
            data={data}
            dataKey="value"
            outerRadius="80%"
            label={({ name, value }) => {
              const percent = (value / total) * 100;
              return `${name} (${value}) - ${percent.toFixed(1)}%`;
            }}
          >
            {data.map((_, i) => (
              <Cell key={i} fill={colors[i % colors.length]} />
            ))}
          </Pie>
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
};

export default AnalyticsPieChart;
