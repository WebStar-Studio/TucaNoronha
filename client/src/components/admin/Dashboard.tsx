import { useState, useEffect } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useAuthStore } from '@/store/authStore';
import { useExperiencesStore } from '@/store/experiencesStore';
import { useAccommodationsStore } from '@/store/accommodationsStore';
import { usePackagesStore } from '@/store/packagesStore';
import { useVehiclesStore } from '@/store/vehiclesStore';
import { useRestaurantsStore } from '@/store/restaurantsStore';
import ManageExperiences from './ManageExperiences';
import ManageAccommodations from './ManageAccommodations';
import ManagePackages from './ManagePackages';
import ManageVehicles from './ManageVehicles';
import ManageRestaurants from './ManageRestaurants';
import { MapPin, Users, Home, Car, Utensils, Package } from 'lucide-react';

export default function Dashboard() {
  const { user } = useAuthStore();
  const { experiences, loadExperiences } = useExperiencesStore();
  const { accommodations, loadAccommodations } = useAccommodationsStore();
  const { packages, loadPackages } = usePackagesStore();
  const { vehicles, loadVehicles } = useVehiclesStore();
  const { restaurants, loadRestaurants } = useRestaurantsStore();
  const [activeTab, setActiveTab] = useState('overview');

  useEffect(() => {
    loadExperiences();
    loadAccommodations();
    loadPackages();
    loadVehicles();
    loadRestaurants();
  }, [loadExperiences, loadAccommodations, loadPackages, loadVehicles, loadRestaurants]);

  return (
    <div className="p-6">
      <div className="mb-6">
        <h1 className="text-3xl font-bold tracking-tight">Admin Dashboard</h1>
        <p className="text-gray-500">Welcome back, {user?.first_name || 'Admin'}!</p>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
        <TabsList className="grid grid-cols-6 sm:grid-cols-3 lg:grid-cols-6 gap-2">
          <TabsTrigger value="overview" className="sm:col-span-1 flex items-center">
            <Users className="w-4 h-4 mr-2" /> Overview
          </TabsTrigger>
          <TabsTrigger value="experiences" className="sm:col-span-1 flex items-center">
            <MapPin className="w-4 h-4 mr-2" /> Experiences
          </TabsTrigger>
          <TabsTrigger value="accommodations" className="sm:col-span-1 flex items-center">
            <Home className="w-4 h-4 mr-2" /> Accommodations
          </TabsTrigger>
          <TabsTrigger value="packages" className="sm:col-span-1 flex items-center">
            <Package className="w-4 h-4 mr-2" /> Packages
          </TabsTrigger>
          <TabsTrigger value="vehicles" className="sm:col-span-1 flex items-center">
            <Car className="w-4 h-4 mr-2" /> Vehicles
          </TabsTrigger>
          <TabsTrigger value="restaurants" className="sm:col-span-1 flex items-center">
            <Utensils className="w-4 h-4 mr-2" /> Restaurants
          </TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6">
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total Experiences</CardTitle>
                <MapPin className="h-4 w-4 text-primary" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{experiences.length}</div>
                <p className="text-xs text-muted-foreground">
                  {experiences.filter(exp => exp.featured).length} featured experiences
                </p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total Accommodations</CardTitle>
                <Home className="h-4 w-4 text-secondary" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{accommodations.length}</div>
                <p className="text-xs text-muted-foreground">
                  {accommodations.filter(acc => acc.featured).length} featured accommodations
                </p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total Packages</CardTitle>
                <Package className="h-4 w-4 text-accent" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{packages.length}</div>
                <p className="text-xs text-muted-foreground">
                  {packages.filter(pkg => pkg.featured).length} featured packages
                </p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total Vehicles</CardTitle>
                <Car className="h-4 w-4 text-primary" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{vehicles.length}</div>
                <p className="text-xs text-muted-foreground">Available for rental</p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total Restaurants</CardTitle>
                <Utensils className="h-4 w-4 text-secondary" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{restaurants.length}</div>
                <p className="text-xs text-muted-foreground">
                  {restaurants.filter(r => r.featured).length} featured restaurants
                </p>
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Admin Quick Actions</CardTitle>
              <CardDescription>Manage your tourism services quickly from here</CardDescription>
            </CardHeader>
            <CardContent className="grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
              <button 
                onClick={() => setActiveTab('experiences')}
                className="p-4 border rounded-lg hover:border-primary hover:bg-primary/5 transition flex flex-col items-center justify-center"
              >
                <MapPin className="h-6 w-6 text-primary mb-2" />
                <span>Manage Experiences</span>
              </button>
              <button 
                onClick={() => setActiveTab('accommodations')}
                className="p-4 border rounded-lg hover:border-secondary hover:bg-secondary/5 transition flex flex-col items-center justify-center"
              >
                <Home className="h-6 w-6 text-secondary mb-2" />
                <span>Manage Accommodations</span>
              </button>
              <button 
                onClick={() => setActiveTab('packages')}
                className="p-4 border rounded-lg hover:border-accent hover:bg-accent/5 transition flex flex-col items-center justify-center"
              >
                <Package className="h-6 w-6 text-accent mb-2" />
                <span>Manage Packages</span>
              </button>
              <button 
                onClick={() => setActiveTab('vehicles')}
                className="p-4 border rounded-lg hover:border-primary hover:bg-primary/5 transition flex flex-col items-center justify-center"
              >
                <Car className="h-6 w-6 text-primary mb-2" />
                <span>Manage Vehicles</span>
              </button>
              <button 
                onClick={() => setActiveTab('restaurants')}
                className="p-4 border rounded-lg hover:border-secondary hover:bg-secondary/5 transition flex flex-col items-center justify-center"
              >
                <Utensils className="h-6 w-6 text-secondary mb-2" />
                <span>Manage Restaurants</span>
              </button>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="experiences">
          <ManageExperiences />
        </TabsContent>

        <TabsContent value="accommodations">
          <ManageAccommodations />
        </TabsContent>

        <TabsContent value="packages">
          <ManagePackages />
        </TabsContent>

        <TabsContent value="vehicles">
          <ManageVehicles />
        </TabsContent>

        <TabsContent value="restaurants">
          <ManageRestaurants />
        </TabsContent>
      </Tabs>
    </div>
  );
}
