import React from "react";
import {
  Box,
  Container,
  Typography,
  Accordion,
  AccordionSummary,
  AccordionDetails,
} from "@mui/material";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import { motion } from "framer-motion";

export default function FAQPage() {
  const faqData = [
    {
      category: "General",
      questions: [
        {
          q: "What is BetaTesting?",
          a: "BetaTesting is a platform that connects companies with real users to test their apps, websites, or products before launch. Testers provide valuable feedback and companies improve their quality.",
        },
        {
          q: "How do I join BetaTesting?",
          a: "You can sign up as a tester or company by selecting your role on the homepage. Once registered, verify your account and complete your profile to get started.",
        },
        {
          q: "Is BetaTesting free to use?",
          a: "For testers, joining and participating in campaigns is completely free. Companies may choose from various subscription plans depending on their needs.",
        },
      ],
    },
    {
      category: "For Testers",
      questions: [
        {
          q: "How do I find and join campaigns?",
          a: "Once logged in, go to the 'Campaigns' section. You can browse active campaigns and apply directly to the ones that interest you.",
        },
        {
          q: "How do I get approved for a campaign?",
          a: "Each company reviews applicants based on profile fit and device compatibility. You'll receive an approval notification once selected.",
        },
        {
          q: "How do I earn rewards?",
          a: "After completing your assigned test scenarios and submitting valid bug reports or surveys, rewards will be processed automatically via VNPAY or Stripe.",
        },
        {
          q: "Can I test from my mobile device?",
          a: "Yes, you can participate in both web and mobile app campaigns, depending on the product requirements.",
        },
      ],
    },
    {
      category: "For Companies",
      questions: [
        {
          q: "How do I create a new campaign?",
          a: "Log in as a company user and click 'Create Campaign'. Define your goals, target testers, and upload use cases or surveys.",
        },
        {
          q: "How are testers selected?",
          a: "You can manually approve applicants or let our recommendation engine automatically match testers based on skills, devices, and demographics.",
        },
        {
          q: "Can I customize surveys or test scenarios?",
          a: "Yes. BetaTesting allows you to design your own survey questions, use cases, and test steps directly in the dashboard.",
        },
        {
          q: "How do I manage rewards?",
          a: "Use the integrated reward management system to calculate, batch, and send rewards automatically to testers.",
        },
      ],
    },
  ];

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
              Frequently Asked <span className="text-blue-600">Questions</span>
            </Typography>
            <Typography variant="h6" color="text.secondary" sx={{ mt: 2 }}>
              Everything you need to know about how BetaTesting works — for both
              testers and companies.
            </Typography>
          </motion.div>
        </Container>
      </Box>

      {/* === FAQ SECTION === */}
      <Container maxWidth="md" sx={{ py: 10 }}>
        {faqData.map((section, i) => (
          <motion.div
            key={section.category}
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: i * 0.2 }}
            className="mb-10"
          >
            <Typography variant="h4" fontWeight={700} sx={{ mb: 3 }}>
              {section.category}
            </Typography>
            {section.questions.map((item, j) => (
              <Accordion
                key={j}
                sx={{
                  borderRadius: "12px",
                  boxShadow: "none",
                  border: "1px solid #e5e7eb",
                  mb: 1.5,
                  "&:before": { display: "none" },
                }}
              >
                <AccordionSummary
                  expandIcon={<ExpandMoreIcon color="primary" />}
                >
                  <Typography fontWeight={600}>{item.q}</Typography>
                </AccordionSummary>
                <AccordionDetails>
                  <Typography color="text.secondary">{item.a}</Typography>
                </AccordionDetails>
              </Accordion>
            ))}
          </motion.div>
        ))}
      </Container>

      {/* === CONTACT CTA === */}
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
              Still Have Questions?
            </Typography>
            <Typography sx={{ mt: 2, mb: 4 }}>
              Contact our support team — we’re here to help you get started
              smoothly.
            </Typography>
            <a
              href="mailto:support@betatesting.com"
              className="bg-white text-blue-600 font-semibold px-6 py-2.5 rounded-full hover:bg-blue-50 transition"
            >
              Contact Support
            </a>
          </motion.div>
        </Container>
      </Box>
    </Box>
  );
}
