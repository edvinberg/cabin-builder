import { Routes, Route } from "react-router-dom";
import { Layout } from "./components/Layout";
import { HomePage } from "./pages/HomePage";
import { ProjectPage } from "./pages/ProjectPage";
import { PhasePage } from "./pages/PhasePage";
import { LearningsPage } from "./pages/LearningsPage";
import { ShoppingPage } from "./pages/ShoppingPage";

export function App() {
  return (
    <Routes>
      <Route element={<Layout />}>
        <Route index element={<HomePage />} />
        <Route path="project/:projectId" element={<ProjectPage />} />
        <Route path="project/:projectId/phase/:phaseId" element={<PhasePage />} />
        <Route path="learnings" element={<LearningsPage />} />
        <Route path="shopping" element={<ShoppingPage />} />
      </Route>
    </Routes>
  );
}
