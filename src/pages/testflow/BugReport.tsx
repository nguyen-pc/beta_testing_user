import React, { useCallback, useEffect, useState } from "react";
import {
  Box,
  Button,
  Container,
  Typography,
  Stack,
  CircularProgress,
  Alert,
} from "@mui/material";
import { useParams } from "react-router-dom";
import { callGetCampaign } from "../../config/api";
import { useAppSelector } from "../../redux/hooks";
import UseCaseSection from "../../components/home/UseCaseSection";
import TestCaseExecution from "../../components/home/TestCaseExcution";

export default function BugReport() {
  const { campaignId } = useParams();
  const user = useAppSelector((s) => s.account.user);

  // 🧩 State
  const [campaign, setCampaign] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  const [joined, setJoined] = useState(false);

  // 🧠 Load data campaign
  const loadData = useCallback(async () => {
    setError(null);
    setIsLoading(true);
    try {
      const res = await callGetCampaign(campaignId);
      setCampaign(res.data);
    } catch (err) {
      setError(err as Error);
    }
    setIsLoading(false);
  }, [campaignId]);

  useEffect(() => {
    loadData();
  }, [loadData]);

  if (isLoading) {
    return (
      <Container maxWidth="md" sx={{ py: 8, textAlign: "center" }}>
        <CircularProgress />
        <Typography variant="body1" sx={{ mt: 2 }}>
          Loading campaign details...
        </Typography>
      </Container>
    );
  }

  if (error) {
    return (
      <Container maxWidth="md" sx={{ py: 8 }}>
        <Alert severity="error">
          Failed to load campaign data: {error.message}
        </Alert>
      </Container>
    );
  }

  if (!campaign) {
    return (
      <Container maxWidth="md" sx={{ py: 8 }}>
        <Alert severity="warning">Campaign not found.</Alert>
      </Container>
    );
  }

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      {/* Header */}
      <Stack
        direction="row"
        justifyContent="space-between"
        alignItems="center"
        sx={{ mb: 3 }}
      >
        <Typography variant="h5" fontWeight="bold">
          🧾 Bug Report & Test Execution
        </Typography>

        {/* <Typography variant="body1" color="text.secondary">
          Campaign ID: <strong>{campaignId}</strong>
        </Typography> */}
      </Stack>

      {/* Chi tiết chiến dịch */}
      <Box
        sx={{
          p: 2,
          borderRadius: 2,
          mb: 4,
          boxShadow: 1,
          bgcolor: (t) => (t.palette.mode === "light" ? "#f8f8fc" : "#1e1e1e"),
        }}
      >
        <Typography variant="h6" fontWeight="bold">
          {campaign.title}
        </Typography>
        <Typography color="text.secondary" sx={{ mt: 1 }}>
          {campaign.description || "No campaign description available."}
        </Typography>
      </Box>

      {/* Danh sách Use Case / Test Case */}
      <TestCaseExecution
        useCases={campaign?.useCases || []}
        campaignId={Number(campaignId)}
      />

      {/* Thêm phần survey */}
      <Box sx={{ mt: 4 }}>
        <Typography variant="h6" fontWeight="bold">
          User Feedback Survey
        </Typography>
        <Typography color="text.secondary" sx={{ mt: 1 }}>
          We value your feedback! Please take a moment to complete our survey.
        </Typography>
        <Button variant="contained" sx={{ mt: 2 }}>
          Start Survey
        </Button>
      </Box>

      {/* Nút quay lại / hoàn thành */}
      <Stack direction="row" justifyContent="flex-end" sx={{ mt: 3 }}>
        <Button
          variant="contained"
          color="secondary"
          onClick={() => window.location.assign(`/home/detail/user/${campaignId}`)}
        >
          ← Back to Campaign
        </Button>
      </Stack>
    </Container>
  );
}
