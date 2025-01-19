import {
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
const data = [
  { name: "Lun", total: 400 },
  { name: "Mar", total: 300 },
  { name: "Mié", total: 520 },
  { name: "Jue", total: 340 },
  { name: "Vie", total: 480 },
  { name: "Sáb", total: 600 },
  { name: "Dom", total: 450 },
];
export const SalesGraph = () => {
  return (
    <ResponsiveContainer className={"w-full"} height={300}>
      <LineChart data={data}>
        <XAxis
          dataKey="name"
          stroke="#888888"
          fontSize={12}
          tickLine={false}
          axisLine={false}
        />
        <YAxis
          stroke="#888888"
          fontSize={12}
          tickLine={false}
          axisLine={false}
          tickFormatter={(value) => `$${value}`}
        />
        <Tooltip />
        <Line
          type="monotone"
          dataKey="total"
          stroke="#8884d8"
          strokeWidth={2}
        />
      </LineChart>
    </ResponsiveContainer>
  );
};
