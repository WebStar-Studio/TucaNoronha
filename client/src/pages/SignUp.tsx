import SignUpForm from "@/components/auth/SignUpForm";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useEffect } from "react";
import { useLocation } from "wouter";
import { useAuthStore } from "@/store/authStore";

export default function SignUp() {
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
            <CardTitle className="text-2xl font-playfair text-center">Create an Account</CardTitle>
            <CardDescription className="text-center">
              Sign up to start exploring the paradise of Fernando de Noronha
            </CardDescription>
          </CardHeader>
          <CardContent className="relative z-10">
            <SignUpForm />
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
