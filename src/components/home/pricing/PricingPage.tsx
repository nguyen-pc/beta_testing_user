import React from "react";
import {
  Box,
  Container,
  Typography,
  Card,
  CardContent,
  Button,
  Grid,
  Divider,
} from "@mui/material";
import { motion } from "framer-motion";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import { useNavigate } from "react-router-dom";

export default function PricingPage() {
  const navigate = useNavigate();

  const plans = [
    {
      name: "Starter",
      price: "Free",
      desc: "Perfect for small teams or students trying out the platform.",
      features: [
        "Create up to 2 campaigns",
        "Invite up to 10 testers",
        "Basic analytics dashboard",
        "Email support",
      ],
      buttonText: "Get Started",
      highlight: false,
    },
    {
      name: "Pro",
      price: "$49 / month",
      desc: "For growing startups managing multiple beta campaigns.",
      features: [
        "Unlimited campaigns & testers",
        "Advanced analytics & AI feedback",
        "Automated reward distribution",
        "Priority email + chat support",
      ],
      buttonText: "Upgrade to Pro",
      highlight: true,
    },
  ];

  return (
    <Box className="bg-white text-gray-800">
      {/* === HERO SECTION === */}
      <Box
        className="bg-gradient-to-b from-blue-50 to-white text-center"
        sx={{ py: 10 }}
      >
        <Container maxWidth="md">
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <Typography variant="h3" fontWeight={700}>
              Simple, Transparent <span className="text-blue-600">Pricing</span>
            </Typography>
            <Typography variant="h6" color="text.secondary" sx={{ mt: 2 }}>
              Choose a plan that fits your needs — upgrade anytime as your team
              grows.
            </Typography>
          </motion.div>
        </Container>
      </Box>

      {/* === PRICING PLANS === */}
      <Container maxWidth="lg" sx={{ py: 10 }}>
        <Grid container spacing={4} justifyContent="center">
          {plans.map((plan, i) => (
            <Grid item xs={12} sm={6} md={4} key={i}>
              <motion.div
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: i * 0.2 }}
              >
                <Card
                  className={`rounded-2xl shadow-md hover:shadow-xl transition duration-300 h-full ${
                    plan.highlight ? "border-2 border-blue-500" : ""
                  }`}
                >
                  <CardContent sx={{ p: 4, textAlign: "center" }}>
                    <Typography variant="h5" fontWeight={700} mb={1}>
                      {plan.name}
                    </Typography>
                    <Typography
                      variant="h4"
                      fontWeight={700}
                      color={plan.highlight ? "primary" : "text.primary"}
                    >
                      {plan.price}
                    </Typography>
                    <Typography color="text.secondary" sx={{ mt: 1, mb: 3 }}>
                      {plan.desc}
                    </Typography>

                    <Divider sx={{ my: 2 }} />

                    <Box sx={{ textAlign: "left", mb: 3 }}>
                      {plan.features.map((feature, j) => (
                        <Box
                          key={j}
                          sx={{
                            display: "flex",
                            alignItems: "center",
                            mb: 1.2,
                            gap: 1,
                          }}
                        >
                          <CheckCircleIcon
                            fontSize="small"
                            color={plan.highlight ? "primary" : "success"}
                          />
                          <Typography variant="body2">{feature}</Typography>
                        </Box>
                      ))}
                    </Box>

                    <Button
                      fullWidth
                      variant={plan.highlight ? "contained" : "outlined"}
                      color="primary"
                      sx={{
                        mt: 2,
                        borderRadius: "9999px",
                        textTransform: "none",
                        py: 1.2,
                        fontWeight: 600,
                      }}
                      onClick={() => {
                        if (plan.name === "Enterprise") navigate("/contact");
                        else navigate("/signupCompany");
                      }}
                    >
                      {plan.buttonText}
                    </Button>
                  </CardContent>
                </Card>
              </motion.div>
            </Grid>
          ))}
        </Grid>
      </Container>

      {/* === FEATURE COMPARISON === */}
      {/* <Box className="bg-blue-50" sx={{ py: 10 }}>
        <Container maxWidth="lg">
          <Typography variant="h4" fontWeight={700} align="center" mb={6}>
            Compare Plans
          </Typography>

          <Grid container spacing={2}>
            <Grid item xs={12} md={4}>
              <Typography fontWeight={700}>Feature</Typography>
            </Grid>
            <Grid item xs={4} md={2} textAlign="center">
              <Typography fontWeight={700}>Starter</Typography>
            </Grid>
            <Grid item xs={4} md={3} textAlign="center">
              <Typography fontWeight={700}>Pro</Typography>
            </Grid>
            <Grid item xs={4} md={3} textAlign="center">
              <Typography fontWeight={700}>Enterprise</Typography>
            </Grid>
          </Grid>

          <Divider sx={{ my: 2 }} />

          {[
            "Campaign limit",
            "Tester limit",
            "AI analytics",
            "Reward automation",
            "Custom integration",
            "24/7 Support",
          ].map((feature, i) => (
            <Grid
              container
              spacing={2}
              alignItems="center"
              key={i}
              sx={{ py: 1, borderBottom: "1px solid #e5e7eb" }}
            >
              <Grid item xs={12} md={4}>
                <Typography>{feature}</Typography>
              </Grid>

              <Grid item xs={4} md={2} textAlign="center">
                {i === 0 ? "2" : i === 1 ? "10" : i < 3 ? "—" : "—"}
              </Grid>
              <Grid item xs={4} md={3} textAlign="center">
                {i < 5 ? "✔️" : "—"}
              </Grid>
              <Grid item xs={4} md={3} textAlign="center">
                {"✔️"}
              </Grid>
            </Grid>
          ))}
        </Container>
      </Box> */}

      {/* === CTA SECTION === */}
      <Box
        className="bg-gradient-to-r from-blue-500 to-blue-300 text-white text-center"
        sx={{ py: 10 }}
      >
        <Container maxWidth="sm">
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7 }}
          >
            <Typography variant="h4" fontWeight={700}>
              Ready to Get Started?
            </Typography>
            <Typography sx={{ mt: 2, mb: 4 }}>
              Start testing smarter today — choose the plan that fits your team.
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
              Create Your Account
            </Button>
          </motion.div>
        </Container>
      </Box>
    </Box>
  );
}
