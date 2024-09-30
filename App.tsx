// App.tsx
import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import ActiveRepLandingPage from "./pages/ActiveRepLandingPage";
import CoachingReportPage from "./pages/CoachingReportPage";
import DashboardsPage from "./pages/DashboardsPage";
import YourJourney from "./components/YourJourney";
import Planner from "./components/Planner";
import VisitDetails from "./components/VisitDetails";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<ActiveRepLandingPage />} />
        <Route path="/coaching-report" element={<CoachingReportPage />} />
        <Route path="/dashboards" element={<DashboardsPage />} />
        <Route path="/your-journey" element={<YourJourney />} />
        <Route path="/planner" element={<Planner />} />
        <Route path="/visit-details" element={<VisitDetails />} />
      </Routes>
    </Router>
  );
}

export default App;
