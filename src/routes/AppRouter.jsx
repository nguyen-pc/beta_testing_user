import { BrowserRouter, Route, Routes } from "react-router-dom";
import HomePage from "../pages/home/HomePage";
import HomeSignUp from "../pages/home/HomeSignUp";
import SignInSide from "../pages/auth/SignInSide";
import SignUpSide from "../pages/auth/SignUpSign";
import Blog from "../pages/home/Blog";

export default function AppRouter() {
  return (
    <BrowserRouter>
      <Routes> 
        <Route path="/" element={<Blog />} />
        <Route path="/signin" element={<SignInSide />} />
        <Route path="/signup" element={<SignUpSide />} />
        <Route path="/home" element={<HomePage />} />
        <Route path="/home_signup" element={<HomeSignUp />} />
      </Routes>
    </BrowserRouter>    
  )
}