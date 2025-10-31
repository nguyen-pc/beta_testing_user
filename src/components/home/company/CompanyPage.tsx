import React from "react";
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

export default function CompanyPage() {
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
              Launch Your <span className="text-blue-600">Beta Campaigns</span>
            </Typography>
            <Typography variant="h6" color="text.secondary" sx={{ mt: 2 }}>
              Collect feedback from real users, validate your product, and
              improve quality before release — all in one powerful platform.
            </Typography>
            <Button
              onClick={() => navigate("/company/campaign/create")}
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
              Start a Campaign
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
              title: "Create Campaign",
              desc: "Define your product, goals, test cases, and desired tester profile.",
            },
            {
              step: "2️⃣",
              title: "Recruit Testers",
              desc: "Invite testers manually or let the platform automatically match them.",
            },
            {
              step: "3️⃣",
              title: "Collect Feedback & Bugs",
              desc: "Receive structured reports, surveys, and AI-analyzed insights in real time.",
            },
            {
              step: "4️⃣",
              title: "Reward & Analyze",
              desc: "Distribute rewards securely and review performance analytics.",
            },
          ].map((item, i) => (
            <Grid item xs={12} md={3} key={i}>
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
            Why Choose BetaTesting for Your Company?
          </Typography>
          <Grid container spacing={4}>
            {[
              {
                title: "AI-Powered Feedback",
                desc: "Automatically summarize and classify tester feedback using NLP & sentiment analysis.",
              },
              {
                title: "Comprehensive Dashboard",
                desc: "Manage campaigns, testers, and bug reports all in one place.",
              },
              {
                title: "Automated Reward Distribution",
                desc: "Integrate with VNPAY or Stripe to handle reward payouts instantly.",
              },
              {
                title: "Secure & Scalable",
                desc: "Enterprise-grade architecture with role-based access and audit tracking.",
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

      {/* === CASE STUDIES / CLIENTS === */}
      <Box sx={{ py: 10 }}>
        <Container maxWidth="lg" sx={{ textAlign: "center" }}>
          <Typography variant="h4" fontWeight={700} mb={3}>
            Trusted by Innovative Teams
          </Typography>
          <Typography color="text.secondary" mb={6}>
            Companies around the world use BetaTesting to validate their
            products.
          </Typography>

          {/* Logo grid placeholder */}
          <Grid container spacing={4} justifyContent="center">
            {["FPT", "VNG", "TMA", "Viettel", "NashTech", "KMS"].map(
              (logo, i) => (
                <Grid item xs={6} sm={4} md={2} key={i}>
                  <motion.div
                    initial={{ opacity: 0, y: 40 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: i * 0.15 }}
                  >
                    <Box className="bg-white rounded-xl shadow-md p-6 hover:shadow-lg transition">
                      <Typography fontWeight={600}>{logo}</Typography>
                    </Box>
                  </motion.div>
                </Grid>
              )
            )}
          </Grid>
        </Container>
      </Box>

      {/* === CTA SECTION === */}
      <Box
        className="bg-gradient-to-r from-blue-500 to-blue-300  text-white text-center"
        sx={{ py: 10 }}
      >
        <Container maxWidth="sm">
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7 }}
          >
            <Typography variant="h4" fontWeight={700}>
              Ready to Launch Your First Campaign?
            </Typography>
            <Typography sx={{ mt: 2, mb: 4 }}>
              Connect with hundreds of testers today and make your product
              shine.
            </Typography>
            <Button
            //   variant="contained"
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
              onClick={() => navigate("/signupCompany")}
            >
              Create Campaign Now
            </Button>
          </motion.div>
        </Container>
      </Box>
    </Box>
  );
}
