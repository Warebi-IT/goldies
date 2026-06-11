import { useEffect } from "react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Route, Routes, useNavigate } from "react-router-dom";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { supabase } from "@/integrations/supabase/client";
import BackgroundFX from "@/components/BackgroundFX";
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
import Avis from "./pages/Avis.tsx";
import MentionsLegales from "./pages/MentionsLegales.tsx";
import PolitiqueConfidentialite from "./pages/PolitiqueConfidentialite.tsx";
import CGV from "./pages/CGV.tsx";
import CookieBanner from "./components/CookieBanner.tsx";
import ScrollToTop from "@/components/ScrollToTop";

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
      <div className="min-h-screen bg-zinc-950 p-2 md:p-4 font-dm-sans text-ink">
        <main className="bg-white rounded-[2rem] overflow-hidden min-h-[calc(100vh-1rem)] md:min-h-[calc(100vh-2rem)] shadow-2xl relative flex flex-col">
          <BrowserRouter>
            <ScrollToTop />
            <Routes>
              <Route path="/" element={<Index />} />
              <Route path="/voyages" element={<Voyages />} />
              <Route path="/voyages/:id" element={<VoyageDetail />} />
              <Route path="/galerie" element={<Gallery />} />
              <Route path="/concept" element={<Concept />} />
              <Route path="/avis" element={<Avis />} />
              <Route path="/contact" element={<ContactPage />} />
              <Route path="/gestion-goldies" element={<Admin />} />
              <Route path="/mfa-setup" element={<MfaSetup />} />
              <Route path="/mfa-verify" element={<MfaVerify />} />
              <Route path="/set-password" element={<SetPassword />} />
              <Route path="/mentions-legales" element={<MentionsLegales />} />
              <Route path="/politique-confidentialite" element={<PolitiqueConfidentialite />} />
              <Route path="/cgv" element={<CGV />} />
              {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
              <Route path="*" element={<NotFound />} />
            </Routes>
          </BrowserRouter>
          <CookieBanner />
        </main>
      </div>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
