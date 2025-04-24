import ResetPasswordForm from "@/components/auth/ResetPasswordForm";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useEffect } from "react";
import { useLocation } from "wouter";
import { useAuthStore } from "@/store/authStore";

export default function ResetPassword() {
  const { isAuthenticated } = useAuthStore();
  const [, setLocation] = useLocation();

  useEffect(() => {
    if (isAuthenticated) {
      setLocation("/");
    }
  }, [isAuthenticated, setLocation]);

  return (
    <div className="min-h-[calc(100vh-64px)] flex items-center justify-center bg-background py-16 mt-16">
      <div className="w-full max-w-md px-4">
        <Card className="futuristic-card">
          <CardHeader className="space-y-1 relative z-10">
            <CardTitle className="text-2xl font-playfair text-center">Reset Password</CardTitle>
            <CardDescription className="text-center">
              We'll send you a link to reset your password
            </CardDescription>
          </CardHeader>
          <CardContent className="relative z-10">
            <ResetPasswordForm />
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
