import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { ThemeProvider } from "next-themes";
import Auth from "./pages/Auth";
import DashboardLayout from "./components/DashboardLayout";
import Dashboard from "./pages/Dashboard";
import LearningPath from "./pages/LearningPath";
import FlashcardHub from "./pages/FlashcardHub";
import PracticeProjectsPage from "./components/PracticeProjectsPage";
import { RDToolsPage } from "./components/RDToolsPage";
import { PDFAnalysisPage } from "./components/PDFAnalysisPage";
import ElectronicsHubPage from "./components/ElectronicsHubPage";
import DashboardSettings from "./pages/DashboardSettings";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            {/* Authentication as front page */}
            <Route path="/" element={<Auth />} />
            
            {/* Dashboard routes */}
            <Route path="/dashboard" element={<DashboardLayout />}>
              <Route index element={<Dashboard />} />
              <Route path="learning-path" element={<LearningPath />} />
              <Route path="practice" element={<PracticeProjectsPage onBack={() => {}} />} />
              <Route path="research" element={<RDToolsPage />} />
              <Route path="pdf" element={<PDFAnalysisPage onBack={() => {}} />} />
              <Route path="flashcards" element={<FlashcardHub />} />
              <Route path="electronics" element={<ElectronicsHubPage />} />
              <Route path="settings" element={<DashboardSettings />} />
            </Route>
            
            {/* Catch-all route */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </ThemeProvider>
  </QueryClientProvider>
);

export default App;
