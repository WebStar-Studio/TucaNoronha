import SignInForm from "@/components/auth/SignInForm";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useEffect } from "react";
import { useLocation } from "wouter";
import { useAuthStore } from "@/store/authStore";

export default function SignIn() {
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
            <CardTitle className="text-2xl font-playfair text-center">Sign In</CardTitle>
            <CardDescription className="text-center">
              Enter your credentials to access your account
            </CardDescription>
          </CardHeader>
          <CardContent className="relative z-10">
            <SignInForm />
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
