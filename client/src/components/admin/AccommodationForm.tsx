import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useMutation } from "@tanstack/react-query";
import { insertAccommodationSchema, Accommodation } from "@shared/schema";
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
import { Loader2, Plus } from "lucide-react";

// Extend the insert schema with client-side validation
const accommodationFormSchema = insertAccommodationSchema.extend({
  // Convert string arrays to comma-separated values for easier form handling
  amenities: z.string().optional().transform(val => val ? val.split(',').map(amenity => amenity.trim()) : []),
});

type AccommodationFormValues = z.infer<typeof accommodationFormSchema>;

export default function AccommodationForm() {
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const form = useForm<AccommodationFormValues>({
    resolver: zodResolver(accommodationFormSchema),
    defaultValues: {
      title: "",
      description: "",
      image: "",
      price: 0,
      location: "",
      amenities: "",
      bedrooms: 1,
      capacity: 2,
      featured: false,
    },
  });

  const createAccommodationMutation = useMutation<Accommodation, Error, AccommodationFormValues>({
    mutationFn: async (data) => {
      const res = await apiRequest("POST", "/api/accommodations", data);
      return res.json();
    },
    onSuccess: () => {
      // Reset form
      form.reset({
        title: "",
        description: "",
        image: "",
        price: 0,
        location: "",
        amenities: "",
        bedrooms: 1,
        capacity: 2,
        featured: false,
      });
      
      // Invalidate accommodations queries
      queryClient.invalidateQueries({ queryKey: ["/api/accommodations"] });
      
      toast({
        title: "Accommodation created",
        description: "The accommodation has been created successfully.",
      });
      
      setIsSubmitting(false);
    },
    onError: (error) => {
      toast({
        variant: "destructive",
        title: "Failed to create accommodation",
        description: error.message || "An error occurred while creating the accommodation.",
      });
      
      setIsSubmitting(false);
    },
  });
  
  function onSubmit(data: AccommodationFormValues) {
    setIsSubmitting(true);
    createAccommodationMutation.mutate(data);
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
                  <Input placeholder="Seaside Villa" {...field} />
                </FormControl>
                <FormDescription>
                  The name of the accommodation
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
                    placeholder="1200" 
                    {...field}
                    onChange={(e) => field.onChange(parseFloat(e.target.value))}
                  />
                </FormControl>
                <FormDescription>
                  Price per night in Brazilian Reais
                </FormDescription>
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
                    placeholder="2" 
                    min="1"
                    {...field}
                    onChange={(e) => field.onChange(parseInt(e.target.value))}
                  />
                </FormControl>
                <FormDescription>
                  Number of bedrooms
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
          
          <FormField
            control={form.control}
            name="capacity"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Capacity</FormLabel>
                <FormControl>
                  <Input 
                    type="number" 
                    placeholder="4" 
                    min="1"
                    {...field}
                    onChange={(e) => field.onChange(parseInt(e.target.value))}
                  />
                </FormControl>
                <FormDescription>
                  Maximum number of guests
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
                <Input placeholder="Praia do Leão" {...field} />
              </FormControl>
              <FormDescription>
                Where the accommodation is located
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
                URL of the image for the accommodation
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
                  placeholder="A beautiful seaside villa with stunning ocean views..." 
                  className="min-h-32"
                  {...field} 
                />
              </FormControl>
              <FormDescription>
                Detailed description of the accommodation
              </FormDescription>
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
              <FormControl>
                <Input 
                  placeholder="WiFi, Air Conditioning, Ocean View, Kitchen" 
                  {...field} 
                />
              </FormControl>
              <FormDescription>
                Comma-separated list of amenities
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
                <FormLabel className="text-base">Featured Accommodation</FormLabel>
                <FormDescription>
                  Show this accommodation on the homepage and mark it as featured
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
              Creating Accommodation...
            </>
          ) : (
            <>
              <Plus className="mr-2 h-4 w-4" />
              Create Accommodation
            </>
          )}
        </Button>
      </form>
    </Form>
  );
}