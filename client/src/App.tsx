import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import Home from "@/pages/Home";
import SignIn from "@/pages/SignIn";
import SignUp from "@/pages/SignUp";
import ResetPassword from "@/pages/ResetPassword";
import Profile from "@/pages/Profile";
import Admin from "@/pages/Admin";
import ExperiencesPage from "@/pages/ExperiencesPage";
import AccommodationsPage from "@/pages/AccommodationsPage";
import PackagesPage from "@/pages/PackagesPage";
import NotFound from "@/pages/not-found";
import { ProtectedRoute } from "./lib/protected-route";
import { AuthProvider } from "@/hooks/use-auth";

function Router() {
  return (
    <>
      <Navbar />
      <Switch>
        <Route path="/" component={Home} />
        <Route path="/auth" component={SignIn} />
        <Route path="/reset-password" component={ResetPassword} />
        <Route path="/experiences" component={ExperiencesPage} />
        <Route path="/accommodations" component={AccommodationsPage} />
        <Route path="/packages" component={PackagesPage} />
        <ProtectedRoute path="/profile" component={Profile} />
        <ProtectedRoute path="/admin" component={Admin} adminOnly={true} />
        <Route component={NotFound} />
      </Switch>
      <Footer />
    </>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <TooltipProvider>
          <Toaster />
          <Router />
        </TooltipProvider>
      </AuthProvider>
    </QueryClientProvider>
  );
}

export default App;
