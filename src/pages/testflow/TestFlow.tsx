import * as React from "react";
import CssBaseline from "@mui/material/CssBaseline";
import Container from "@mui/material/Container";
import AppTheme from "../../theme/AppTheme";
import AppAppBar from "../../components/home/AppAppBar";
import Footer from "../../components/home/Footer";
import Detail from "../../components/home/DetailCampaign";
import NotificationsProvider from "../../hooks/useNotifications/NotificationsProvider";
import DialogsProvider from "../../hooks/useDialogs/DialogsProvider";
import { Route, Routes } from "react-router-dom";
import RecordingTips from "./RecordingTips";
import QuickSetup from "./QuickSetup";
import ConfirmScreen from "./ConfirmScreen";
import MicrophoneCheck from "./MicrophoneCheck";
import KeepTabsOpen from "./KeepTabsOpen";
import CampaignDetailUser from "../../components/home/DetailUserCampaign";
import StartScenario from "./StartScenario";
import TestScenario from "./TestScenario";
import ViewQuestion from "./ViewQuestion";
import BugReport from "./BugReport";
import SurveyForm from "./ViewQuestion";

export default function TestFlow(props: { disableCustomTheme?: boolean }) {
  return (
    <AppTheme {...props}>
      <CssBaseline enableColorScheme />

      <AppAppBar />
      <Container
        maxWidth="lg"
        component="main"
        sx={{ display: "flex", flexDirection: "column", my: 16, gap: 4 }}
      >
        <NotificationsProvider>
          <DialogsProvider>
            <Routes>
              <Route index element={<CampaignDetailUser />} />
              <Route path=":campaignId/tips" element={<RecordingTips />} />
              <Route path=":campaignId/setup" element={<QuickSetup />} />
              <Route path=":campaignId/confirm" element={<ConfirmScreen />} />
              <Route path=":campaignId/mic" element={<MicrophoneCheck />} />
              <Route path=":campaignId/tabs" element={<KeepTabsOpen />} />
              <Route path=":campaignId/start" element={<StartScenario />} />
              <Route path=":campaignId/scenario" element={<TestScenario />} />
              <Route path=":campaignId/bug_report" element={<BugReport />} />
              {/* <Route path=":campaignId/view_question/:surveyId" element={<SurveyForm />} /> */}
              <Route path="*" element={<CampaignDetailUser />} />
            </Routes>
          </DialogsProvider>
        </NotificationsProvider>
      </Container>
      <Footer />
    </AppTheme>
  );
}
