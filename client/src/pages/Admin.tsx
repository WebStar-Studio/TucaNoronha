import { useAuth } from "@/hooks/use-auth";
import { useLocation } from "wouter";
import { useEffect, useState } from "react";
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

// Componentes separados para evitar problemas de renderização
const TabContentExperience = () => {
  const { t } = useTranslation();
  return (
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
  );
};

const TabContentAccommodation = () => {
  const { t } = useTranslation();
  return (
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
  );
};

const TabContentPackage = () => {
  const { t } = useTranslation();
  return (
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
  );
};

export default function Admin() {
  const { user, isLoading } = useAuth();
  const [, setLocation] = useLocation();
  const { t } = useTranslation();
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    if (!isLoading) {
      if (!user) {
        setLocation("/auth");
      } else if (user.role !== "admin") {
        setLocation("/");
      } else {
        setIsAdmin(true);
      }
    }
  }, [isLoading, user, setLocation]);

  if (isLoading) {
    return (
      <div className="min-h-screen pt-24 pb-16 flex items-center justify-center">
        <Card className="w-full max-w-md mx-4">
          <CardContent className="pt-6">
            <div className="text-center">
              <Loader2 className="h-8 w-8 animate-spin mx-auto text-primary" />
              <p className="mt-2">{t('common.loading')}</p>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (!isAdmin) {
    return null;
  }

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
            <TabContentExperience />
          </TabsContent>
          
          <TabsContent value="accommodations">
            <TabContentAccommodation />
          </TabsContent>
          
          <TabsContent value="packages">
            <TabContentPackage />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
