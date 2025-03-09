
import { Routes, Route } from "react-router-dom";
import PublicEventFormPage from "@/pages/PublicEventFormPage";

export default function PublicRoutes() {
  return (
    <Routes>
      <Route path="/public/event-form" element={<PublicEventFormPage />} />
    </Routes>
  );
}
