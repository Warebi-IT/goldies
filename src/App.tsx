import { useEffect } from "react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Route, Routes, useNavigate } from "react-router-dom";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { supabase } from "@/integrations/supabase/client";
import Index from "./pages/Index.tsx";
import Voyages from "./pages/Voyages.tsx";
import VoyageDetail from "./pages/VoyageDetail.tsx";
import Gallery from "./pages/Gallery.tsx";
import Concept from "./pages/Concept.tsx";
import ContactPage from "./pages/ContactPage.tsx";
import Admin from "./pages/Admin.tsx";
import MfaSetup from "./pages/MfaSetup.tsx";
import MfaVerify from "./pages/MfaVerify.tsx";
import SetPassword from "./pages/SetPassword.tsx";
import NotFound from "./pages/NotFound.tsx";

// Capture avant que Supabase ne nettoie le hash via history.replaceState
const initialHash = window.location.hash;

const AuthRedirect = () => {
  const navigate = useNavigate();
  useEffect(() => {
    const isInvite = initialHash.includes("type=invite") || initialHash.includes("type=recovery");
    if (!isInvite) return;
    supabase.auth.getSession().then(({ data }) => {
      if (data.session) navigate("/set-password", { replace: true });
    });
  }, [navigate]);
  return null;
};

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <AuthRedirect />
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/voyages" element={<Voyages />} />
          <Route path="/voyages/:id" element={<VoyageDetail />} />
          <Route path="/galerie" element={<Gallery />} />
          <Route path="/concept" element={<Concept />} />
          <Route path="/contact" element={<ContactPage />} />
          <Route path="/admin" element={<Admin />} />
          <Route path="/mfa-setup" element={<MfaSetup />} />
          <Route path="/mfa-verify" element={<MfaVerify />} />
          <Route path="/set-password" element={<SetPassword />} />
          {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
