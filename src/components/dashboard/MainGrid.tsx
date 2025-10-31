import React, { useEffect, useState } from "react";
import {
  Box,
  Grid,
  Typography,
  CircularProgress,
  useTheme,
} from "@mui/material";
import StatCard from "./StatCard";
import HighlightedCard from "./HighlightedCard";
import Copyright from "../../internals/components/Copyright";
import PageViewsBarChart from "./PageViewsBarChart";
import SessionsChart from "./SessionsChart";
import { useAppSelector } from "../../redux/hooks";
import { callGetTesterDashboardStats } from "../../config/api";

export default function MainGrid() {
  const user = useAppSelector((state) => state.account.user);
  const [stats, setStats] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const theme = useTheme();

  // 🧩 Fetch API
  useEffect(() => {
    const fetchStats = async () => {
      try {
        if (!user?.id) return;
        setLoading(true);
        const res = await callGetTesterDashboardStats(user.id);
        setStats(res.data);
      } catch (error) {
        console.error("Error fetching tester dashboard stats:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchStats();
  }, [user]);

  if (loading) {
    return (
      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          py: 10,
        }}
      >
        <CircularProgress />
      </Box>
    );
  }

  if (!stats) {
    return (
      <Typography align="center" sx={{ mt: 5 }}>
        No data available.
      </Typography>
    );
  }

  // === Chuẩn hóa dữ liệu ===
  const cards = [
    {
      title: "Campaigns Joined",
      value: stats.totalCampaigns ?? 0,
      interval: "Last 6 months",
      trend: "up",
      color: theme.palette.primary.main,
      data: stats.campaignTrend ?? [],
    },
    {
      title: "Bugs Reported",
      value: stats.totalBugs ?? 0,
      interval: "Last 6 months",
      trend: "up",
      color: theme.palette.error.main,
      data: stats.bugTrend ?? [],
    },
    {
      title: "Surveys Completed",
      value: stats.totalSurveys ?? 0,
      interval: "Last 6 months",
      trend: "neutral",
      color: theme.palette.info.main,
      data: stats.surveyTrend ?? [],
    },
    {
      title: "Total Rewards",
      value: `${stats.totalRewards?.toLocaleString("en-US")} ₫`,
      interval: "Approved rewards",
      trend: "up",
      color: theme.palette.success.main,
      data: [],
    },
  ];

  return (
    <Box sx={{ width: "100%", maxWidth: { sm: "100%", md: "1700px" } }}>
      {/* === TITLE === */}
      <Typography component="h2" variant="h6" sx={{ mb: 2 }}>
        Overview
      </Typography>

      {/* === GRID CARDS === */}
      <Grid
        container
        spacing={2}
        columns={12}
        sx={{ mb: (theme) => theme.spacing(2) }}
      >
        {cards.map((card, index) => (
          <Grid key={index} xs={12} sm={6} lg={3}>
            <StatCard
              title={card.title}
              value={card.value}
              interval={card.interval}
              trend={card.trend as any}
              data={card.data}
              color={card.color}
            />
          </Grid>
        ))}


        {/* === Biểu đồ phụ === */}
        {/* <Grid xs={12} md={6}>
          <SessionsChart />
        </Grid>
        <Grid xs={12} md={6}>
          <PageViewsBarChart />
        </Grid> */}
      </Grid>

      <Copyright sx={{ my: 4 }} />
    </Box>
  );
}
