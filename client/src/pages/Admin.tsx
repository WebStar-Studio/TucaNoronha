import Dashboard from "@/components/admin/Dashboard";
import { useAuthStore } from "@/store/authStore";
import { useLocation } from "wouter";
import { useEffect } from "react";

export default function Admin() {
  const { user, isAuthenticated } = useAuthStore();
  const [, setLocation] = useLocation();

  useEffect(() => {
    if (!isAuthenticated) {
      setLocation("/signin");
      return;
    }

    if (user?.role !== "admin") {
      setLocation("/");
    }
  }, [isAuthenticated, user, setLocation]);

  if (!isAuthenticated || user?.role !== "admin") {
    return null;
  }

  return (
    <div className="min-h-screen pt-24 pb-16 bg-background">
      <Dashboard />
    </div>
  );
}
