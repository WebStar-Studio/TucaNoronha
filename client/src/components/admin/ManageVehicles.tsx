import { useState } from 'react';
import { useVehiclesStore } from '@/store/vehiclesStore';
import { useToast } from '@/hooks/use-toast';
import { z } from 'zod';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { insertVehicleRentalSchema, type VehicleRental } from '@shared/schema';
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
import { Edit, Trash2, PlusCircle, Loader2, Car, Users } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

// Extended schema for form validation
const formSchema = insertVehicleRentalSchema.extend({
  featureInput: z.string().optional(),
});

type FormValues = z.infer<typeof formSchema>;

export default function ManageVehicles() {
  const { vehicles, isLoading, createVehicle, updateVehicle, deleteVehicle } = useVehiclesStore();
  const { toast } = useToast();
  const [isCreating, setIsCreating] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [currentVehicle, setCurrentVehicle] = useState<VehicleRental | null>(null);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [vehicleToDelete, setVehicleToDelete] = useState<VehicleRental | null>(null);

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      vehicleType: 'car',
      title: '',
      description: '',
      pricePerDay: 0,
      image: '',
      capacity: 2,
      features: [],
      featureInput: '',
    },
  });

  const handleCreateClick = () => {
    form.reset({
      vehicleType: 'car',
      title: '',
      description: '',
      pricePerDay: 0,
      image: '',
      capacity: 2,
      features: [],
      featureInput: '',
    });
    setIsCreating(true);
  };

  const handleEditClick = (vehicle: VehicleRental) => {
    setCurrentVehicle(vehicle);
    form.reset({
      vehicleType: vehicle.vehicleType,
      title: vehicle.title,
      description: vehicle.description,
      pricePerDay: vehicle.pricePerDay,
      image: vehicle.image,
      capacity: vehicle.capacity || 2,
      features: vehicle.features || [],
      featureInput: '',
    });
    setIsEditing(true);
  };

  const handleDeleteClick = (vehicle: VehicleRental) => {
    setVehicleToDelete(vehicle);
    setIsDeleteDialogOpen(true);
  };

  const confirmDelete = async () => {
    if (!vehicleToDelete) return;
    
    try {
      await deleteVehicle(vehicleToDelete.id);
      toast({
        title: 'Vehicle deleted',
        description: `${vehicleToDelete.title} has been deleted successfully.`,
      });
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to delete vehicle. Please try again.',
        variant: 'destructive',
      });
    } finally {
      setIsDeleteDialogOpen(false);
      setVehicleToDelete(null);
    }
  };

  const onSubmit = async (data: FormValues) => {
    // Remove the featureInput field as it's not part of the schema
    const formattedData = { ...data };
    delete formattedData.featureInput;
    
    try {
      if (isEditing && currentVehicle) {
        await updateVehicle(currentVehicle.id, formattedData);
        toast({
          title: 'Vehicle updated',
          description: 'The vehicle has been updated successfully.',
        });
      } else {
        await createVehicle(formattedData);
        toast({
          title: 'Vehicle created',
          description: 'New vehicle has been created successfully.',
        });
      }
      setIsCreating(false);
      setIsEditing(false);
      setCurrentVehicle(null);
    } catch (error) {
      toast({
        title: 'Error',
        description: isEditing 
          ? 'Failed to update vehicle. Please try again.' 
          : 'Failed to create vehicle. Please try again.',
        variant: 'destructive',
      });
    }
  };

  const addFeature = () => {
    const featureInput = form.getValues('featureInput');
    if (!featureInput) return;
    
    const currentFeatures = form.getValues('features') || [];
    if (!currentFeatures.includes(featureInput)) {
      form.setValue('features', [...currentFeatures, featureInput]);
      form.setValue('featureInput', '');
    }
  };

  const removeFeature = (featureToRemove: string) => {
    const currentFeatures = form.getValues('features') || [];
    form.setValue('features', currentFeatures.filter(feature => feature !== featureToRemove));
  };

  const vehicleTypeOptions = [
    { value: 'car', label: 'Car' },
    { value: 'scooter', label: 'Scooter' },
    { value: 'bike', label: 'Bike' },
    { value: 'buggy', label: 'Buggy' },
    { value: 'jeep', label: 'Jeep' },
    { value: 'atv', label: 'ATV' },
  ];

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h3 className="text-xl font-bold tracking-tight">Manage Vehicles</h3>
          <p className="text-gray-500">Create, edit, and delete vehicles available for rental.</p>
        </div>
        <Button onClick={handleCreateClick} className="flex items-center gap-2">
          <PlusCircle className="h-4 w-4" /> Add New Vehicle
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>All Vehicles</CardTitle>
          <CardDescription>
            You have a total of {vehicles.length} vehicles available for rental.
          </CardDescription>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="flex justify-center items-center h-40">
              <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
          ) : vehicles.length === 0 ? (
            <div className="text-center py-8">
              <p className="text-gray-500">No vehicles found. Create your first vehicle rental option!</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Title</TableHead>
                    <TableHead>Type</TableHead>
                    <TableHead>Price per Day</TableHead>
                    <TableHead>Capacity</TableHead>
                    <TableHead>Features</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {vehicles.map(vehicle => (
                    <TableRow key={vehicle.id}>
                      <TableCell className="font-medium">{vehicle.title}</TableCell>
                      <TableCell className="capitalize">{vehicle.vehicleType}</TableCell>
                      <TableCell>${vehicle.pricePerDay.toFixed(2)}</TableCell>
                      <TableCell>
                        <div className="flex items-center">
                          <Users className="h-4 w-4 mr-1 text-gray-500" />
                          {vehicle.capacity || 'N/A'}
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex flex-wrap gap-1">
                          {vehicle.features && vehicle.features.length > 0 
                            ? vehicle.features.slice(0, 2).map((feature, i) => (
                                <Badge key={i} variant="outline" className="mr-1">
                                  {feature}
                                </Badge>
                              ))
                            : 'N/A'}
                          {vehicle.features && vehicle.features.length > 2 && (
                            <Badge variant="outline">+{vehicle.features.length - 2} more</Badge>
                          )}
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center space-x-2">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleEditClick(vehicle)}
                            className="h-8 w-8 p-0"
                          >
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleDeleteClick(vehicle)}
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

      {/* Create/Edit Vehicle Dialog */}
      <Dialog 
        open={isCreating || isEditing} 
        onOpenChange={(open) => {
          if (!open) {
            setIsCreating(false);
            setIsEditing(false);
            setCurrentVehicle(null);
          }
        }}
      >
        <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>{isEditing ? 'Edit Vehicle' : 'Create New Vehicle'}</DialogTitle>
            <DialogDescription>
              {isEditing ? 'Update the details of this vehicle.' : 'Add a new vehicle to your rental offerings.'}
            </DialogDescription>
          </DialogHeader>
          
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <FormField
                  control={form.control}
                  name="vehicleType"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Vehicle Type</FormLabel>
                      <Select 
                        onValueChange={field.onChange} 
                        defaultValue={field.value}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select vehicle type" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {vehicleTypeOptions.map(option => (
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
                
                <FormField
                  control={form.control}
                  name="title"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Title</FormLabel>
                      <FormControl>
                        <Input placeholder="Beach Buggy Elite" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              
              <FormField
                control={form.control}
                name="description"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Description</FormLabel>
                    <FormControl>
                      <Textarea 
                        placeholder="Describe the vehicle..." 
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
                  name="pricePerDay"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Price Per Day (USD)</FormLabel>
                      <FormControl>
                        <Input 
                          type="number" 
                          min="0" 
                          step="0.01"
                          placeholder="99.99" 
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
                  name="capacity"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Capacity (People)</FormLabel>
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
                      Provide a URL to a high-quality image of this vehicle.
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="features"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Features</FormLabel>
                    <div className="flex flex-wrap gap-2 mb-2">
                      {field.value?.map(feature => (
                        <Badge key={feature} variant="secondary" className="px-3 py-1">
                          {feature}
                          <button
                            type="button"
                            onClick={() => removeFeature(feature)}
                            className="ml-2 text-gray-500 hover:text-gray-700"
                          >
                            &times;
                          </button>
                        </Badge>
                      ))}
                    </div>
                    <div className="flex space-x-2">
                      <Input
                        placeholder="Add a feature"
                        {...form.register('featureInput')}
                        onKeyDown={(e) => {
                          if (e.key === 'Enter') {
                            e.preventDefault();
                            addFeature();
                          }
                        }}
                      />
                      <Button type="button" onClick={addFeature} variant="outline">
                        Add
                      </Button>
                    </div>
                    <FormDescription>
                      Examples: Air conditioning, GPS, Automatic, Off-road capabilities, etc.
                    </FormDescription>
                    <FormMessage />
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
                    isEditing ? 'Update Vehicle' : 'Create Vehicle'
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
              This will permanently delete the vehicle "{vehicleToDelete?.title}". This action cannot be undone.
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
