import { BrowserRouter, Route, Routes, Navigate } from "react-router-dom";
import HomeSignUp from "../pages/home/HomeSignUp";
import SignInSide from "../pages/auth/SignInSide";
import SignUpSide from "../pages/auth/SignUpSign";
import SignUpSideCompany from "../pages/auth/SignUpSignCompany";
import SignUpSuccess from "../components/auth/signin/SignUpSuccess";
import SignUpFailed from "../components/auth/signin/SignUpFailed";
import Home from "../pages/home/Home";
import ProjectShow from "../components/home/ProjectShow";
import DetailCampaign from "../pages/home/DetailCampaign";
import DetailUserCampaign from "../pages/home/DetailUserCampaignPage";
import Dashboard from "../pages/dashboard/Dashboard";
import Analytics from "../pages/dashboard/Analytics";
import Message from "../pages/dashboard/Message";
import User from "../pages/dashboard/User";
import Profile from "../pages/profile/Profile";

import TestFlow from "../pages/testflow/TestFlow";
import SurveyForm from "../pages/testflow/ViewQuestion";
import ThankYouPage from "../pages/testflow/ThankYouPage";
import Checkout from "../pages/profile/Checkout";
import SettingUserPage from "../pages/dashboard/SettingUserPage";
import Reward from "../pages/dashboard/reward";

export default function AppRouter() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Navigate to="/home" replace />} />
        <Route path="/home/*" element={<Home />} />
        <Route path="/signin" element={<SignInSide />} />
        <Route path="/signup" element={<SignUpSide />} />
        <Route path="/signupCompany" element={<SignUpSideCompany />} />
        <Route path="/signup-success" element={<SignUpSuccess />} />
        <Route path="/signup-failed" element={<SignUpFailed />} />

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
        <Route path="/dashboard/message/*" element={<Message />} />
        <Route path="/dashboard/setting/*" element={<SettingUserPage />} />
        <Route path="/dashboard/reward/*" element={<Reward />} />

        <Route path="/testflow/*" element={<TestFlow />} />
        <Route
          path="/testflow/:campaignId/view_question/:surveyId"
          element={<SurveyForm />}
        />
        <Route
          path="/testflow/:campaignId/view_question/:surveyId/thank-you"
          element={<ThankYouPage />}
        />
        <Route path="/payments" element={<Checkout />} />
      </Routes>
    </BrowserRouter>
  );
}
