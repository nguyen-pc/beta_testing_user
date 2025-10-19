import React, { useEffect, useState } from "react";
import {
  Box,
  Typography,
  Card,
  CardContent,
  Chip,
  CircularProgress,
  Alert,
  Stack,
  Divider,
  Button,
} from "@mui/material";
import { callGetBugByUserAndCampaign } from "../../config/api";
import { useAppSelector } from "../../redux/hooks";

interface BugReport {
  id: number;
  title: string;
  description: string;
  severity: string;
  priority: string;
  status: string | null;
  stepsToReproduce: string;
  expectedResult: string;
  actualResult: string;
  bugTypeId: number;
}

interface UserBugReportListProps {
  campaignId: number;
  reload?: boolean;
}

export default function UserBugReportList({
  campaignId,
  reload,
}: UserBugReportListProps) {
  const user = useAppSelector((s) => s.account.user);
  const [bugs, setBugs] = useState<BugReport[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    const loadBugs = async () => {
      setError(null);
      setLoading(true);
      try {
        const res = await callGetBugByUserAndCampaign(
          String(user?.id),
          String(campaignId)
        );
        const data = res.data.result || [];
        setBugs(data);
      } catch (err) {
        setError(err as Error);
      } finally {
        setLoading(false);
      }
    };

    if (user?.id && campaignId) loadBugs();
  }, [user?.id, campaignId, reload]);

  if (loading) {
    return (
      <Box sx={{ textAlign: "center", py: 4 }}>
        <CircularProgress />
        <Typography sx={{ mt: 2 }}>Loading your bug reports...</Typography>
      </Box>
    );
  }

  if (error) {
    return (
      <Alert severity="error">
        Failed to load bug reports: {error.message}
      </Alert>
    );
  }

  if (!bugs.length) {
    return <Alert severity="info">You haven’t reported any bugs yet.</Alert>;
  }

  return (
    <Box sx={{ mt: 4 }}>
      <Typography
        variant="h6"
        fontWeight="bold"
        sx={{ mb: 2, color: "primary.main" }}
      >
        Your Reported Bugs
      </Typography>

      <Stack spacing={2}>
        {bugs.map((bug) => (
          <Card
            key={bug.id}
            sx={{
              borderRadius: 2,
              boxShadow: 3,
              p: 1,
              borderLeft: `6px solid ${
                bug.severity === "CRITICAL"
                  ? "#d32f2f"
                  : bug.severity === "MAJOR"
                  ? "#f57c00"
                  : bug.severity === "MINOR"
                  ? "#1976d2"
                  : "#9e9e9e"
              }`,
            }}
          >
            <CardContent>
              <Stack
                direction="row"
                justifyContent="space-between"
                alignItems="center"
                flexWrap="wrap"
              >
                <Typography variant="h6" fontWeight="bold">
                  {bug.title}
                </Typography>
                <Stack direction="row" spacing={1}>
                  <Chip
                    size="small"
                    label={bug.severity}
                    color={
                      bug.severity === "CRITICAL"
                        ? "error"
                        : bug.severity === "MAJOR"
                        ? "warning"
                        : "info"
                    }
                  />
                  <Chip size="small" label={bug.priority} variant="outlined" />
                  <Chip
                    size="small"
                    label={bug.status || "PENDING"}
                    color={bug.status === "IN_PROGRESS" ? "primary" : "default"}
                  />
                </Stack>
              </Stack>

              <Divider sx={{ my: 1.5 }} />

              <Typography
                variant="body2"
                color="text.secondary"
                sx={{ mb: 1 }}
                dangerouslySetInnerHTML={{ __html: bug.description }}
              />

              <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                <strong>Steps to Reproduce:</strong>
              </Typography>
              <Typography
                variant="body2"
                dangerouslySetInnerHTML={{ __html: bug.stepsToReproduce }}
              />

              <Typography variant="body2" sx={{ mt: 1 }}>
                <strong>Expected:</strong> {bug.expectedResult}
              </Typography>
              <Typography variant="body2">
                <strong>Actual:</strong> {bug.actualResult}
              </Typography>

              <Box textAlign="right" sx={{ mt: 2 }}>
                <Button
                  href={`/dashboard/bug/${bug.id}`}
                  variant="outlined"
                  size="small"
                >
                  View Detail
                </Button>
              </Box>
            </CardContent>
          </Card>
        ))}
      </Stack>
    </Box>
  );
}
