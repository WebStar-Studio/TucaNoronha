import { useState } from 'react';
import { useExperiencesStore } from '@/store/experiencesStore';
import { useToast } from '@/hooks/use-toast';
import { z } from 'zod';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { insertExperienceSchema, type Experience } from '@shared/schema';
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
  DialogTrigger,
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
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Checkbox } from '@/components/ui/checkbox';
import { Star, Edit, Trash2, PlusCircle, Loader2 } from 'lucide-react';
import { Badge } from '@/components/ui/badge';

// Extended schema for form validation
const formSchema = insertExperienceSchema.extend({
  tagInput: z.string().optional(),
});

type FormValues = z.infer<typeof formSchema>;

export default function ManageExperiences() {
  const { experiences, isLoading, createExperience, updateExperience, deleteExperience } = useExperiencesStore();
  const { toast } = useToast();
  const [isCreating, setIsCreating] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [currentExperience, setCurrentExperience] = useState<Experience | null>(null);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [experienceToDelete, setExperienceToDelete] = useState<Experience | null>(null);

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: '',
      description: '',
      price: 0,
      duration: '',
      image: '',
      featured: false,
      rating: 5.0,
      location: 'Fernando de Noronha, Brazil',
      tags: [],
      tagInput: '',
    },
  });

  const handleCreateClick = () => {
    form.reset({
      title: '',
      description: '',
      price: 0,
      duration: '',
      image: '',
      featured: false,
      rating: 5.0,
      location: 'Fernando de Noronha, Brazil',
      tags: [],
      tagInput: '',
    });
    setIsCreating(true);
  };

  const handleEditClick = (experience: Experience) => {
    setCurrentExperience(experience);
    form.reset({
      title: experience.title,
      description: experience.description,
      price: experience.price,
      duration: experience.duration,
      image: experience.image,
      featured: experience.featured,
      rating: experience.rating || 5.0,
      location: experience.location || 'Fernando de Noronha, Brazil',
      tags: experience.tags || [],
      tagInput: '',
    });
    setIsEditing(true);
  };

  const handleDeleteClick = (experience: Experience) => {
    setExperienceToDelete(experience);
    setIsDeleteDialogOpen(true);
  };

  const confirmDelete = async () => {
    if (!experienceToDelete) return;
    
    try {
      await deleteExperience(experienceToDelete.id);
      toast({
        title: 'Experience deleted',
        description: `${experienceToDelete.title} has been deleted successfully.`,
      });
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to delete experience. Please try again.',
        variant: 'destructive',
      });
    } finally {
      setIsDeleteDialogOpen(false);
      setExperienceToDelete(null);
    }
  };

  const onSubmit = async (data: FormValues) => {
    // Process tags from the tagInput field if provided
    const formattedData = { ...data };
    
    // Remove the tagInput field as it's not part of the schema
    delete formattedData.tagInput;
    
    try {
      if (isEditing && currentExperience) {
        await updateExperience(currentExperience.id, formattedData);
        toast({
          title: 'Experience updated',
          description: 'The experience has been updated successfully.',
        });
      } else {
        await createExperience(formattedData);
        toast({
          title: 'Experience created',
          description: 'New experience has been created successfully.',
        });
      }
      setIsCreating(false);
      setIsEditing(false);
      setCurrentExperience(null);
    } catch (error) {
      toast({
        title: 'Error',
        description: isEditing 
          ? 'Failed to update experience. Please try again.' 
          : 'Failed to create experience. Please try again.',
        variant: 'destructive',
      });
    }
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
          <h3 className="text-xl font-bold tracking-tight">Manage Experiences</h3>
          <p className="text-gray-500">Create, edit, and delete experiences for Fernando de Noronha tours.</p>
        </div>
        <Button onClick={handleCreateClick} className="flex items-center gap-2">
          <PlusCircle className="h-4 w-4" /> Add New Experience
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>All Experiences</CardTitle>
          <CardDescription>
            You have a total of {experiences.length} experiences.
          </CardDescription>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="flex justify-center items-center h-40">
              <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
          ) : experiences.length === 0 ? (
            <div className="text-center py-8">
              <p className="text-gray-500">No experiences found. Create your first experience!</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Title</TableHead>
                    <TableHead>Price</TableHead>
                    <TableHead>Duration</TableHead>
                    <TableHead>Rating</TableHead>
                    <TableHead>Featured</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {experiences.map(experience => (
                    <TableRow key={experience.id}>
                      <TableCell className="font-medium">{experience.title}</TableCell>
                      <TableCell>${experience.price.toFixed(2)}</TableCell>
                      <TableCell>{experience.duration}</TableCell>
                      <TableCell>
                        <div className="flex items-center">
                          <Star className="h-4 w-4 text-accent fill-accent mr-1" />
                          {experience.rating?.toFixed(1) || 'N/A'}
                        </div>
                      </TableCell>
                      <TableCell>{experience.featured ? 'Yes' : 'No'}</TableCell>
                      <TableCell>
                        <div className="flex items-center space-x-2">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleEditClick(experience)}
                            className="h-8 w-8 p-0"
                          >
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleDeleteClick(experience)}
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

      {/* Create/Edit Experience Dialog */}
      <Dialog 
        open={isCreating || isEditing} 
        onOpenChange={(open) => {
          if (!open) {
            setIsCreating(false);
            setIsEditing(false);
            setCurrentExperience(null);
          }
        }}
      >
        <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>{isEditing ? 'Edit Experience' : 'Create New Experience'}</DialogTitle>
            <DialogDescription>
              {isEditing ? 'Update the details of this experience.' : 'Add a new experience to your tourism offerings.'}
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
                      <Input placeholder="Dolphin Bay Tour" {...field} />
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
                        placeholder="Describe the experience..." 
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
                  name="duration"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Duration</FormLabel>
                      <FormControl>
                        <Input placeholder="3 hours" {...field} />
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
                      Provide a URL to a high-quality image of this experience.
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
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
              </div>
              
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
                      Press Enter or click Add to add a tag.
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
                      <FormLabel>Featured Experience</FormLabel>
                      <FormDescription>
                        Featured experiences will be prominently displayed on the homepage.
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
                    isEditing ? 'Update Experience' : 'Create Experience'
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
              This will permanently delete the experience "{experienceToDelete?.title}". This action cannot be undone.
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
