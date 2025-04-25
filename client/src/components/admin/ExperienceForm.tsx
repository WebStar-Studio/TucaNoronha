import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useMutation } from "@tanstack/react-query";
import { insertExperienceSchema, Experience } from "@shared/schema";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";

import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Loader2, Plus, X } from "lucide-react";
import { Badge } from "@/components/ui/badge";

// Extend the insert schema with client-side validation
const experienceFormSchema = insertExperienceSchema.extend({
  // Convert string arrays to comma-separated values for easier form handling
  tags: z.string().optional().transform(val => val ? val.split(',').map(tag => tag.trim()) : []),
  inclusions: z.string().optional().transform(val => val ? val.split(',').map(item => item.trim()) : []),
});

type ExperienceFormValues = z.infer<typeof experienceFormSchema>;

export default function ExperienceForm() {
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const form = useForm<ExperienceFormValues>({
    resolver: zodResolver(experienceFormSchema),
    defaultValues: {
      title: "",
      description: "",
      image: "",
      price: 0,
      duration: "",
      duration_days: 1,
      location: "",
      tags: "",
      inclusions: "",
      featured: false,
    },
  });

  const createExperienceMutation = useMutation<Experience, Error, ExperienceFormValues>({
    mutationFn: async (data) => {
      const res = await apiRequest("POST", "/api/experiences", data);
      return res.json();
    },
    onSuccess: () => {
      // Reset form
      form.reset({
        title: "",
        description: "",
        image: "",
        price: 0,
        duration: "",
        duration_days: 1,
        location: "",
        tags: "",
        inclusions: "",
        featured: false,
      });
      
      // Invalidate experiences queries
      queryClient.invalidateQueries({ queryKey: ["/api/experiences"] });
      
      toast({
        title: "Experience created",
        description: "The experience has been created successfully.",
      });
      
      setIsSubmitting(false);
    },
    onError: (error) => {
      toast({
        variant: "destructive",
        title: "Failed to create experience",
        description: error.message || "An error occurred while creating the experience.",
      });
      
      setIsSubmitting(false);
    },
  });
  
  function onSubmit(data: ExperienceFormValues) {
    setIsSubmitting(true);
    createExperienceMutation.mutate(data);
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <FormField
            control={form.control}
            name="title"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Title</FormLabel>
                <FormControl>
                  <Input placeholder="Beach Trekking Adventure" {...field} />
                </FormControl>
                <FormDescription>
                  The name of the experience
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
          
          <FormField
            control={form.control}
            name="price"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Price (BRL)</FormLabel>
                <FormControl>
                  <Input 
                    type="number" 
                    placeholder="350" 
                    {...field}
                    onChange={(e) => field.onChange(parseFloat(e.target.value))}
                  />
                </FormControl>
                <FormDescription>
                  Price per person in Brazilian Reais
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <FormField
            control={form.control}
            name="duration"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Duration</FormLabel>
                <FormControl>
                  <Input placeholder="3 hours" {...field} />
                </FormControl>
                <FormDescription>
                  Human-readable duration (e.g., "3 hours", "Half-day")
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
          
          <FormField
            control={form.control}
            name="duration_days"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Duration (Days)</FormLabel>
                <FormControl>
                  <Input 
                    type="number" 
                    placeholder="1" 
                    min="0.5"
                    step="0.5"
                    {...field}
                    onChange={(e) => field.onChange(parseFloat(e.target.value))}
                  />
                </FormControl>
                <FormDescription>
                  Numeric duration in days (e.g., 0.5 for half-day)
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
        
        <FormField
          control={form.control}
          name="location"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Location</FormLabel>
              <FormControl>
                <Input placeholder="Baía dos Porcos" {...field} />
              </FormControl>
              <FormDescription>
                Where the experience takes place
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        
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
                URL of the image for the experience
              </FormDescription>
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
                  placeholder="Explore the stunning beaches of Fernando de Noronha..." 
                  className="min-h-32"
                  {...field} 
                />
              </FormControl>
              <FormDescription>
                Detailed description of the experience
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
              <FormControl>
                <Input 
                  placeholder="beach, swimming, sunset" 
                  {...field} 
                />
              </FormControl>
              <FormDescription>
                Comma-separated tags to categorize the experience
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
              <FormControl>
                <Input 
                  placeholder="Transportation, Guide, Snorkeling Equipment" 
                  {...field} 
                />
              </FormControl>
              <FormDescription>
                Comma-separated list of what's included
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        
        <FormField
          control={form.control}
          name="featured"
          render={({ field }) => (
            <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
              <div className="space-y-0.5">
                <FormLabel className="text-base">Featured Experience</FormLabel>
                <FormDescription>
                  Show this experience on the homepage and mark it as featured
                </FormDescription>
              </div>
              <FormControl>
                <Switch
                  checked={field.value}
                  onCheckedChange={field.onChange}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        
        <Button type="submit" className="w-full md:w-auto" disabled={isSubmitting}>
          {isSubmitting ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Creating Experience...
            </>
          ) : (
            <>
              <Plus className="mr-2 h-4 w-4" />
              Create Experience
            </>
          )}
        </Button>
      </form>
    </Form>
  );
}