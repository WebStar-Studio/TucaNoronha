import { useEffect, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { useAuth } from "@/hooks/use-auth";
import { useLocation } from "wouter";
import { useTranslation } from "react-i18next";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Loader2, MapPin, Calendar, Bed, Package } from "lucide-react";
import { Experience, Accommodation, Package as TravelPackage } from "@shared/schema";
import { getQueryFn } from "@/lib/queryClient";

export default function Dashboard() {
  const { user, isLoading: isAuthLoading } = useAuth();
  const [, setLocation] = useLocation();
  const { t } = useTranslation();
  const [activeTab, setActiveTab] = useState<string>("experiences");

  // Redirect if not authenticated
  useEffect(() => {
    if (!isAuthLoading && !user) {
      setLocation("/auth");
    }
  }, [user, isAuthLoading, setLocation]);

  // Fetch data
  const { data: experiences, isLoading: isLoadingExperiences } = useQuery<Experience[]>({
    queryKey: ["/api/experiences/featured"],
    queryFn: getQueryFn({}),
    enabled: !!user,
  });

  const { data: accommodations, isLoading: isLoadingAccommodations } = useQuery<Accommodation[]>({
    queryKey: ["/api/accommodations/featured"],
    queryFn: getQueryFn({}),
    enabled: !!user,
  });

  const { data: packages, isLoading: isLoadingPackages } = useQuery<TravelPackage[]>({
    queryKey: ["/api/packages/featured"],
    queryFn: getQueryFn({}),
    enabled: !!user,
  });

  if (isAuthLoading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (!user) return null;

  return (
    <main className="max-w-7xl mx-auto px-4 py-20 sm:px-6 lg:px-8">
      {/* Welcome section */}
      <div className="mb-8">
        <h1 className="text-3xl font-playfair font-medium text-foreground">
          {t('dashboard.welcome', 'Welcome')} {user.firstName}!
        </h1>
        <p className="text-muted-foreground mt-2">
          {t('dashboard.intro', 'Here are some featured experiences tailored for your visit to Fernando de Noronha.')}
        </p>
      </div>

      {/* Tabs for different content types */}
      <Tabs defaultValue="experiences" value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="mb-6">
          <TabsTrigger value="experiences" className="flex items-center gap-1.5">
            <MapPin className="h-4 w-4" />
            {t('common.experiences')}
          </TabsTrigger>
          <TabsTrigger value="accommodations" className="flex items-center gap-1.5">
            <Bed className="h-4 w-4" />
            {t('common.accommodations')}
          </TabsTrigger>
          <TabsTrigger value="packages" className="flex items-center gap-1.5">
            <Package className="h-4 w-4" />
            {t('common.packages')}
          </TabsTrigger>
        </TabsList>

        {/* Experiences Tab */}
        <TabsContent value="experiences">
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
            {isLoadingExperiences ? (
              <div className="col-span-full flex justify-center py-12">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
              </div>
            ) : experiences && experiences.length > 0 ? (
              experiences.map((experience) => (
                <Card key={experience.id} className="overflow-hidden">
                  <div className="relative h-48 w-full overflow-hidden">
                    <img 
                      src={experience.image} 
                      alt={experience.title}
                      className="h-full w-full object-cover transition-transform duration-300 hover:scale-105"
                    />
                    {experience.featured && (
                      <div className="absolute top-2 right-2 bg-primary text-white text-xs px-2 py-1 rounded-full">
                        {t('common.featured')}
                      </div>
                    )}
                  </div>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-lg font-medium">{experience.title}</CardTitle>
                    <CardDescription className="flex items-center text-sm">
                      <MapPin className="mr-1 h-4 w-4 text-primary" />
                      {experience.location}
                      <span className="mx-2">•</span>
                      <Calendar className="mr-1 h-4 w-4 text-primary" />
                      {experience.duration}
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm line-clamp-2 mb-3">{experience.description}</p>
                    <div className="flex justify-between items-center">
                      <span className="font-medium text-primary">
                        ${experience.price.toFixed(2)}
                      </span>
                      <Button size="sm" variant="outline">
                        {t('common.viewDetails')}
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))
            ) : (
              <div className="col-span-full text-center py-12">
                <p className="text-muted-foreground">
                  {t('dashboard.noExperiences', 'No experiences available at the moment.')}
                </p>
              </div>
            )}
          </div>
        </TabsContent>

        {/* Accommodations Tab */}
        <TabsContent value="accommodations">
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
            {isLoadingAccommodations ? (
              <div className="col-span-full flex justify-center py-12">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
              </div>
            ) : accommodations && accommodations.length > 0 ? (
              accommodations.map((accommodation) => (
                <Card key={accommodation.id} className="overflow-hidden">
                  <div className="relative h-48 w-full overflow-hidden">
                    <img 
                      src={accommodation.image} 
                      alt={accommodation.title}
                      className="h-full w-full object-cover transition-transform duration-300 hover:scale-105"
                    />
                    {accommodation.featured && (
                      <div className="absolute top-2 right-2 bg-primary text-white text-xs px-2 py-1 rounded-full">
                        {t('common.featured')}
                      </div>
                    )}
                  </div>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-lg font-medium">{accommodation.title}</CardTitle>
                    <CardDescription className="flex items-center text-sm">
                      <MapPin className="mr-1 h-4 w-4 text-primary" />
                      {accommodation.location}
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm line-clamp-2 mb-3">{accommodation.description}</p>
                    <div className="flex justify-between items-center">
                      <span className="font-medium text-primary">
                        ${accommodation.price.toFixed(2)}<span className="text-sm text-muted-foreground">/night</span>
                      </span>
                      <Button size="sm" variant="outline">
                        {t('common.viewDetails')}
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))
            ) : (
              <div className="col-span-full text-center py-12">
                <p className="text-muted-foreground">
                  {t('dashboard.noAccommodations', 'No accommodations available at the moment.')}
                </p>
              </div>
            )}
          </div>
        </TabsContent>

        {/* Packages Tab */}
        <TabsContent value="packages">
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
            {isLoadingPackages ? (
              <div className="col-span-full flex justify-center py-12">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
              </div>
            ) : packages && packages.length > 0 ? (
              packages.map((pkg) => (
                <Card key={pkg.id} className="overflow-hidden">
                  <div className="relative h-48 w-full overflow-hidden">
                    <img 
                      src={pkg.image} 
                      alt={pkg.title}
                      className="h-full w-full object-cover transition-transform duration-300 hover:scale-105"
                    />
                    {pkg.featured && (
                      <div className="absolute top-2 right-2 bg-primary text-white text-xs px-2 py-1 rounded-full">
                        {t('common.featured')}
                      </div>
                    )}
                  </div>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-lg font-medium">{pkg.title}</CardTitle>
                    <CardDescription className="flex items-center text-sm">
                      <Calendar className="mr-1 h-4 w-4 text-primary" />
                      {pkg.duration}
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm line-clamp-2 mb-3">{pkg.description}</p>
                    <div className="flex justify-between items-center">
                      <span className="font-medium text-primary">
                        ${pkg.price.toFixed(2)}
                      </span>
                      <Button size="sm" variant="outline">
                        {t('common.viewDetails')}
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))
            ) : (
              <div className="col-span-full text-center py-12">
                <p className="text-muted-foreground">
                  {t('dashboard.noPackages', 'No travel packages available at the moment.')}
                </p>
              </div>
            )}
          </div>
        </TabsContent>
      </Tabs>

      {/* View all button */}
      <div className="mt-8 text-center">
        <Button 
          variant="outline" 
          className="px-8"
          onClick={() => {
            switch(activeTab) {
              case "experiences":
                setLocation("/experiences");
                break;
              case "accommodations":
                setLocation("/accommodations");
                break;
              case "packages":
                setLocation("/packages");
                break;
            }
          }}
        >
          {t('common.viewAll', 'View All')} {activeTab}
        </Button>
      </div>
    </main>
  );
}