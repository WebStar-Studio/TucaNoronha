import { useState } from 'react';
import { useQuery, useMutation } from '@tanstack/react-query';
import { Experience, InsertExperience } from '@shared/schema';
import { apiRequest, queryClient, getQueryFn } from '@/lib/queryClient';
import { useToast } from '@/hooks/use-toast';

export function useExperiences() {
  const { toast } = useToast();
  const [selectedExperience, setSelectedExperience] = useState<Experience | null>(null);

  // Fetch all experiences
  const {
    data: experiences = [],
    isLoading: isLoadingExperiences,
    error: experiencesError,
  } = useQuery<Experience[]>({
    queryKey: ['/api/experiences'],
    queryFn: getQueryFn({ on401: 'returnNull' }),
  });

  // Fetch featured experiences
  const {
    data: featuredExperiences = [],
    isLoading: isLoadingFeaturedExperiences,
    error: featuredExperiencesError,
  } = useQuery<Experience[]>({
    queryKey: ['/api/experiences/featured'],
    queryFn: getQueryFn({ on401: 'returnNull' }),
  });

  // Get experience by ID
  const getExperienceById = async (id: number): Promise<Experience | null> => {
    try {
      const response = await apiRequest('GET', `/api/experiences/${id}`);
      const data = await response.json();
      return data as Experience;
    } catch (error) {
      toast({
        title: 'Error',
        description: `Failed to get experience: ${(error as Error).message}`,
        variant: 'destructive',
      });
      return null;
    }
  };

  // Create experience mutation
  const createExperienceMutation = useMutation({
    mutationFn: async (experience: InsertExperience) => {
      const response = await apiRequest('POST', '/api/experiences', experience);
      return await response.json() as Experience;
    },
    onSuccess: () => {
      toast({
        title: 'Success',
        description: 'Experience created successfully',
      });
      queryClient.invalidateQueries({ queryKey: ['/api/experiences'] });
      queryClient.invalidateQueries({ queryKey: ['/api/experiences/featured'] });
    },
    onError: (error) => {
      toast({
        title: 'Error',
        description: `Failed to create experience: ${(error as Error).message}`,
        variant: 'destructive',
      });
    },
  });

  // Update experience mutation
  const updateExperienceMutation = useMutation({
    mutationFn: async ({ id, data }: { id: number; data: Partial<InsertExperience> }) => {
      const response = await apiRequest('PATCH', `/api/experiences/${id}`, data);
      return await response.json() as Experience;
    },
    onSuccess: () => {
      toast({
        title: 'Success',
        description: 'Experience updated successfully',
      });
      queryClient.invalidateQueries({ queryKey: ['/api/experiences'] });
      queryClient.invalidateQueries({ queryKey: ['/api/experiences/featured'] });
    },
    onError: (error) => {
      toast({
        title: 'Error',
        description: `Failed to update experience: ${(error as Error).message}`,
        variant: 'destructive',
      });
    },
  });

  // Delete experience mutation
  const deleteExperienceMutation = useMutation({
    mutationFn: async (id: number) => {
      await apiRequest('DELETE', `/api/experiences/${id}`);
    },
    onSuccess: () => {
      toast({
        title: 'Success',
        description: 'Experience deleted successfully',
      });
      queryClient.invalidateQueries({ queryKey: ['/api/experiences'] });
      queryClient.invalidateQueries({ queryKey: ['/api/experiences/featured'] });
    },
    onError: (error) => {
      toast({
        title: 'Error',
        description: `Failed to delete experience: ${(error as Error).message}`,
        variant: 'destructive',
      });
    },
  });

  return {
    experiences,
    featuredExperiences,
    isLoadingExperiences,
    isLoadingFeaturedExperiences,
    experiencesError,
    featuredExperiencesError,
    selectedExperience,
    setSelectedExperience,
    getExperienceById,
    createExperience: createExperienceMutation.mutateAsync,
    updateExperience: updateExperienceMutation.mutateAsync,
    deleteExperience: deleteExperienceMutation.mutateAsync,
    isCreating: createExperienceMutation.isPending,
    isUpdating: updateExperienceMutation.isPending,
    isDeleting: deleteExperienceMutation.isPending,
  };
}