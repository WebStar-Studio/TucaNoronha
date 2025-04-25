import { useAuth } from "@/hooks/use-auth";
import { useLocation } from "wouter";
import { useEffect, useMemo } from "react";
import { useTranslation } from "react-i18next";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardHeader, 
  CardTitle 
} from "@/components/ui/card";
import { Loader2 } from "lucide-react";
import ExperienceForm from "@/components/admin/ExperienceForm";
import AccommodationForm from "@/components/admin/AccommodationForm";
import PackageForm from "@/components/admin/PackageForm";

export default function Admin() {
  const { user, isLoading } = useAuth();
  const [, setLocation] = useLocation();
  const { t } = useTranslation();

  useEffect(() => {
    if (!isLoading && !user) {
      setLocation("/auth");
      return;
    }

    if (user && user.role !== "admin") {
      setLocation("/");
    }
  }, [isLoading, user, setLocation]);

  if (isLoading) {
    return (
      <div className="min-h-screen pt-24 pb-16 flex items-center justify-center">
        <Card className="w-full max-w-md mx-4">
          <CardContent className="pt-6">
            <div className="text-center">
              <Loader2 className="h-8 w-8 animate-spin mx-auto text-primary" />
              <p className="mt-2">Loading admin dashboard...</p>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (!user || user.role !== "admin") {
    return null;
  }

  // Usando useMemo para evitar re-renderizações excessivas
  const tabContent = useMemo(() => {
    return (
      <div className="min-h-screen pt-24 pb-16 bg-background">
        <div className="max-w-7xl mx-auto px-4">
          <h1 className="text-3xl font-bold mb-6">{t('admin.dashboard')}</h1>
          
          <Tabs defaultValue="experiences" className="w-full">
            <TabsList className="mb-6">
              <TabsTrigger value="experiences">{t('admin.experiences')}</TabsTrigger>
              <TabsTrigger value="accommodations">{t('admin.accommodations')}</TabsTrigger>
              <TabsTrigger value="packages">{t('admin.packages')}</TabsTrigger>
            </TabsList>
            
            <TabsContent value="experiences">
              <Card>
                <CardHeader>
                  <CardTitle>{t('admin.newExperience')}</CardTitle>
                  <CardDescription>
                    {t('admin.createExperienceDesc')}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <ExperienceForm />
                </CardContent>
              </Card>
            </TabsContent>
            
            <TabsContent value="accommodations">
              <Card>
                <CardHeader>
                  <CardTitle>{t('admin.newAccommodation')}</CardTitle>
                  <CardDescription>
                    {t('admin.createAccommodationDesc')}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <AccommodationForm />
                </CardContent>
              </Card>
            </TabsContent>
            
            <TabsContent value="packages">
              <Card>
                <CardHeader>
                  <CardTitle>{t('admin.newPackage')}</CardTitle>
                  <CardDescription>
                    {t('admin.createPackageDesc')}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <PackageForm />
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    );
  }, [t]); // Dependência apenas da função de tradução
  
  return tabContent;
}
