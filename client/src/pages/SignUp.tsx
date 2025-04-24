import ChatSignUpForm from "@/components/auth/ChatSignUpForm";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useEffect, useState } from "react";
import { useLocation } from "wouter";
import { useAuthStore } from "@/store/authStore";

export default function SignUp() {
  const { isAuthenticated } = useAuthStore();
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
    if (isAuthenticated) {
      setLocation("/");
    }
  }, [isAuthenticated, setLocation]);

  return (
    <main className="relative min-h-screen flex items-center justify-center">
      {/* Background image with overlay */}
      <div className="absolute inset-0 z-0">
        <img 
          src="https://images.unsplash.com/photo-1523036283422-ca8d34c3d731?ixlib=rb-4.0.3&auto=format&fit=crop&w=2068&q=80" 
          alt="Fernando de Noronha landscape" 
          className="w-full h-full object-cover" 
        />
        <div className="absolute inset-0 bg-gradient-to-b from-foreground/50 to-foreground/80"></div>
        
        {/* Decorative elements */}
        <div className="absolute top-[15%] right-[10%] w-32 h-32 rounded-full bg-secondary/10 backdrop-blur-sm animate-pulse-slow"></div>
        <div className="absolute bottom-[30%] left-[10%] w-40 h-40 rounded-full bg-primary/10 backdrop-blur-sm animate-float"></div>
      </div>
      
      {/* Content */}
      <div className="relative z-10 w-full max-w-2xl px-4 mt-16 pb-16">
        <Card className="glass-card border-white/10 shadow-xl backdrop-blur-lg">
          <CardHeader className="space-y-1">
            <CardTitle className="text-2xl font-playfair text-center text-foreground">Create an Account</CardTitle>
            <CardDescription className="text-center">
              Sign up to start exploring the paradise of Fernando de Noronha
            </CardDescription>
          </CardHeader>
          <CardContent>
            <ChatSignUpForm />
          </CardContent>
        </Card>
      </div>
    </main>
  );
}
