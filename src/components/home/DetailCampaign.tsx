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

// 🧩 ICONS
import AccessTimeIcon from "@mui/icons-material/AccessTime";
import CategoryIcon from "@mui/icons-material/Category";
import TimerIcon from "@mui/icons-material/Timer";
import MonetizationOnIcon from "@mui/icons-material/MonetizationOn";
import PublicIcon from "@mui/icons-material/Public";
import LockIcon from "@mui/icons-material/Lock";
import { useParams } from "react-router-dom";
import {
  callApplyCampaign,
  callGetCampaign,
  callGetTesterCampaignStatus,
} from "../../config/api";
import { useAppSelector } from "../../redux/hooks";
import parse from "html-react-parser";
import { formatChatTimeEmail } from "../../util/timeFormatter";

export default function CampaignDetail() {
  const { campaignId } = useParams();
  const [campaign, setCampaign] = React.useState(null);
  const [isLoading, setIsLoading] = React.useState(true);
  const [error, setError] = React.useState<Error | null>(null);
  const [open, setOpen] = React.useState(false);
  const [openLogin, setOpenLogin] = React.useState(false);
  const [note, setNote] = React.useState("");
  const [joined, setJoined] = React.useState(false);
  const user = useAppSelector((state) => state.account.user);

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

  // 🧩 🔹 Kiểm tra trạng thái user trong campaign
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

  const handleClickOpen = () => {
    if (!user?.id) {
      setOpenLogin(true);
      return;
    }
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const handleConfirmJoin = async () => {
    const data = {
      userId: user.id,
      campaignId: Number(campaignId),
      note,
    };
    console.log("📤 Submit join data:", data);
    setJoined(true);
    await callApplyCampaign(data);
    // Notifications.showNotification({
    //   title: "Success",
    //   message: "You have successfully joined the campaign!",
    //   color: "green",
    // });
    handleClose();
  };
  return (
    <Container maxWidth="lg" sx={{ py: 8 }}>
      <Grid container spacing={6} alignItems="center">
        {/* ======= BÊN TRÁI: NỘI DUNG CHIẾN DỊCH ======= */}
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
              variant="h4"
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
        <Grid item size={{ xs: 12, sm: 12, lg: 12 }}>
          {/* Trạng thái */}
          {/* <Chip
            label={getStatusLabel(c.status)}
            color={
              c.status === "1"
                ? "success"
                : c.status === "0"
                ? "warning"
                : "default"
            }
            sx={{ mb: 2 }}
          /> */}

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
              sx={{ display: "flex", justifyContent: "space-between" }}
              spacing={2}
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
                    ? `${campaign.rewardValue}$`
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

          {/* Nút hành động */}
          <Box sx={{ display: "flex", gap: 2, mt: 4 }}>
            <Button
              onClick={handleClickOpen}
              variant="outlined"
              size="large"
              disabled={joined} // 🔹 disable nếu đã tham gia
            >
              {joined ? "Đã tham gia" : "Tham gia ngay"}
            </Button>
            <Button variant="outlined" size="large">
              Xem thêm
            </Button>
          </Box>
        </Grid>

        <Dialog open={open} onClose={handleClose} fullWidth maxWidth="sm">
          <DialogTitle>Are you sure you want to join?</DialogTitle>
          <DialogContent>
            <Typography variant="body2" sx={{ mb: 1 }}>
              By joining this campaign, you agree that:
            </Typography>
            <ul style={{ marginLeft: 16 }}>
              <li>
                - Your participation data may be used for research and quality
                purposes.
              </li>
              <li>- You’ll follow testing guidelines and deadlines.</li>
              <li>- Violations may lead to removal from the campaign.</li>
              <li>- Rewards (if any) follow official campaign rules.</li>
            </ul>

            {/* Ô nhập ghi chú */}
            <TextField
              label="Add a note (optional)"
              fullWidth
              multiline
              minRows={2}
              value={note}
              onChange={(e) => setNote(e.target.value)}
              sx={{ mt: 2 }}
            />
          </DialogContent>
          <DialogActions>
            <Button onClick={handleClose}>Cancel</Button>
            <Button
              variant="contained"
              color="primary"
              onClick={handleConfirmJoin}
            >
              Confirm & Join
            </Button>
          </DialogActions>
        </Dialog>

        {/* DIALOG CHƯA ĐĂNG NHẬP */}
        <Dialog
          open={openLogin}
          onClose={() => setOpenLogin(false)}
          fullWidth
          maxWidth="xs"
        >
          <DialogTitle>Bạn chưa đăng nhập</DialogTitle>
          <DialogContent>
            <DialogContentText>
              Bạn cần đăng nhập để tham gia chiến dịch này.
            </DialogContentText>
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setOpenLogin(false)}>Hủy</Button>
            <Button
              variant="contained"
              onClick={() => {
                const currentUrl =
                  window.location.pathname + window.location.search;
                window.location.href = `/signin?redirect=${encodeURIComponent(
                  currentUrl
                )}`;
              }}
            >
              Đăng nhập ngay
            </Button>
          </DialogActions>
        </Dialog>
      </Grid>
    </Container>
  );
}
