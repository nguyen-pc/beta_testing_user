import React from "react";
import {
  Avatar,
  AvatarGroup,
  Box,
  Button,
  Card,
  CardContent,
  CardMedia,
  Container,
  Grid,
  Typography,
  styled,
  Chip,
} from "@mui/material";
import { useNavigate } from "react-router-dom";
import { callGetCampaignByUser } from "../../../config/api";
import { useAppSelector } from "../../../redux/hooks";

// 🎨 Styled components
const StyledCard = styled(Card)(({ theme }) => ({
  display: "flex",
  flexDirection: "column",
  padding: 0,
  height: "100%",
  backgroundColor: (theme.vars || theme).palette.background.paper,
  "&:hover": {
    backgroundColor: "transparent",
    cursor: "pointer",
  },
  "&:focus-visible": {
    outline: "3px solid",
    outlineColor: "hsla(210, 98%, 48%, 0.5)",
    outlineOffset: "2px",
  },
}));

const StyledCardContent = styled(CardContent)({
  display: "flex",
  flexDirection: "column",
  gap: 4,
  padding: 16,
  flexGrow: 1,
  "&:last-child": {
    paddingBottom: 16,
  },
});

const StyledTypography = styled(Typography)({
  display: "-webkit-box",
  WebkitBoxOrient: "vertical",
  WebkitLineClamp: 2,
  overflow: "hidden",
  textOverflow: "ellipsis",
});

// 👤 Author Component
function Author({ name, date }: { name: string; date?: string }) {
  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "row",
        gap: 2,
        alignItems: "center",
        justifyContent: "space-between",
        padding: "16px",
      }}
    >
      <Box
        sx={{
          display: "flex",
          flexDirection: "row",
          gap: 1,
          alignItems: "center",
        }}
      >
        <AvatarGroup max={1}>
          <Avatar alt={name} />
        </AvatarGroup>
        <Typography variant="caption">{name}</Typography>
      </Box>
      {date && (
        <Typography variant="caption" color="text.secondary">
          {new Date(date).toLocaleDateString()}
        </Typography>
      )}
    </Box>
  );
}

// 💡 Main Component
export default function CampaignList() {
  const [campaigns, setCampaigns] = React.useState<any[]>([]);
  const navigate = useNavigate();
  const user = useAppSelector((state) => state.account.user);

  // Gọi API lấy danh sách campaign đã tham gia
  const fetchCampaigns = async () => {
    try {
      const res = await callGetCampaignByUser(user.id);
      setCampaigns(res.data);
      console.log("✅ Campaigns fetched:", res.data);
    } catch (err) {
      console.error("❌ Error fetching campaigns:", err);
    }
  };

  React.useEffect(() => {
    if (user?.id) fetchCampaigns();
  }, [user]);

  const handleDetailClick = (campaignId: number, status: string) => {
    if (status === "APPROVED") {
      navigate(`/home/detail/user/${campaignId}`);
    } else {
      alert(
        "❗ Bạn chỉ có thể xem chi tiết khi chiến dịch được phê duyệt (APPROVED)."
      );
    }
  };

  return (
    <Container maxWidth="lg" sx={{ py: 5 }}>
      <Box>
        <Typography variant="h5" component="h2" sx={{ mb: 3 }}>
          My Campaigns Application
        </Typography>

        <Grid container spacing={2}>
          {campaigns && campaigns.length > 0 ? (
            campaigns.map((item, index) => {
              const campaign = item.campaign;
              return (
                <Grid item xs={12} sm={6} md={4} key={item.id}>
                  <StyledCard
                    onClick={() => handleDetailClick(campaign.id, item.status)}
                    variant="outlined"
                    tabIndex={0}
                    sx={{ maxWidth: 360, minWidth: 360, px: "auto" }}
                  >
                    <CardMedia
                      component="img"
                      alt={campaign.title}
                      image={
                        campaign.image ||
                        "https://images.unsplash.com/photo-1581090700227-1e37b190418e?auto=format&fit=crop&w=900&q=80"
                      }
                      sx={{
                        height: 180,
                        objectFit: "cover",
                      }}
                    />

                    <StyledCardContent>
                      <Typography variant="h6" component="div" gutterBottom>
                        {campaign.title}
                      </Typography>
                      <StyledTypography
                        variant="body2"
                        color="text.secondary"
                        gutterBottom
                        dangerouslySetInnerHTML={{
                          __html: campaign.description || "No description",
                        }}
                      />
                      <Box
                        sx={{
                          display: "flex",
                          alignItems: "center",
                          gap: 1,
                          mt: 1,
                        }}
                      >
                        <Chip
                          size="small"
                          label={item.status}
                          color={
                            item.status === "APPROVED"
                              ? "success"
                              : item.status === "PENDING"
                              ? "warning"
                              : "default"
                          }
                        />
                        {campaign.campaignTypeName && (
                          <Chip
                            size="small"
                            label={campaign.campaignTypeName}
                            color="info"
                          />
                        )}
                      </Box>
                    </StyledCardContent>

                    <Author
                      name={campaign.createdBy || "Unknown"}
                      date={campaign.startDate}
                    />
                  </StyledCard>
                </Grid>
              );
            })
          ) : (
            <Typography color="text.secondary" sx={{ p: 3 }}>
              You haven't joined any campaigns yet.
            </Typography>
          )}
        </Grid>
      </Box>
    </Container>
  );
}
