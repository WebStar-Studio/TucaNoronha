import ResetPasswordForm from "@/components/auth/ResetPasswordForm";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useEffect, useState } from "react";
import { useLocation } from "wouter";
import { useAuth } from "@/hooks/use-auth";

export default function ResetPassword() {
  const { user } = useAuth();
  const [, setLocation] = useLocation();
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 10) {
        setScrolled(true);
      } else {
        setScrolled(false);
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    if (user) {
      setLocation("/");
    }
  }, [user, setLocation]);

  return (
    <main className="relative min-h-screen flex items-center justify-center">
      {/* Background image with overlay */}
      <div className="absolute inset-0 z-0">
        <img 
          src="https://images.unsplash.com/photo-1523158406112-8b7240598c23?ixlib=rb-4.0.3&auto=format&fit=crop&w=2068&q=80" 
          alt="Fernando de Noronha ocean" 
          className="w-full h-full object-cover" 
        />
        <div className="absolute inset-0 bg-gradient-to-b from-foreground/50 to-foreground/80"></div>
        
        {/* Decorative elements */}
        <div className="absolute top-[35%] left-[10%] w-32 h-32 rounded-full bg-primary/10 backdrop-blur-sm animate-float"></div>
        <div className="absolute bottom-[25%] right-[15%] w-40 h-40 rounded-full bg-accent/10 backdrop-blur-sm animate-pulse-slow"></div>
      </div>
      
      {/* Content */}
      <div className="relative z-10 w-full max-w-md px-4 mt-16">
        <Card className="glass-card border-white/10 shadow-xl backdrop-blur-lg">
          <CardHeader className="space-y-1">
            <CardTitle className="text-2xl font-playfair text-center text-foreground">Reset Password</CardTitle>
            <CardDescription className="text-center">
              We'll send you a link to reset your password
            </CardDescription>
          </CardHeader>
          <CardContent>
            <ResetPasswordForm />
          </CardContent>
        </Card>
      </div>
    </main>
  );
}
