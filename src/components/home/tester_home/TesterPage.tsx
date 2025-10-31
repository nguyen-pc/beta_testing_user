import React, { useEffect, useState } from "react";
import {
  Box,
  Container,
  Typography,
  Button,
  Grid,
  Card,
  CardContent,
} from "@mui/material";
import { motion } from "framer-motion";
import CampaignCarouselSection from "../campaign_home/CampaignCarouselSection";
import { useNavigate } from "react-router-dom";
import { useAppSelector } from "../../../redux/hooks";
import { callGetCampaignActive } from "../../../config/api";

export default function TesterPage() {
  const user = useAppSelector((state) => state.account.user);
  const [activeCampaigns, setActiveCampaigns] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCampaigns = async () => {
      try {
        setLoading(true);
        const [activeRes] = await Promise.all([callGetCampaignActive()]);

        setActiveCampaigns(activeRes.data?.result || []);
      } catch (error) {
        console.error("Error fetching campaigns:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchCampaigns();
  }, []);

  const navigate = useNavigate();
  return (
    <Box className="bg-white text-gray-800">
      {/* === HERO SECTION === */}
      <Box
        className="bg-gradient-to-b from-blue-50 to-white"
        sx={{ py: 10, textAlign: "center" }}
      >
        <Container maxWidth="md">
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <Typography variant="h3" fontWeight={700}>
              Become a <span className="text-blue-600">Beta Tester</span>
            </Typography>
            <Typography variant="h6" color="text.secondary" sx={{ mt: 2 }}>
              Join real-world testing campaigns, explore new apps early, and get
              rewarded for your valuable feedback.
            </Typography>
            <Button
              onClick={() => navigate("/home/campaigns")}
              variant="contained"
              color="primary"
              sx={{
                mt: 4,
                px: 4,
                py: 1.5,
                borderRadius: "9999px",
                textTransform: "none",
              }}
            >
              Start Testing Now
            </Button>
          </motion.div>
        </Container>
      </Box>

      {/* === HOW IT WORKS === */}
      <Container maxWidth="lg" sx={{ py: 10 }}>
        <Typography variant="h4" fontWeight={700} align="center" mb={6}>
          How It Works
        </Typography>
        <Grid container spacing={4}>
          {[
            {
              step: "1️⃣",
              title: "Sign Up & Verify Profile",
              desc: "Create your tester account and complete your profile to get matched with the right campaigns.",
            },
            {
              step: "2️⃣",
              title: "Browse & Apply for Campaigns",
              desc: "Explore active campaigns that match your skills and apply with one click.",
            },
            {
              step: "3️⃣",
              title: "Wait for Approval & Access Dashboard",
              desc: "Once approved by the company, view campaign details and assigned test cases in your dashboard.",
            },
            {
              step: "4️⃣",
              title: "Test, Report & Earn Rewards",
              desc: "Execute test scenarios, submit bug reports and surveys, then receive your reward upon completion.",
            },
          ].map((item, i) => (
            <Grid item xs={12} md={4} key={i}>
              <motion.div
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.7, delay: i * 0.2 }}
              >
                <Card className="shadow-lg hover:shadow-xl transition-shadow duration-300 rounded-2xl w-[500px] h-[250px]">
                  <CardContent sx={{ textAlign: "center", py: 5 }}>
                    <Typography variant="h2" color="primary" fontWeight={700}>
                      {item.step}
                    </Typography>
                    <Typography variant="h6" fontWeight={600} sx={{ mt: 2 }}>
                      {item.title}
                    </Typography>
                    <Typography color="text.secondary" sx={{ mt: 1 }}>
                      {item.desc}
                    </Typography>
                  </CardContent>
                </Card>
              </motion.div>
            </Grid>
          ))}
        </Grid>
      </Container>

      {/* === FEATURES === */}
      <Box className="bg-blue-50" sx={{ py: 10 }}>
        <Container maxWidth="lg">
          <Typography variant="h4" fontWeight={700} align="center" mb={6}>
            Why Become a Tester?
          </Typography>
          <Grid container spacing={4}>
            {[
              {
                title: "Early Access",
                desc: "Try new apps and technologies before they launch publicly.",
              },
              {
                title: "Earn Rewards",
                desc: "Get paid for your time, insights, and detailed bug reports.",
              },
              {
                title: "Build Experience",
                desc: "Develop testing and analytical skills used in the software industry.",
              },
              {
                title: "Community",
                desc: "Connect with other testers and share insights together.",
              },
            ].map((f, i) => (
              <Grid item xs={12} sm={6} md={3} key={i}>
                <motion.div
                  initial={{ opacity: 0, y: 40 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.7, delay: i * 0.2 }}
                >
                  <Card className="rounded-2xl shadow-md hover:shadow-xl transition duration-300 w-[500px] h-[150px]">
                    <CardContent sx={{ textAlign: "center", py: 4 }}>
                      <Typography variant="h6" fontWeight={700}>
                        {f.title}
                      </Typography>
                      <Typography color="text.secondary" sx={{ mt: 1 }}>
                        {f.desc}
                      </Typography>
                    </CardContent>
                  </Card>
                </motion.div>
              </Grid>
            ))}
          </Grid>
        </Container>
      </Box>

      {/* === CAMPAIGN CAROUSEL === */}
      <Box sx={{ py: 10 }}>
        <CampaignCarouselSection
          title="Featured Campaigns"
          campaigns={activeCampaigns}
        />
      </Box>

      {/* === CALL TO ACTION === */}
      {!user.id ? (
        <Box
          className="bg-gradient-to-r from-blue-500 to-blue-300  text-center"
          sx={{ py: 10 }}
        >
          <Container maxWidth="sm">
            <motion.div
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7 }}
            >
              <Typography variant="h4" fontWeight={700}>
                Ready to Start Testing?
              </Typography>
              <Typography sx={{ mt: 2, mb: 4 }}>
                Join the global community of testers improving products every
                day.
              </Typography>
              <Button
                onClick={() => navigate("/signup")}
                // variant="contained"
                sx={{
                  backgroundColor: "white",
                  color: "#2563eb",
                  px: 4,
                  py: 1.5,
                  borderRadius: "9999px",
                  textTransform: "none",
                  fontWeight: 600,
                  "&:hover": { backgroundColor: "#f8fafc" },
                }}
              >
                Create Your Tester Account
              </Button>
            </motion.div>
          </Container>
        </Box>
      ) : (
        <></>
      )}
    </Box>
  );
}
