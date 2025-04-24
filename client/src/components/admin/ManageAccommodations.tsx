import { useState } from 'react';
import { useAccommodationsStore } from '@/store/accommodationsStore';
import { useToast } from '@/hooks/use-toast';
import { z } from 'zod';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { insertAccommodationSchema, type Accommodation } from '@shared/schema';
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
import { Star, Edit, Trash2, PlusCircle, Loader2, Home } from 'lucide-react';
import { Badge } from '@/components/ui/badge';

// Extended schema for form validation
const formSchema = insertAccommodationSchema.extend({
  amenityInput: z.string().optional(),
});

type FormValues = z.infer<typeof formSchema>;

export default function ManageAccommodations() {
  const { accommodations, isLoading, createAccommodation, updateAccommodation, deleteAccommodation } = useAccommodationsStore();
  const { toast } = useToast();
  const [isCreating, setIsCreating] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [currentAccommodation, setCurrentAccommodation] = useState<Accommodation | null>(null);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [accommodationToDelete, setAccommodationToDelete] = useState<Accommodation | null>(null);

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: '',
      description: '',
      price: 0,
      image: '',
      featured: false,
      rating: 5.0,
      location: 'Fernando de Noronha, Brazil',
      amenities: [],
      amenityInput: '',
      bedrooms: 1,
      capacity: 2,
    },
  });

  const handleCreateClick = () => {
    form.reset({
      title: '',
      description: '',
      price: 0,
      image: '',
      featured: false,
      rating: 5.0,
      location: 'Fernando de Noronha, Brazil',
      amenities: [],
      amenityInput: '',
      bedrooms: 1,
      capacity: 2,
    });
    setIsCreating(true);
  };

  const handleEditClick = (accommodation: Accommodation) => {
    setCurrentAccommodation(accommodation);
    form.reset({
      title: accommodation.title,
      description: accommodation.description,
      price: accommodation.price,
      image: accommodation.image,
      featured: accommodation.featured,
      rating: accommodation.rating || 5.0,
      location: accommodation.location || 'Fernando de Noronha, Brazil',
      amenities: accommodation.amenities || [],
      amenityInput: '',
      bedrooms: accommodation.bedrooms || 1,
      capacity: accommodation.capacity || 2,
    });
    setIsEditing(true);
  };

  const handleDeleteClick = (accommodation: Accommodation) => {
    setAccommodationToDelete(accommodation);
    setIsDeleteDialogOpen(true);
  };

  const confirmDelete = async () => {
    if (!accommodationToDelete) return;
    
    try {
      await deleteAccommodation(accommodationToDelete.id);
      toast({
        title: 'Accommodation deleted',
        description: `${accommodationToDelete.title} has been deleted successfully.`,
      });
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to delete accommodation. Please try again.',
        variant: 'destructive',
      });
    } finally {
      setIsDeleteDialogOpen(false);
      setAccommodationToDelete(null);
    }
  };

  const onSubmit = async (data: FormValues) => {
    // Process amenities from the amenityInput field if provided
    const formattedData = { ...data };
    
    // Remove the amenityInput field as it's not part of the schema
    delete formattedData.amenityInput;
    
    try {
      if (isEditing && currentAccommodation) {
        await updateAccommodation(currentAccommodation.id, formattedData);
        toast({
          title: 'Accommodation updated',
          description: 'The accommodation has been updated successfully.',
        });
      } else {
        await createAccommodation(formattedData);
        toast({
          title: 'Accommodation created',
          description: 'New accommodation has been created successfully.',
        });
      }
      setIsCreating(false);
      setIsEditing(false);
      setCurrentAccommodation(null);
    } catch (error) {
      toast({
        title: 'Error',
        description: isEditing 
          ? 'Failed to update accommodation. Please try again.' 
          : 'Failed to create accommodation. Please try again.',
        variant: 'destructive',
      });
    }
  };

  const addAmenity = () => {
    const amenityInput = form.getValues('amenityInput');
    if (!amenityInput) return;
    
    const currentAmenities = form.getValues('amenities') || [];
    if (!currentAmenities.includes(amenityInput)) {
      form.setValue('amenities', [...currentAmenities, amenityInput]);
      form.setValue('amenityInput', '');
    }
  };

  const removeAmenity = (amenityToRemove: string) => {
    const currentAmenities = form.getValues('amenities') || [];
    form.setValue('amenities', currentAmenities.filter(amenity => amenity !== amenityToRemove));
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h3 className="text-xl font-bold tracking-tight">Manage Accommodations</h3>
          <p className="text-gray-500">Create, edit, and delete accommodations for Fernando de Noronha.</p>
        </div>
        <Button onClick={handleCreateClick} className="flex items-center gap-2">
          <PlusCircle className="h-4 w-4" /> Add New Accommodation
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>All Accommodations</CardTitle>
          <CardDescription>
            You have a total of {accommodations.length} accommodations.
          </CardDescription>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="flex justify-center items-center h-40">
              <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
          ) : accommodations.length === 0 ? (
            <div className="text-center py-8">
              <p className="text-gray-500">No accommodations found. Create your first accommodation!</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Title</TableHead>
                    <TableHead>Price (per night)</TableHead>
                    <TableHead>Bedrooms</TableHead>
                    <TableHead>Capacity</TableHead>
                    <TableHead>Rating</TableHead>
                    <TableHead>Featured</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {accommodations.map(accommodation => (
                    <TableRow key={accommodation.id}>
                      <TableCell className="font-medium">{accommodation.title}</TableCell>
                      <TableCell>${accommodation.price.toFixed(2)}</TableCell>
                      <TableCell>{accommodation.bedrooms || 1}</TableCell>
                      <TableCell>{accommodation.capacity || 2} guests</TableCell>
                      <TableCell>
                        <div className="flex items-center">
                          <Star className="h-4 w-4 text-accent fill-accent mr-1" />
                          {accommodation.rating?.toFixed(1) || 'N/A'}
                        </div>
                      </TableCell>
                      <TableCell>{accommodation.featured ? 'Yes' : 'No'}</TableCell>
                      <TableCell>
                        <div className="flex items-center space-x-2">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleEditClick(accommodation)}
                            className="h-8 w-8 p-0"
                          >
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleDeleteClick(accommodation)}
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

      {/* Create/Edit Accommodation Dialog */}
      <Dialog 
        open={isCreating || isEditing} 
        onOpenChange={(open) => {
          if (!open) {
            setIsCreating(false);
            setIsEditing(false);
            setCurrentAccommodation(null);
          }
        }}
      >
        <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>{isEditing ? 'Edit Accommodation' : 'Create New Accommodation'}</DialogTitle>
            <DialogDescription>
              {isEditing ? 'Update the details of this accommodation.' : 'Add a new accommodation to your offerings.'}
            </DialogDescription>
          </DialogHeader>
          
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <FormField
                control={form.control}
                name="title"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Title</FormLabel>
                    <FormControl>
                      <Input placeholder="Oceanfront Villa Serenity" {...field} />
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
                        placeholder="Describe the accommodation..." 
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
                  name="price"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Price per Night (USD)</FormLabel>
                      <FormControl>
                        <Input 
                          type="number" 
                          min="0" 
                          step="0.01"
                          placeholder="299.99" 
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
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <FormField
                  control={form.control}
                  name="bedrooms"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Bedrooms</FormLabel>
                      <FormControl>
                        <Input 
                          type="number" 
                          min="1"
                          placeholder="2" 
                          {...field}
                          onChange={e => field.onChange(parseInt(e.target.value))}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="capacity"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Capacity (Guests)</FormLabel>
                      <FormControl>
                        <Input 
                          type="number" 
                          min="1"
                          placeholder="4" 
                          {...field}
                          onChange={e => field.onChange(parseInt(e.target.value))}
                        />
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
                      Provide a URL to a high-quality image of this accommodation.
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
                name="amenities"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Amenities</FormLabel>
                    <div className="flex flex-wrap gap-2 mb-2">
                      {field.value?.map(amenity => (
                        <Badge key={amenity} variant="secondary" className="px-3 py-1">
                          {amenity}
                          <button
                            type="button"
                            onClick={() => removeAmenity(amenity)}
                            className="ml-2 text-gray-500 hover:text-gray-700"
                          >
                            &times;
                          </button>
                        </Badge>
                      ))}
                    </div>
                    <div className="flex space-x-2">
                      <Input
                        placeholder="Add an amenity"
                        {...form.register('amenityInput')}
                        onKeyDown={(e) => {
                          if (e.key === 'Enter') {
                            e.preventDefault();
                            addAmenity();
                          }
                        }}
                      />
                      <Button type="button" onClick={addAmenity} variant="outline">
                        Add
                      </Button>
                    </div>
                    <FormDescription>
                      Examples: Pool, Beach Access, WiFi, Kitchen, etc.
                    </FormDescription>
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
                      <FormLabel>Featured Accommodation</FormLabel>
                      <FormDescription>
                        Featured accommodations will be prominently displayed on the homepage.
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
                    isEditing ? 'Update Accommodation' : 'Create Accommodation'
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
              This will permanently delete the accommodation "{accommodationToDelete?.title}". This action cannot be undone.
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
