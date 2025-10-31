import * as React from "react";
import { useTheme } from "@mui/material/styles";
import Box from "@mui/material/Box";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import Chip from "@mui/material/Chip";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import { SparkLineChart } from "@mui/x-charts/SparkLineChart";
import { areaElementClasses } from "@mui/x-charts/LineChart";

export type StatCardProps = {
  title: string;
  value: string | number;
  interval: string;
  trend: "up" | "down" | "neutral";
  data: number[];
};

function AreaGradient({ color, id }: { color: string; id: string }) {
  return (
    <defs>
      <linearGradient id={id} x1="0" y1="0" x2="0" y2="1">
        <stop offset="0%" stopColor={color} stopOpacity={0.3} />
        <stop offset="100%" stopColor={color} stopOpacity={0} />
      </linearGradient>
    </defs>
  );
}

export default function StatCard({
  title,
  value,
  interval,
  trend,
  data,
}: StatCardProps) {
  const theme = useTheme();

  // 🧭 6 tháng gần nhất (hiển thị theo thứ tự)
  const now = new Date();
  const months = Array.from({ length: 6 }, (_, i) => {
    const d = new Date(now.getFullYear(), now.getMonth() - 5 + i, 1);
    return d.toLocaleString("en-US", { month: "short" });
  });

  // 🎨 Màu theo trend
  const trendColors = {
    up:
      theme.palette.mode === "light"
        ? theme.palette.success.main
        : theme.palette.success.dark,
    down:
      theme.palette.mode === "light"
        ? theme.palette.error.main
        : theme.palette.error.dark,
    neutral:
      theme.palette.mode === "light"
        ? theme.palette.info.main
        : theme.palette.info.dark,
  };

  const chipColors = {
    up: "success" as const,
    down: "error" as const,
    neutral: "default" as const,
  };

  const chartColor = trendColors[trend];
  const gradientId = `gradient-${title.replace(/\s+/g, "-")}`;
  const labelColor = chipColors[trend];
  const trendLabel =
    trend === "up" ? "+25%" : trend === "down" ? "-25%" : "+5%";

  return (
    <Card
      variant="outlined"
      sx={{
        height: "100%",
        flexGrow: 1,
        borderRadius: 3,
        boxShadow: "0px 2px 6px rgba(0,0,0,0.05)",
      }}
    >
      <CardContent>
        {/* Tiêu đề */}
        <Typography component="h2" variant="subtitle2" gutterBottom>
          {title}
        </Typography>

        {/* Giá trị + trend chip */}
        <Stack
          direction="row"
          justifyContent="space-between"
          alignItems="center"
          sx={{ mb: 1 }}
        >
          <Typography variant="h4" component="p" fontWeight={700}>
            {value}
          </Typography>
          {/* <Chip size="small" color={labelColor} label={trendLabel} /> */}
        </Stack>

        <Typography variant="caption" sx={{ color: "text.secondary" }}>
          {interval}
        </Typography>

        {/* SparkLineChart */}
        <Box sx={{ width: "100%", height: 60, mt: 2 }}>
          <SparkLineChart
            data={data}
            area
            showHighlight
            showTooltip
            color={chartColor}
            xAxis={{
              scaleType: "band",
              data: months,
            }}
            sx={{
              [`& .${areaElementClasses.root}`]: {
                fill: `url(#${gradientId})`,
              },
            }}
          >
            <AreaGradient color={chartColor} id={gradientId} />
          </SparkLineChart>
        </Box>
      </CardContent>
    </Card>
  );
}
