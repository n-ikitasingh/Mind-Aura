import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { TooltipProvider } from "@/components/ui/tooltip";
import { AuthProvider } from "@/contexts/AuthContext";
import StreakCelebration from "@/components/StreakCelebration";
import Landing from "./pages/Landing";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import Dashboard from "./pages/Dashboard";
import Calendar from "./pages/Calendar";
import Journal from "./pages/Journal";
import Chat from "./pages/Chat";
import Analytics from "./pages/Analytics";
import SOS from "./pages/SOS";
import Profile from "./pages/Profile";
import ThoughtCloud from "./pages/ThoughtCloud";
import AppLayout from "./components/AppLayout";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const AppPage = ({ children }: { children: React.ReactNode }) => (
  <AppLayout>{children}</AppLayout>
);

const App = () => (
  <QueryClientProvider client={queryClient}>
    <AuthProvider>
      <TooltipProvider>
        <StreakCelebration />
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Landing />} />
            <Route path="/login" element={<Login />} />
            <Route path="/signup" element={<Signup />} />
            <Route path="/dashboard" element={<AppPage><Dashboard /></AppPage>} />
            <Route path="/calendar" element={<AppPage><Calendar /></AppPage>} />
            <Route path="/journal" element={<AppPage><Journal /></AppPage>} />
            <Route path="/chat" element={<AppPage><Chat /></AppPage>} />
            <Route path="/analytics" element={<AppPage><Analytics /></AppPage>} />
            <Route path="/sos" element={<AppPage><SOS /></AppPage>} />
            <Route path="/profile" element={<AppPage><Profile /></AppPage>} />
            <Route path="/thought-cloud" element={<AppPage><ThoughtCloud /></AppPage>} />
            <Route path="/demo" element={<AppPage><Dashboard /></AppPage>} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </AuthProvider>
  </QueryClientProvider>
);

export default App;
