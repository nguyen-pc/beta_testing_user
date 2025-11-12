import React, { useCallback, useEffect, useState } from "react";
import {
  Box,
  Button,
  Container,
  Typography,
  Stack,
  CircularProgress,
  Alert,
  Card,
  CardContent,
  CardActions,
  Grid,
} from "@mui/material";
import { useParams } from "react-router-dom";
import {
  callGetCampaign,
  callGetStatusCampaignsByUser,
  callGetSurveysByCampaign,
  callGetTesterSurveyStatus,
} from "../../config/api";
import { useAppSelector } from "../../redux/hooks";
import TestCaseExecution from "../../components/home/TestCaseExcution";
import CreateBugReport from "../../components/home/CreateBugReport";
import UserBugReportList from "../../components/home/UserBugReportList";
import FileUploadVideo from "../../components/home/FileUploadVideo";
import parse from "html-react-parser";

export default function BugReport({ userId }: { userId: number }) {
  const { campaignId } = useParams();
  // const user = useAppSelector((s) => s.account.user);

  console.log("user" + userId);
  const [campaign, setCampaign] = useState<any>(null);
  const [surveyStatuses, setSurveyStatuses] = useState<Record<number, boolean>>(
    {}
  );
  const [testerCampaignData, setTesterCampaignData] = useState<any>(null);
  const [surveys, setSurveys] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  const loadData = useCallback(async () => {
    setError(null);
    setIsLoading(true);
    try {
      const testerCampaign = await callGetStatusCampaignsByUser(
        campaignId,
        userId
      );
      setTesterCampaignData(testerCampaign);
      console.log("Tester campaign data:", testerCampaignData);
      const res = await callGetCampaign(campaignId);
      setCampaign(res.data);
      const resSurveys = await callGetSurveysByCampaign(campaignId);
      setSurveys(resSurveys.data || []);
      const statusMap: Record<number, boolean> = {};
      for (const s of resSurveys.data) {
        try {
          const resStatus = await callGetTesterSurveyStatus(userId, s.surveyId);
          console.log("Survey status response:", resStatus);
          statusMap[s.surveyId] = resStatus.data.completed;
        } catch (err) {
          console.warn("Failed to get survey status:", err);
        }
      }
      setSurveyStatuses(statusMap);
      console.log("Survey statuses:", surveyStatuses);
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
      {/* Nếu campaign không phải loại Web → hiện Upload Video */}
      {campaign?.campaignType?.name !== "Web" && (
        <Box sx={{ mb: 5 }}>
          <Typography variant="h5" fontWeight="bold" sx={{ mb: 2 }}>
            Upload your test video
          </Typography>
          <FileUploadVideo
            campaignId={campaignId!}
            initialVideoUrl={testerCampaignData?.data?.uploadLink}
          />
        </Box>
      )}

      {/* Header */}
      <Stack
        direction="row"
        justifyContent="space-between"
        alignItems="center"
        sx={{ mb: 3 }}
      >
        <Typography variant="h5" fontWeight="bold">
          Bug Report & Test Execution
        </Typography>
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
          {parse(campaign.description) || "No campaign description available."}
        </Typography>
      </Box>

      {/* Danh sách Use Case / Test Case */}
      <TestCaseExecution
        useCases={campaign?.useCases || []}
        campaignId={Number(campaignId)}
      />

      {/* 📋 Danh sách Survey */}
      <Box sx={{ mt: 6 }}>
        <Typography
          variant="h6"
          fontWeight="bold"
          sx={{ mb: 2, color: "primary.main" }}
        >
          User Feedback Surveys
        </Typography>

        {surveys.length === 0 ? (
          <Alert severity="info">No surveys available for this campaign.</Alert>
        ) : (
          <Grid container spacing={2}>
            {surveys.map((survey) => (
              <Grid item xs={12} sm={6} md={4} key={survey.surveyId}>
                <Card
                  sx={{
                    borderRadius: 2,
                    boxShadow: 3,
                    transition: "transform 0.2s",
                    "&:hover": { transform: "scale(1.03)" },
                  }}
                >
                  <CardContent>
                    <Typography variant="h6" fontWeight="bold">
                      {survey.surveyName}
                    </Typography>
                    <Typography
                      variant="subtitle2"
                      color="text.secondary"
                      sx={{ mt: 0.5 }}
                    >
                      {survey.subTitle}
                    </Typography>

                    <Box
                      sx={{
                        mt: 1.5,
                        fontSize: "0.9rem",
                        color: "text.secondary",
                      }}
                      dangerouslySetInnerHTML={{
                        __html: survey.description || "",
                      }}
                    />

                    <Typography
                      variant="body2"
                      color="text.secondary"
                      sx={{ mt: 1 }}
                    >
                      ⏰ {new Date(survey.startDate).toLocaleDateString()} →{" "}
                      {new Date(survey.endDate).toLocaleDateString()}
                    </Typography>
                  </CardContent>

                  <CardActions>
                    {surveyStatuses[survey.surveyId] ? (
                      <Button
                        fullWidth
                        variant="outlined"
                        color="success"
                        disabled
                      >
                        Completed
                      </Button>
                    ) : (
                      <Button
                        component="a"
                        href={`/testflow/${campaignId}/view_question/${survey.surveyId}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        fullWidth
                        variant="contained"
                        size="small"
                      >
                        Start Survey
                      </Button>
                    )}
                  </CardActions>
                </Card>
              </Grid>
            ))}
          </Grid>
        )}
      </Box>

      {/* Tạo báo cáo lỗi mới */}
      <Box sx={{ mt: 5 }}>
        <CreateBugReport campaignId={Number(campaignId)} onSuccess={loadData} />
      </Box>

      {/* Nút quay lại */}
      <Stack direction="row" justifyContent="flex-end" sx={{ mt: 5 }}>
        <Button
          variant="contained"
          color="secondary"
          onClick={() =>
            window.location.assign(`/home/detail/user/${campaignId}`)
          }
        >
          ← Back to Campaign
        </Button>
      </Stack>
    </Container>
  );
}
