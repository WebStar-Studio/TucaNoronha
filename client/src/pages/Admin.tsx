import { useAuth } from "@/hooks/use-auth";
import { useLocation } from "wouter";
import { useEffect } from "react";
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

  return (
    <div className="min-h-screen pt-24 pb-16 bg-background">
      <div className="max-w-7xl mx-auto px-4">
        <h1 className="text-3xl font-bold mb-6">Admin Dashboard</h1>
        
        <Tabs defaultValue="experiences" className="w-full">
          <TabsList className="mb-6">
            <TabsTrigger value="experiences">Experiences</TabsTrigger>
            <TabsTrigger value="accommodations">Accommodations</TabsTrigger>
            <TabsTrigger value="packages">Packages</TabsTrigger>
          </TabsList>
          
          <TabsContent value="experiences">
            <Card>
              <CardHeader>
                <CardTitle>Add New Experience</CardTitle>
                <CardDescription>
                  Create a new experience for tourists to enjoy
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
                <CardTitle>Add New Accommodation</CardTitle>
                <CardDescription>
                  Create a new accommodation option for visitors
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
                <CardTitle>Add New Package</CardTitle>
                <CardDescription>
                  Create a new travel package combining multiple services
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
}
