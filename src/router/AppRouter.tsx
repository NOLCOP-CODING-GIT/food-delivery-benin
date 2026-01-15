import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import HomePage from "../pages/HomePage";
import RestaurantDetailPage from "../pages/RestaurantDetailPage";
import TrackingPage from "../pages/TrackingPage";
import ProfilePage from "../pages/ProfilePage";
import AppLayout from "./AppLayout";

const AppRouter: React.FC = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<AppLayout />}>
          <Route index element={<HomePage />} />
          <Route path="restaurant/:id" element={<RestaurantDetailPage />} />
          <Route path="tracking" element={<TrackingPage />} />
          <Route path="profile" element={<ProfilePage />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
};

export default AppRouter;
