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
  callGetTesterCampaignStatus,
} from "../../config/api";
import { useAppSelector } from "../../redux/hooks";
import UseCaseSection from "./UseCaseSection";
import ScreenRecorder from "./ScreenRecorder";

export default function CampaignDetailUser() {
  const { campaignId } = useParams();
  const [campaign, setCampaign] = React.useState(null);
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
    } catch (showDataError) {
      setError(showDataError as Error);
    }
    setIsLoading(false);
  }, [campaignId]);
  console.log(campaign);

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
        <Grid item xs={12} md={6}>
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
            {campaign?.description || "Chưa có mô tả cho chiến dịch này."}
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

            <Grid container spacing={2}>
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
                    ? `${campaign.startDate} → ${campaign.endDate}`
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
                  {campaign?.rewardValue && campaign?.rewardType
                    ? `${campaign.rewardValue} ${campaign.rewardType}`
                    : "Chưa có phần thưởng"}
                </Typography>
              </Grid>

              {/* Công khai */}
              <Grid item xs={12} sm={6}>
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
              </Grid>
            </Grid>
          </Box>
        </Grid>

        {/* ======= BÊN PHẢI: HÌNH ẢNH ======= */}
        <Grid item xs={12} md={6}>
          <Box
            component="img"
            src="https://images.unsplash.com/photo-1581090700227-1e37b190418e?auto=format&fit=crop&w=900&q=80"
            alt="Campaign Illustration"
            sx={{
              width: "230px",
              borderRadius: 3,
              boxShadow: 4,
              objectFit: "cover",
              alignItems: "center",
            }}
          />
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
              {campaign?.instructions ||
                "Chưa có hướng dẫn cho chiến dịch này."}
            </Typography>
          </Grid>
        </Box>
      </Grid>
      {/* --- Use Cases (Dropdown style) --- */}

      <UseCaseSection useCases={campaign?.useCases || []} />
      <Button
        variant="contained"
        onClick={() => navigate(`/testflow/${campaignId}/tips`)}
      >
        Start the test
      </Button>
      {/* <ScreenRecorder /> */}
    </Container>
  );
}
