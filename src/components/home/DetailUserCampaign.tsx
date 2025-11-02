import React from "react";
import {
  Box,
  Button,
  Container,
  Grid,
  Typography,
  Chip,
  Divider,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
  TextField,
} from "@mui/material";

import { Accordion, AccordionSummary, AccordionDetails } from "@mui/material";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";

// 🧩 ICONS
import AccessTimeIcon from "@mui/icons-material/AccessTime";
import CategoryIcon from "@mui/icons-material/Category";
import TimerIcon from "@mui/icons-material/Timer";
import MonetizationOnIcon from "@mui/icons-material/MonetizationOn";
import PublicIcon from "@mui/icons-material/Public";
import LockIcon from "@mui/icons-material/Lock";
import { useNavigate, useParams } from "react-router-dom";
import {
  callApplyCampaign,
  callGetCampaign,
  callGetStatusCampaignsByUser,
  callGetTesterCampaignStatus,
} from "../../config/api";
import { useAppSelector } from "../../redux/hooks";
import UseCaseSection from "./UseCaseSection";
import ScreenRecorder from "./ScreenRecorder";
import parse from "html-react-parser";
import { formatChatTimeEmail } from "../../util/timeFormatter";
import FileUploadVideo from "./FileUploadVideo";

export default function CampaignDetailUser() {
  const { campaignId } = useParams();
  const [campaign, setCampaign] = React.useState(null);
  const [TesterCampaign, setTesterCampaign] = React.useState(null);
  const [isLoading, setIsLoading] = React.useState(true);
  const [error, setError] = React.useState<Error | null>(null);
  const [open, setOpen] = React.useState(false);
  const [note, setNote] = React.useState("");
  const [joined, setJoined] = React.useState(false);
  const user = useAppSelector((state) => state.account.user);

  const navigate = useNavigate();

  const loadData = React.useCallback(async () => {
    setError(null);
    setIsLoading(true);

    try {
      const showData = await callGetCampaign(campaignId);

      setCampaign(showData.data);
      console.log("userId, campaignId", user?.id, campaignId);
      const testerCampaignData = await callGetStatusCampaignsByUser(
        campaignId || "",
        user?.id || 0
      );
      setTesterCampaign(testerCampaignData.data);
      console.log("TesterCampaign data:", testerCampaignData.data);
    } catch (showDataError) {
      setError(showDataError as Error);
    }
    setIsLoading(false);
  }, [campaignId]);
  console.log(campaign);
  console.log("testercampaign", TesterCampaign);

  const checkUserStatus = React.useCallback(async () => {
    if (!user?.id || !campaignId) return;
    try {
      const res = await callGetTesterCampaignStatus(user.id, campaignId);
      console.log("Tester status:", res.data);
      if (res.data.exists) {
        setJoined(true); // đã tham gia campaign
      }
    } catch (err) {
      console.error("Lỗi khi kiểm tra trạng thái:", err);
    }
  }, [user, campaignId]);

  React.useEffect(() => {
    loadData();
    checkUserStatus();
  }, [loadData]);
  console.log(campaign);

  return (
    <Container maxWidth="lg" sx={{ py: 8 }}>
      <Grid container spacing={6} alignItems="center">
        <Grid item size={{ xs: 12, sm: 12, lg: 12 }}>
          <Typography
            variant="h4"
            component="h1"
            fontWeight="bold"
            gutterBottom
          >
            {campaign?.title || "Tên chiến dịch chưa có"}
          </Typography>

          {/* Mô tả */}
          <Typography
            variant="body1"
            color="text.secondary"
            paragraph
            sx={{ mb: 3 }}
          >
            {campaign
              ? parse(campaign?.description)
              : "Chưa có mô tả cho chiến dịch này."}
          </Typography>

          {/* --- Thông tin chiến dịch --- */}
          <Box
            sx={{
              backgroundColor: (theme) =>
                theme.palette.mode === "light" ? "#f9f9fb" : "#1e1e1e",
              borderRadius: 3,
              p: 3,
              mb: 4,
              boxShadow: 1,
              width: "100%",
            }}
          >
            <Typography
              variant="h6"
              fontWeight="bold"
              sx={{ mb: 2, color: "primary.main" }}
            >
              Thông tin chiến dịch
            </Typography>

            <Grid
              container
              spacing={2}
              sx={{ display: "flex", justifyContent: "space-between" }}
            >
              {/* Thời gian */}
              <Grid item xs={12} sm={6}>
                <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                  <AccessTimeIcon color="action" />
                  <Typography variant="body2" sx={{ fontWeight: 500 }}>
                    Thời gian:
                  </Typography>
                </Box>
                <Typography
                  variant="body2"
                  color="text.secondary"
                  sx={{ ml: 4 }}
                >
                  {campaign?.startDate && campaign?.endDate
                    ? `${formatChatTimeEmail(
                        campaign.startDate
                      )} → ${formatChatTimeEmail(campaign.endDate)}`
                    : "Chưa cập nhật"}
                </Typography>
              </Grid>

              {/* Loại chiến dịch */}
              <Grid item xs={12} sm={6}>
                <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                  <CategoryIcon color="action" />
                  <Typography variant="body2" sx={{ fontWeight: 500 }}>
                    Loại chiến dịch:
                  </Typography>
                </Box>
                <Typography
                  variant="body2"
                  color="text.secondary"
                  sx={{ ml: 4 }}
                >
                  {campaign?.campaignType?.name || "Chưa xác định"}
                </Typography>
              </Grid>

              {/* Thời lượng ước tính */}
              <Grid item xs={12} sm={6}>
                <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                  <TimerIcon color="action" />
                  <Typography variant="body2" sx={{ fontWeight: 500 }}>
                    Thời lượng ước tính:
                  </Typography>
                </Box>
                <Typography
                  variant="body2"
                  color="text.secondary"
                  sx={{ ml: 4 }}
                >
                  {campaign?.estimatedTime || "Không có"}
                </Typography>
              </Grid>

              {/* Phần thưởng */}
              <Grid item xs={12} sm={6}>
                <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                  <MonetizationOnIcon color="action" />
                  <Typography variant="body2" sx={{ fontWeight: 500 }}>
                    Phần thưởng:
                  </Typography>
                </Box>
                <Typography
                  variant="body2"
                  color="text.secondary"
                  sx={{ ml: 4 }}
                >
                  {campaign?.rewardValue
                    ? `${campaign.rewardValue} $ `
                    : "Chưa có phần thưởng"}
                </Typography>
              </Grid>

              {/* Công khai */}
              {/* <Grid item xs={12} sm={6}>
                <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                  {campaign?.isPublic ? (
                    <PublicIcon color="success" />
                  ) : campaign?.isPublic === false ? (
                    <LockIcon color="warning" />
                  ) : (
                    <LockIcon color="disabled" />
                  )}
                  <Typography variant="body2" sx={{ fontWeight: 500 }}>
                    Công khai:
                  </Typography>
                </Box>
                <Typography
                  variant="body2"
                  color="text.secondary"
                  sx={{ ml: 4 }}
                >
                  {campaign?.isPublic === true
                    ? "Công khai"
                    : campaign?.isPublic === false
                    ? "Riêng tư"
                    : "Chưa xác định"}
                </Typography>
              </Grid> */}
            </Grid>
          </Box>
        </Grid>

        {/* ======= BÊN PHẢI: HÌNH ẢNH ======= */}
        <Grid item size={{ xs: 12, sm: 12, lg: 12 }} alignItems="center">
          <Box
            sx={{
              position: "relative",
              borderRadius: 3,
              overflow: "hidden",
              boxShadow: "0px 4px 16px rgba(0,0,0,0.15)",
            }}
          >
            <Box
              component="img"
              src={
                campaign?.bannerUrl
                  ? `http://localhost:8081/storage/project-banners/${campaign.bannerUrl}`
                  : "https://picsum.photos/800/450?random=2"
              }
              alt={campaign?.campaignName || "Campaign Banner"}
              sx={{
                width: "100%",
                height: "auto",
                borderRadius: 3,
                objectFit: "cover",
              }}
            />

            {/* overlay gradient */}
            <Box
              sx={{
                position: "absolute",
                bottom: 0,
                left: 0,
                right: 0,
                height: "40%",
                background:
                  "linear-gradient(to top, rgba(0,0,0,0.55), rgba(0,0,0,0))",
              }}
            />

            {/* Tên project nổi trên ảnh */}
            <Typography
              variant="h6"
              sx={{
                position: "absolute",
                bottom: 16,
                left: 20,
                color: "#fff",
                fontWeight: 600,
                textShadow: "0 2px 6px rgba(0,0,0,0.6)",
              }}
            >
              {campaign?.title || "Campaign Name"}
            </Typography>
          </Box>
        </Grid>
        <Box
          sx={{
            backgroundColor: (theme) =>
              theme.palette.mode === "light" ? "#f9f9fb" : "#1e1e1e",
            borderRadius: 3,
            p: 3,
            mb: 4,
            boxShadow: 1,
            width: "100%",
          }}
        >
          <Typography
            variant="h6"
            fontWeight="bold"
            sx={{ mb: 2, color: "primary.main" }}
          >
            Hướng dẫn sử dụng
          </Typography>

          <Grid container spacing={2}>
            {/* Mô tả */}
            <Typography
              variant="body1"
              color="text.secondary"
              paragraph
              sx={{ mb: 3 }}
            >
              {campaign
                ? parse(campaign?.instructions)
                : "Chưa có hướng dẫn cho chiến dịch này."}
            </Typography>
          </Grid>
        </Box>
      </Grid>
      {/* --- Use Cases (Dropdown style) --- */}

      <UseCaseSection useCases={campaign?.useCases || []} />
      {/* --- Nếu tester đã upload video --- */}
      {/* --- Nếu loại campaign KHÔNG PHẢI Web → hiển thị upload video --- */}
      {campaign?.campaignType?.name !== "Web" ? (
        TesterCampaign?.uploadLink ? (
          <Box sx={{ mt: 4, textAlign: "center" }}>
            <Typography variant="h6" sx={{ mb: 2 }}>
              🎥 Video bạn đã upload:
            </Typography>

            <video
              controls
              src={TesterCampaign.uploadLink}
              style={{
                width: "100%",
                maxWidth: "1200px",
                borderRadius: "12px",
                boxShadow: "0 4px 12px rgba(0,0,0,0.2)",
              }}
            />

            <Box sx={{ mt: 3 }}>
              <Button
                variant="contained"
                color="success"
                onClick={() => navigate(`/testflow/${campaignId}/bug_report`)}
              >
                Go to Bug Report
              </Button>
            </Box>
          </Box>
        ) : (
          <Box sx={{ mt: 4, textAlign: "center" }}>
            <Button
              variant="contained"
              color="primary"
              onClick={() => navigate(`/testflow/${campaignId}/bug_report`)}
            >
              Start the test
            </Button>
          </Box>
        )
      ) : // === Nếu là Web campaign → flow test thông thường ===
      TesterCampaign?.uploadLink ? (
        <Box sx={{ mt: 4, textAlign: "center" }}>
          <Typography variant="h6" sx={{ mb: 2 }}>
            🎥 Video bạn đã upload:
          </Typography>

          <video
            controls
            src={TesterCampaign.uploadLink}
            style={{
              width: "100%",
              maxWidth: "1200px",
              borderRadius: "12px",
              boxShadow: "0 4px 12px rgba(0,0,0,0.2)",
            }}
          />

          <Box sx={{ mt: 3 }}>
            <Button
              variant="contained"
              color="success"
              onClick={() => navigate(`/testflow/${campaignId}/bug_report`)}
            >
              Go to Bug Report
            </Button>
          </Box>
        </Box>
      ) : (
        <Box sx={{ mt: 4, textAlign: "center" }}>
          <Button
            variant="contained"
            color="primary"
            onClick={() => navigate(`/testflow/${campaignId}/tips`)}
          >
            Start the test
          </Button>
        </Box>
      )}

      {/* <ScreenRecorder /> */}
    </Container>
  );
}
