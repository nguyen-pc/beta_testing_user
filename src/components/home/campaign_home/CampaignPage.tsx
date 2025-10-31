import React, { useEffect, useState } from "react";
import {
  Box,
  Container,
  Typography,
  Grid,
  CircularProgress,
  Button,
} from "@mui/material";
import CampaignCarouselSection from "./CampaignCarouselSection";
import {
  callGetCampaign,
  callGetCampaignActive,
  callGetCampaignUpcoming,
  callGetRecommendedCampaigns,
  callGetUserProfile,
} from "../../../config/api";
import { useAppSelector } from "../../../redux/hooks";
import { useNavigate } from "react-router-dom";

const CampaignPage = () => {
  const user = useAppSelector((state) => state.account.user);
  const navigate = useNavigate();

  const [activeCampaigns, setActiveCampaigns] = useState<any[]>([]);
  const [upcomingCampaigns, setUpcomingCampaigns] = useState<any[]>([]);
  const [recommendedCampaigns, setRecommendedCampaigns] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [profile, setProfile] = useState<any>(null);

  // 🧩 Gọi API lấy profile
  useEffect(() => {
    const fetchProfile = async () => {
      if (!user?.id) return;
      try {
        const res = await callGetUserProfile(user.id);
        setProfile(res.data || null);
      } catch (error: any) {
        console.warn("⚠️ No profile found for this user");
        setProfile(null);
      }
    };
    fetchProfile();
  }, [user]);

  // 🧩 Gọi 2 API campaign song song
  useEffect(() => {
    const fetchCampaigns = async () => {
      try {
        setLoading(true);
        const [activeRes, upcomingRes] = await Promise.all([
          callGetCampaignActive(),
          callGetCampaignUpcoming(),
        ]);

        setActiveCampaigns(activeRes.data?.result || []);
        setUpcomingCampaigns(upcomingRes.data?.result || []);
      } catch (error) {
        console.error("Error fetching campaigns:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchCampaigns();
  }, []);

  // 🧩 Gọi API lấy danh sách campaign được đề xuất
  useEffect(() => {
    const fetchRecommendedCampaigns = async () => {
      if (!user?.id) return;
      try {
        const res = await callGetRecommendedCampaigns(user.id);
        const recommended = res.data || [];
        if (!Array.isArray(recommended) || recommended.length === 0) {
          setRecommendedCampaigns([]);
          return;
        }

        // Gọi song song để lấy thông tin chi tiết từng campaign
        const detailPromises = recommended.map((item: any) =>
          callGetCampaign(item.campaignId)
            .then((res) => res.data)
            .catch(() => null)
        );

        const campaignDetails = await Promise.all(detailPromises);

        // Lọc bỏ null và những campaign đã hết hạn
        const now = new Date().toISOString();
        const validCampaigns = campaignDetails.filter(
          (c: any) => c && c.endDate && c.endDate > now
        );

        setRecommendedCampaigns(validCampaigns);
      } catch (error) {
        console.error("Error fetching recommended campaigns:", error);
      }
    };
    fetchRecommendedCampaigns();
  }, [user]);

  if (loading)
    return (
      <Box sx={{ display: "flex", justifyContent: "center", mt: 10 }}>
        <CircularProgress />
      </Box>
    );

  return (
    <Box>
      {/* === ACTIVE CAMPAIGNS === */}
      {activeCampaigns.length > 0 && (
        <CampaignCarouselSection
          title="Recent Campaigns"
          campaigns={activeCampaigns}
        />
      )}

      {/* === UPCOMING CAMPAIGNS === */}
      {upcomingCampaigns.length > 0 && (
        <CampaignCarouselSection
          title="Upcoming Campaigns"
          campaigns={upcomingCampaigns}
        />
      )}

      {/* === STATS / ABOUT SECTION === */}
      <Box
        sx={{
          background: "#f5f8ff",
          py: 10,
          textAlign: "center",
          mt: 8,
        }}
      >
        <Typography variant="h4" fontWeight={700}>
          When Testers <span style={{ color: "#1976d2" }}>Help Companies</span>,
          Quality Happens
        </Typography>
        <Typography
          variant="body1"
          color="text.secondary"
          sx={{ maxWidth: 600, mx: "auto", mt: 2 }}
        >
          BetaTesting connects companies with a global tester community to find
          bugs, improve usability, and deliver better products.
        </Typography>

        <Grid
          container
          spacing={3}
          justifyContent="center"
          sx={{ mt: 5, maxWidth: 800, mx: "auto" }}
        >
          {[
            { label: "Years of Experience", value: "5+" },
            { label: "Active Testers", value: "25k+" },
            { label: "Completed Campaigns", value: "400+" },
          ].map((stat, idx) => (
            <Grid item xs={12} sm={4} key={idx}>
              <Typography variant="h4" fontWeight={700} color="primary">
                {stat.value}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                {stat.label}
              </Typography>
            </Grid>
          ))}
        </Grid>
      </Box>

      {/* === RECOMMEND CAMPAIGNS === */}
      <Container sx={{ py: 8 }}>
        {recommendedCampaigns.length > 0 ? (
          <CampaignCarouselSection
            title="Recommend Campaigns"
            campaigns={recommendedCampaigns}
          />
        ) : (
          <Typography color="text.secondary">No campaigns found.</Typography>
        )}

        {!profile && (
          <Box textAlign="center" sx={{ mt: 5 }}>
            <Typography variant="body1" color="text.secondary" mb={2}>
              To receive personalized campaign recommendations, please create
              your tester profile.
            </Typography>
            <Button
              variant="contained"
              color="primary"
              size="large"
              onClick={() => navigate("/profile")}
            >
              Create Profile
            </Button>
          </Box>
        )}
      </Container>
    </Box>
  );
};

export default CampaignPage;
