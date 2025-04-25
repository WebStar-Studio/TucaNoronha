import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useMutation } from "@tanstack/react-query";
import { insertPackageSchema, Package } from "@shared/schema";
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
const packageFormSchema = insertPackageSchema.extend({
  // Convert string arrays to comma-separated values for easier form handling
  includes: z.string().optional().transform(val => val ? val.split(',').map(item => item.trim()) : []),
  inclusions: z.string().optional().transform(val => val ? val.split(',').map(item => item.trim()) : []),
});

type PackageFormValues = z.infer<typeof packageFormSchema>;

export default function PackageForm() {
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const form = useForm<PackageFormValues>({
    resolver: zodResolver(packageFormSchema),
    defaultValues: {
      title: "",
      description: "",
      image: "",
      price: 0,
      duration: "",
      duration_days: 3,
      includes: "",
      inclusions: "",
      featured: false,
    },
  });

  const createPackageMutation = useMutation<Package, Error, PackageFormValues>({
    mutationFn: async (data) => {
      const res = await apiRequest("POST", "/api/packages", data);
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
        duration_days: 3,
        includes: "",
        inclusions: "",
        featured: false,
      });
      
      // Invalidate packages queries
      queryClient.invalidateQueries({ queryKey: ["/api/packages"] });
      
      toast({
        title: "Package created",
        description: "The travel package has been created successfully.",
      });
      
      setIsSubmitting(false);
    },
    onError: (error) => {
      toast({
        variant: "destructive",
        title: "Failed to create package",
        description: error.message || "An error occurred while creating the package.",
      });
      
      setIsSubmitting(false);
    },
  });
  
  function onSubmit(data: PackageFormValues) {
    setIsSubmitting(true);
    createPackageMutation.mutate(data);
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
                  <Input placeholder="Fernando de Noronha Explorer" {...field} />
                </FormControl>
                <FormDescription>
                  The name of the travel package
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
                    placeholder="5000" 
                    {...field}
                    onChange={(e) => field.onChange(parseFloat(e.target.value))}
                  />
                </FormControl>
                <FormDescription>
                  Total package price in Brazilian Reais
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
                  <Input placeholder="5 Days / 4 Nights" {...field} />
                </FormControl>
                <FormDescription>
                  Human-readable duration (e.g., "5 Days / 4 Nights")
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
                    placeholder="5" 
                    min="1"
                    {...field}
                    onChange={(e) => field.onChange(parseFloat(e.target.value))}
                  />
                </FormControl>
                <FormDescription>
                  Numeric duration in days
                </FormDescription>
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
                URL of the image for the package
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
                  placeholder="Experience the best of Fernando de Noronha with this comprehensive package..." 
                  className="min-h-32"
                  {...field} 
                />
              </FormControl>
              <FormDescription>
                Detailed description of the travel package
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        
        <FormField
          control={form.control}
          name="includes"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Included Experiences</FormLabel>
              <FormControl>
                <Input 
                  placeholder="Dolphin watching, Snorkeling at Baía dos Porcos, Sunset at Forte" 
                  {...field} 
                />
              </FormControl>
              <FormDescription>
                Comma-separated list of experiences included in the package
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
              <FormLabel>Package Inclusions</FormLabel>
              <FormControl>
                <Input 
                  placeholder="Airport transfers, 4-night accommodation, Daily breakfast, Guided tours" 
                  {...field} 
                />
              </FormControl>
              <FormDescription>
                Comma-separated list of what's included in the package
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
                <FormLabel className="text-base">Featured Package</FormLabel>
                <FormDescription>
                  Show this package on the homepage and mark it as featured
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
              Creating Package...
            </>
          ) : (
            <>
              <Plus className="mr-2 h-4 w-4" />
              Create Package
            </>
          )}
        </Button>
      </form>
    </Form>
  );
}