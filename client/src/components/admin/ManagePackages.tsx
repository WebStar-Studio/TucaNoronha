import { useState } from 'react';
import { usePackagesStore } from '@/store/packagesStore';
import { useToast } from '@/hooks/use-toast';
import { z } from 'zod';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { insertPackageSchema, type Package } from '@shared/schema';
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
import { Edit, Trash2, PlusCircle, Loader2 } from 'lucide-react';
import { Badge } from '@/components/ui/badge';

// Extended schema for form validation
const formSchema = insertPackageSchema.extend({
  inclusionInput: z.string().optional(),
  tagInput: z.string().optional(),
});

type FormValues = z.infer<typeof formSchema>;

export default function ManagePackages() {
  const { packages, isLoading, createPackage, updatePackage, deletePackage } = usePackagesStore();
  const { toast } = useToast();
  const [isCreating, setIsCreating] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [currentPackage, setCurrentPackage] = useState<Package | null>(null);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [packageToDelete, setPackageToDelete] = useState<Package | null>(null);

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: '',
      description: '',
      price: 0,
      image: '',
      featured: false,
      duration: '',
      inclusions: [],
      inclusionInput: '',
      tags: [],
      tagInput: '',
    },
  });

  const handleCreateClick = () => {
    form.reset({
      title: '',
      description: '',
      price: 0,
      image: '',
      featured: false,
      duration: '',
      inclusions: [],
      inclusionInput: '',
      tags: [],
      tagInput: '',
    });
    setIsCreating(true);
  };

  const handleEditClick = (pkg: Package) => {
    setCurrentPackage(pkg);
    form.reset({
      title: pkg.title,
      description: pkg.description,
      price: pkg.price,
      image: pkg.image,
      featured: pkg.featured,
      duration: pkg.duration,
      inclusions: pkg.inclusions || [],
      inclusionInput: '',
      tags: pkg.tags || [],
      tagInput: '',
    });
    setIsEditing(true);
  };

  const handleDeleteClick = (pkg: Package) => {
    setPackageToDelete(pkg);
    setIsDeleteDialogOpen(true);
  };

  const confirmDelete = async () => {
    if (!packageToDelete) return;
    
    try {
      await deletePackage(packageToDelete.id);
      toast({
        title: 'Package deleted',
        description: `${packageToDelete.title} has been deleted successfully.`,
      });
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to delete package. Please try again.',
        variant: 'destructive',
      });
    } finally {
      setIsDeleteDialogOpen(false);
      setPackageToDelete(null);
    }
  };

  const onSubmit = async (data: FormValues) => {
    // Remove the input fields that are not part of the schema
    const formattedData = { ...data };
    delete formattedData.inclusionInput;
    delete formattedData.tagInput;
    
    try {
      if (isEditing && currentPackage) {
        await updatePackage(currentPackage.id, formattedData);
        toast({
          title: 'Package updated',
          description: 'The package has been updated successfully.',
        });
      } else {
        await createPackage(formattedData);
        toast({
          title: 'Package created',
          description: 'New package has been created successfully.',
        });
      }
      setIsCreating(false);
      setIsEditing(false);
      setCurrentPackage(null);
    } catch (error) {
      toast({
        title: 'Error',
        description: isEditing 
          ? 'Failed to update package. Please try again.' 
          : 'Failed to create package. Please try again.',
        variant: 'destructive',
      });
    }
  };

  const addInclusion = () => {
    const inclusionInput = form.getValues('inclusionInput');
    if (!inclusionInput) return;
    
    const currentInclusions = form.getValues('inclusions') || [];
    if (!currentInclusions.includes(inclusionInput)) {
      form.setValue('inclusions', [...currentInclusions, inclusionInput]);
      form.setValue('inclusionInput', '');
    }
  };

  const removeInclusion = (inclusionToRemove: string) => {
    const currentInclusions = form.getValues('inclusions') || [];
    form.setValue('inclusions', currentInclusions.filter(inclusion => inclusion !== inclusionToRemove));
  };

  const addTag = () => {
    const tagInput = form.getValues('tagInput');
    if (!tagInput) return;
    
    const currentTags = form.getValues('tags') || [];
    if (!currentTags.includes(tagInput)) {
      form.setValue('tags', [...currentTags, tagInput]);
      form.setValue('tagInput', '');
    }
  };

  const removeTag = (tagToRemove: string) => {
    const currentTags = form.getValues('tags') || [];
    form.setValue('tags', currentTags.filter(tag => tag !== tagToRemove));
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h3 className="text-xl font-bold tracking-tight">Manage Packages</h3>
          <p className="text-gray-500">Create, edit, and delete vacation packages for Fernando de Noronha.</p>
        </div>
        <Button onClick={handleCreateClick} className="flex items-center gap-2">
          <PlusCircle className="h-4 w-4" /> Add New Package
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>All Packages</CardTitle>
          <CardDescription>
            You have a total of {packages.length} packages.
          </CardDescription>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="flex justify-center items-center h-40">
              <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
          ) : packages.length === 0 ? (
            <div className="text-center py-8">
              <p className="text-gray-500">No packages found. Create your first package!</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Title</TableHead>
                    <TableHead>Price</TableHead>
                    <TableHead>Duration</TableHead>
                    <TableHead>Inclusions</TableHead>
                    <TableHead>Featured</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {packages.map(pkg => (
                    <TableRow key={pkg.id}>
                      <TableCell className="font-medium">{pkg.title}</TableCell>
                      <TableCell>${pkg.price.toFixed(2)}</TableCell>
                      <TableCell>{pkg.duration}</TableCell>
                      <TableCell>
                        <div className="flex flex-wrap gap-1">
                          {pkg.inclusions && pkg.inclusions.length > 0 
                            ? pkg.inclusions.slice(0, 2).map((inclusion, i) => (
                                <Badge key={i} variant="outline" className="mr-1">
                                  {inclusion}
                                </Badge>
                              ))
                            : 'N/A'}
                          {pkg.inclusions && pkg.inclusions.length > 2 && (
                            <Badge variant="outline">+{pkg.inclusions.length - 2} more</Badge>
                          )}
                        </div>
                      </TableCell>
                      <TableCell>{pkg.featured ? 'Yes' : 'No'}</TableCell>
                      <TableCell>
                        <div className="flex items-center space-x-2">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleEditClick(pkg)}
                            className="h-8 w-8 p-0"
                          >
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleDeleteClick(pkg)}
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

      {/* Create/Edit Package Dialog */}
      <Dialog 
        open={isCreating || isEditing} 
        onOpenChange={(open) => {
          if (!open) {
            setIsCreating(false);
            setIsEditing(false);
            setCurrentPackage(null);
          }
        }}
      >
        <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>{isEditing ? 'Edit Package' : 'Create New Package'}</DialogTitle>
            <DialogDescription>
              {isEditing ? 'Update the details of this package.' : 'Add a new vacation package to your offerings.'}
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
                      <Input placeholder="Adventure Explorer Package" {...field} />
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
                        placeholder="Describe the package..." 
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
                      <FormLabel>Price (USD)</FormLabel>
                      <FormControl>
                        <Input 
                          type="number" 
                          min="0" 
                          step="0.01"
                          placeholder="1299.99" 
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
                  name="duration"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Duration</FormLabel>
                      <FormControl>
                        <Input placeholder="5 days / 4 nights" {...field} />
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
                      Provide a URL to a high-quality image that represents this package.
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="inclusions"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Inclusions</FormLabel>
                    <div className="flex flex-wrap gap-2 mb-2">
                      {field.value?.map(inclusion => (
                        <Badge key={inclusion} variant="secondary" className="px-3 py-1">
                          {inclusion}
                          <button
                            type="button"
                            onClick={() => removeInclusion(inclusion)}
                            className="ml-2 text-gray-500 hover:text-gray-700"
                          >
                            &times;
                          </button>
                        </Badge>
                      ))}
                    </div>
                    <div className="flex space-x-2">
                      <Input
                        placeholder="Add an inclusion"
                        {...form.register('inclusionInput')}
                        onKeyDown={(e) => {
                          if (e.key === 'Enter') {
                            e.preventDefault();
                            addInclusion();
                          }
                        }}
                      />
                      <Button type="button" onClick={addInclusion} variant="outline">
                        Add
                      </Button>
                    </div>
                    <FormDescription>
                      Examples: Luxury accommodation, Airport transfers, Guided tours, etc.
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="tags"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Tags</FormLabel>
                    <div className="flex flex-wrap gap-2 mb-2">
                      {field.value?.map(tag => (
                        <Badge key={tag} variant="secondary" className="px-3 py-1">
                          {tag}
                          <button
                            type="button"
                            onClick={() => removeTag(tag)}
                            className="ml-2 text-gray-500 hover:text-gray-700"
                          >
                            &times;
                          </button>
                        </Badge>
                      ))}
                    </div>
                    <div className="flex space-x-2">
                      <Input
                        placeholder="Add a tag"
                        {...form.register('tagInput')}
                        onKeyDown={(e) => {
                          if (e.key === 'Enter') {
                            e.preventDefault();
                            addTag();
                          }
                        }}
                      />
                      <Button type="button" onClick={addTag} variant="outline">
                        Add
                      </Button>
                    </div>
                    <FormDescription>
                      Examples: Adventure, Relaxation, Family, etc.
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
                      <FormLabel>Featured Package</FormLabel>
                      <FormDescription>
                        Featured packages will be prominently displayed on the homepage.
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
                    isEditing ? 'Update Package' : 'Create Package'
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
              This will permanently delete the package "{packageToDelete?.title}". This action cannot be undone.
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
