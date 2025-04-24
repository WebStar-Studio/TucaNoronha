import { useState } from 'react';
import { useRestaurantsStore } from '@/store/restaurantsStore';
import { useToast } from '@/hooks/use-toast';
import { z } from 'zod';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { insertRestaurantSchema, type Restaurant } from '@shared/schema';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Checkbox } from '@/components/ui/checkbox';
import { Star, Edit, Trash2, PlusCircle, Loader2 } from 'lucide-react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

type FormValues = z.infer<typeof insertRestaurantSchema>;

export default function ManageRestaurants() {
  const { restaurants, isLoading, createRestaurant, updateRestaurant, deleteRestaurant } = useRestaurantsStore();
  const { toast } = useToast();
  const [isCreating, setIsCreating] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [currentRestaurant, setCurrentRestaurant] = useState<Restaurant | null>(null);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [restaurantToDelete, setRestaurantToDelete] = useState<Restaurant | null>(null);

  const form = useForm<FormValues>({
    resolver: zodResolver(insertRestaurantSchema),
    defaultValues: {
      name: '',
      description: '',
      cuisine: '',
      priceRange: '$',
      image: '',
      location: 'Fernando de Noronha, Brazil',
      openingHours: '',
      featured: false,
      rating: 5.0,
    },
  });

  const handleCreateClick = () => {
    form.reset({
      name: '',
      description: '',
      cuisine: '',
      priceRange: '$',
      image: '',
      location: 'Fernando de Noronha, Brazil',
      openingHours: '',
      featured: false,
      rating: 5.0,
    });
    setIsCreating(true);
  };

  const handleEditClick = (restaurant: Restaurant) => {
    setCurrentRestaurant(restaurant);
    form.reset({
      name: restaurant.name,
      description: restaurant.description,
      cuisine: restaurant.cuisine,
      priceRange: restaurant.priceRange,
      image: restaurant.image,
      location: restaurant.location || 'Fernando de Noronha, Brazil',
      openingHours: restaurant.openingHours || '',
      featured: restaurant.featured,
      rating: restaurant.rating || 5.0,
    });
    setIsEditing(true);
  };

  const handleDeleteClick = (restaurant: Restaurant) => {
    setRestaurantToDelete(restaurant);
    setIsDeleteDialogOpen(true);
  };

  const confirmDelete = async () => {
    if (!restaurantToDelete) return;
    
    try {
      await deleteRestaurant(restaurantToDelete.id);
      toast({
        title: 'Restaurant deleted',
        description: `${restaurantToDelete.name} has been deleted successfully.`,
      });
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to delete restaurant. Please try again.',
        variant: 'destructive',
      });
    } finally {
      setIsDeleteDialogOpen(false);
      setRestaurantToDelete(null);
    }
  };

  const onSubmit = async (data: FormValues) => {
    try {
      if (isEditing && currentRestaurant) {
        await updateRestaurant(currentRestaurant.id, data);
        toast({
          title: 'Restaurant updated',
          description: 'The restaurant has been updated successfully.',
        });
      } else {
        await createRestaurant(data);
        toast({
          title: 'Restaurant created',
          description: 'New restaurant has been created successfully.',
        });
      }
      setIsCreating(false);
      setIsEditing(false);
      setCurrentRestaurant(null);
    } catch (error) {
      toast({
        title: 'Error',
        description: isEditing 
          ? 'Failed to update restaurant. Please try again.' 
          : 'Failed to create restaurant. Please try again.',
        variant: 'destructive',
      });
    }
  };

  const cuisineOptions = [
    'Brazilian',
    'Seafood',
    'International',
    'Italian',
    'Japanese',
    'Mediterranean',
    'Vegetarian',
    'Fusion',
    'Grill',
    'Other'
  ];

  const priceRangeOptions = [
    { value: '$', label: '$ (Budget)' },
    { value: '$$', label: '$$ (Moderate)' },
    { value: '$$$', label: '$$$ (Expensive)' },
    { value: '$$$$', label: '$$$$ (Very Expensive)' },
  ];

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h3 className="text-xl font-bold tracking-tight">Manage Restaurants</h3>
          <p className="text-gray-500">Create, edit, and delete restaurant listings for Fernando de Noronha.</p>
        </div>
        <Button onClick={handleCreateClick} className="flex items-center gap-2">
          <PlusCircle className="h-4 w-4" /> Add New Restaurant
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>All Restaurants</CardTitle>
          <CardDescription>
            You have a total of {restaurants.length} restaurant listings.
          </CardDescription>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="flex justify-center items-center h-40">
              <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
          ) : restaurants.length === 0 ? (
            <div className="text-center py-8">
              <p className="text-gray-500">No restaurants found. Create your first restaurant listing!</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Name</TableHead>
                    <TableHead>Cuisine</TableHead>
                    <TableHead>Price Range</TableHead>
                    <TableHead>Location</TableHead>
                    <TableHead>Rating</TableHead>
                    <TableHead>Featured</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {restaurants.map(restaurant => (
                    <TableRow key={restaurant.id}>
                      <TableCell className="font-medium">{restaurant.name}</TableCell>
                      <TableCell>{restaurant.cuisine}</TableCell>
                      <TableCell>{restaurant.priceRange}</TableCell>
                      <TableCell>{restaurant.location || 'Fernando de Noronha'}</TableCell>
                      <TableCell>
                        <div className="flex items-center">
                          <Star className="h-4 w-4 text-accent fill-accent mr-1" />
                          {restaurant.rating?.toFixed(1) || 'N/A'}
                        </div>
                      </TableCell>
                      <TableCell>{restaurant.featured ? 'Yes' : 'No'}</TableCell>
                      <TableCell>
                        <div className="flex items-center space-x-2">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleEditClick(restaurant)}
                            className="h-8 w-8 p-0"
                          >
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleDeleteClick(restaurant)}
                            className="h-8 w-8 p-0 text-red-500 hover:text-red-700 hover:bg-red-50"
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Create/Edit Restaurant Dialog */}
      <Dialog 
        open={isCreating || isEditing} 
        onOpenChange={(open) => {
          if (!open) {
            setIsCreating(false);
            setIsEditing(false);
            setCurrentRestaurant(null);
          }
        }}
      >
        <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>{isEditing ? 'Edit Restaurant' : 'Create New Restaurant'}</DialogTitle>
            <DialogDescription>
              {isEditing ? 'Update the details of this restaurant.' : 'Add a new restaurant to your listings.'}
            </DialogDescription>
          </DialogHeader>
          
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Restaurant Name</FormLabel>
                    <FormControl>
                      <Input placeholder="Ocean View Restaurant" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="description"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Description</FormLabel>
                    <FormControl>
                      <Textarea 
                        placeholder="Describe the restaurant..." 
                        className="resize-none min-h-[100px]" 
                        {...field} 
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <FormField
                  control={form.control}
                  name="cuisine"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Cuisine</FormLabel>
                      <Select 
                        onValueChange={field.onChange} 
                        defaultValue={field.value}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select cuisine type" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {cuisineOptions.map(cuisine => (
                            <SelectItem key={cuisine} value={cuisine}>
                              {cuisine}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="priceRange"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Price Range</FormLabel>
                      <Select 
                        onValueChange={field.onChange} 
                        defaultValue={field.value}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select price range" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {priceRangeOptions.map(option => (
                            <SelectItem key={option.value} value={option.value}>
                              {option.label}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <FormField
                  control={form.control}
                  name="location"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Location</FormLabel>
                      <FormControl>
                        <Input placeholder="Fernando de Noronha, Brazil" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="openingHours"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Opening Hours</FormLabel>
                      <FormControl>
                        <Input placeholder="Mon-Sun: 12PM-10PM" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              
              <FormField
                control={form.control}
                name="image"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Image URL</FormLabel>
                    <FormControl>
                      <Input placeholder="https://example.com/image.jpg" {...field} />
                    </FormControl>
                    <FormDescription>
                      Provide a URL to a high-quality image of this restaurant.
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="rating"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Rating (0-5)</FormLabel>
                    <FormControl>
                      <Input 
                        type="number" 
                        min="0" 
                        max="5" 
                        step="0.1"
                        placeholder="4.5" 
                        {...field}
                        onChange={e => field.onChange(parseFloat(e.target.value))}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="featured"
                render={({ field }) => (
                  <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4">
                    <FormControl>
                      <Checkbox
                        checked={field.value}
                        onCheckedChange={field.onChange}
                      />
                    </FormControl>
                    <div className="space-y-1 leading-none">
                      <FormLabel>Featured Restaurant</FormLabel>
                      <FormDescription>
                        Featured restaurants will be prominently displayed on relevant pages.
                      </FormDescription>
                    </div>
                  </FormItem>
                )}
              />
              
              <DialogFooter>
                <Button type="submit" className="btn-gradient">
                  {form.formState.isSubmitting ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      {isEditing ? 'Updating...' : 'Creating...'}
                    </>
                  ) : (
                    isEditing ? 'Update Restaurant' : 'Create Restaurant'
                  )}
                </Button>
              </DialogFooter>
            </form>
          </Form>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This will permanently delete the restaurant "{restaurantToDelete?.name}". This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={confirmDelete} className="bg-red-600 hover:bg-red-700">
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
