import { useState, useEffect } from "react";
import { useLocation } from "wouter";
import { useAuth } from "@/hooks/use-auth";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useTranslation } from "react-i18next";
import SignInForm from "@/components/auth/SignInForm";
import SignUpForm from "@/components/auth/SignUpForm";

export default function AuthPage() {
  const { user } = useAuth();
  const [, setLocation] = useLocation();
  const [activeTab, setActiveTab] = useState<string>("signin");
  const { t } = useTranslation();

  // Redirect to home if already authenticated
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
          src="https://images.unsplash.com/photo-1523037514347-91725175a3dd?ixlib=rb-4.0.3&auto=format&fit=crop&w=2068&q=80" 
          alt="Fernando de Noronha landscape" 
          className="w-full h-full object-cover" 
        />
        <div className="absolute inset-0 bg-gradient-to-b from-foreground/50 to-foreground/80"></div>
        
        {/* Decorative elements */}
        <div className="absolute top-[25%] left-[10%] w-32 h-32 rounded-full bg-primary/10 backdrop-blur-sm animate-pulse-slow"></div>
        <div className="absolute bottom-[20%] right-[10%] w-40 h-40 rounded-full bg-accent/10 backdrop-blur-sm animate-float"></div>
      </div>
      
      {/* Two-column layout */}
      <div className="relative z-10 w-full max-w-6xl grid grid-cols-1 md:grid-cols-2 gap-8 px-4 mt-8 mb-8">
        {/* Hero section */}
        <div className="hidden md:flex flex-col justify-center p-8 text-white">
          <h1 className="text-4xl font-playfair mb-4">
            {t('auth.heroTitle', 'Discover Paradise in Fernando de Noronha')}
          </h1>
          <p className="text-lg mb-6">
            {t('auth.heroSubtitle', 'Join our community to explore pristine beaches, crystal-clear waters, and unique experiences on this stunning archipelago.')}
          </p>
          <ul className="space-y-2">
            <li className="flex items-center">
              <div className="rounded-full bg-primary/20 p-1 mr-2">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-primary" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                </svg>
              </div>
              {t('auth.benefit1', 'Exclusive access to curated travel experiences')}
            </li>
            <li className="flex items-center">
              <div className="rounded-full bg-primary/20 p-1 mr-2">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-primary" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                </svg>
              </div>
              {t('auth.benefit2', 'Personalized recommendations based on your preferences')}
            </li>
            <li className="flex items-center">
              <div className="rounded-full bg-primary/20 p-1 mr-2">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-primary" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                </svg>
              </div>
              {t('auth.benefit3', 'Save and organize your favorite destinations')}
            </li>
          </ul>
        </div>

        {/* Auth forms */}
        <div className="w-full max-w-md mx-auto">
          <Card className="glass-card border-white/10 shadow-xl backdrop-blur-lg">
            <CardHeader className="space-y-1 py-4">
              <CardTitle className="text-xl font-playfair text-center">
                {activeTab === "signin" 
                  ? t('auth.signInTitle', 'Sign In') 
                  : t('auth.signUpTitle', 'Create an Account')}
              </CardTitle>
              <CardDescription className="text-center text-sm">
                {activeTab === "signin"
                  ? t('auth.signInSubtitle', 'Enter your credentials to access your account')
                  : t('auth.signUpSubtitle', 'Sign up to start exploring Fernando de Noronha')}
              </CardDescription>
            </CardHeader>
            <CardContent className="py-2">
              <Tabs 
                defaultValue="signin" 
                value={activeTab} 
                onValueChange={setActiveTab}
                className="w-full"
              >
                <TabsList className="grid grid-cols-2 mb-4">
                  <TabsTrigger value="signin">{t('common.login')}</TabsTrigger>
                  <TabsTrigger value="signup">{t('common.register')}</TabsTrigger>
                </TabsList>
                <TabsContent value="signin">
                  <SignInForm />
                  <div className="mt-4 text-center">
                    <Button 
                      variant="link" 
                      className="text-primary hover:text-primary/80"
                      onClick={() => setLocation("/reset-password")}
                    >
                      {t('auth.forgotPassword', 'Forgot password?')}
                    </Button>
                  </div>
                </TabsContent>
                <TabsContent value="signup">
                  <SignUpForm />
                </TabsContent>
              </Tabs>
            </CardContent>
          </Card>
        </div>
      </div>
    </main>
  );
}