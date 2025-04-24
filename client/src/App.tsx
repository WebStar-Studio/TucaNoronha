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
import { useAuthStore } from "@/store/authStore";
import { useEffect } from "react";
import { useLocation } from "wouter";

function ProtectedRoute({ component: Component, adminOnly = false }: { component: React.FC, adminOnly?: boolean }) {
  const { isAuthenticated, user } = useAuthStore();
  const [, setLocation] = useLocation();

  useEffect(() => {
    if (!isAuthenticated) {
      setLocation("/signin");
      return;
    }

    if (adminOnly && user?.role !== "admin") {
      setLocation("/");
    }
  }, [isAuthenticated, user, adminOnly, setLocation]);

  if (!isAuthenticated) {
    return null;
  }

  if (adminOnly && user?.role !== "admin") {
    return null;
  }

  return <Component />;
}

function Router() {
  const { initAuth } = useAuthStore();

  useEffect(() => {
    initAuth();
  }, [initAuth]);

  return (
    <>
      <Navbar />
      <Switch>
        <Route path="/" component={Home} />
        <Route path="/signin" component={SignIn} />
        <Route path="/signup" component={SignUp} />
        <Route path="/reset-password" component={ResetPassword} />
        <Route path="/experiences" component={ExperiencesPage} />
        <Route path="/accommodations" component={AccommodationsPage} />
        <Route path="/packages" component={PackagesPage} />
        <Route path="/profile">
          {() => <ProtectedRoute component={Profile} />}
        </Route>
        <Route path="/admin">
          {() => <ProtectedRoute component={Admin} adminOnly={true} />}
        </Route>
        <Route component={NotFound} />
      </Switch>
      <Footer />
    </>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Router />
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
