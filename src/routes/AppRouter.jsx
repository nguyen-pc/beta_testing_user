import { BrowserRouter, Route, Routes } from "react-router-dom";
import HomeSignUp from "../pages/home/HomeSignUp";
import SignInSide from "../pages/auth/SignInSide";
import SignUpSide from "../pages/auth/SignUpSign";
import Home from "../pages/home/Home";
import ProjectShow from "../components/home/ProjectShow";
import DetailCampaign from "../pages/home/DetailCampaign";
import DetailUserCampaign from "../pages/home/DetailUserCampaignPage";
import Dashboard from "../pages/dashboard/Dashboard";
import Analytics from "../pages/dashboard/Analytics";
import User from "../pages/dashboard/User";
import Profile from "../pages/profile/Profile";

import RecordingTips from "../pages/testflow/RecordingTips";
import QuickSetup from "../pages/testflow/QuickSetup";
import ConfirmScreen from "../pages/testflow/ConfirmScreen";
import MicrophoneCheck from "../pages/testflow/MicrophoneCheck";
import KeepTabsOpen from "../pages/testflow/KeepTabsOpen";
import StartScenario from "../pages/testflow/StartScenario";
import TestScenario from "../pages/testflow/TestScenario";
import TestFlow from "../pages/testflow/TestFlow";

export default function AppRouter() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/home/*" element={<Home />} />
        <Route path="/signin" element={<SignInSide />} />
        <Route path="/signup" element={<SignUpSide />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/home/detail/:campaignId" element={<DetailCampaign />} />
        <Route
          path="/home/detail/user/:campaignId"
          element={<DetailUserCampaign />}
        />
        <Route path="/home_signup" element={<HomeSignUp />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/dashboard/projects" element={<Analytics />} />
        <Route path="/dashboard/user/*" element={<User />} />

        <Route path="/testflow/*" element={<TestFlow />} />
      </Routes>
    </BrowserRouter>
  );
}
