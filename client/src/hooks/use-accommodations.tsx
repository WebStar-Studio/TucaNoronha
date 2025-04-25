import { useState } from 'react';
import { useQuery, useMutation } from '@tanstack/react-query';
import { Accommodation, InsertAccommodation } from '@shared/schema';
import { apiRequest, queryClient, getQueryFn } from '@/lib/queryClient';
import { useToast } from '@/hooks/use-toast';

export function useAccommodations() {
  const { toast } = useToast();
  const [selectedAccommodation, setSelectedAccommodation] = useState<Accommodation | null>(null);

  // Fetch all accommodations
  const {
    data: accommodations = [],
    isLoading: isLoadingAccommodations,
    error: accommodationsError,
  } = useQuery<Accommodation[]>({
    queryKey: ['/api/accommodations'],
    queryFn: getQueryFn({ on401: 'returnNull' }),
  });

  // Fetch featured accommodations
  const {
    data: featuredAccommodations = [],
    isLoading: isLoadingFeaturedAccommodations,
    error: featuredAccommodationsError,
  } = useQuery<Accommodation[]>({
    queryKey: ['/api/accommodations/featured'],
    queryFn: getQueryFn({ on401: 'returnNull' }),
  });

  // Get accommodation by ID
  const getAccommodationById = async (id: number): Promise<Accommodation | null> => {
    try {
      const response = await apiRequest('GET', `/api/accommodations/${id}`);
      const data = await response.json();
      return data as Accommodation;
    } catch (error) {
      toast({
        title: 'Error',
        description: `Failed to get accommodation: ${(error as Error).message}`,
        variant: 'destructive',
      });
      return null;
    }
  };

  // Create accommodation mutation
  const createAccommodationMutation = useMutation({
    mutationFn: async (accommodation: InsertAccommodation) => {
      const response = await apiRequest('POST', '/api/accommodations', accommodation);
      return await response.json() as Accommodation;
    },
    onSuccess: () => {
      toast({
        title: 'Success',
        description: 'Accommodation created successfully',
      });
      queryClient.invalidateQueries({ queryKey: ['/api/accommodations'] });
      queryClient.invalidateQueries({ queryKey: ['/api/accommodations/featured'] });
    },
    onError: (error) => {
      toast({
        title: 'Error',
        description: `Failed to create accommodation: ${(error as Error).message}`,
        variant: 'destructive',
      });
    },
  });

  // Update accommodation mutation
  const updateAccommodationMutation = useMutation({
    mutationFn: async ({ id, data }: { id: number; data: Partial<InsertAccommodation> }) => {
      const response = await apiRequest('PATCH', `/api/accommodations/${id}`, data);
      return await response.json() as Accommodation;
    },
    onSuccess: () => {
      toast({
        title: 'Success',
        description: 'Accommodation updated successfully',
      });
      queryClient.invalidateQueries({ queryKey: ['/api/accommodations'] });
      queryClient.invalidateQueries({ queryKey: ['/api/accommodations/featured'] });
    },
    onError: (error) => {
      toast({
        title: 'Error',
        description: `Failed to update accommodation: ${(error as Error).message}`,
        variant: 'destructive',
      });
    },
  });

  // Delete accommodation mutation
  const deleteAccommodationMutation = useMutation({
    mutationFn: async (id: number) => {
      await apiRequest('DELETE', `/api/accommodations/${id}`);
    },
    onSuccess: () => {
      toast({
        title: 'Success',
        description: 'Accommodation deleted successfully',
      });
      queryClient.invalidateQueries({ queryKey: ['/api/accommodations'] });
      queryClient.invalidateQueries({ queryKey: ['/api/accommodations/featured'] });
    },
    onError: (error) => {
      toast({
        title: 'Error',
        description: `Failed to delete accommodation: ${(error as Error).message}`,
        variant: 'destructive',
      });
    },
  });

  return {
    accommodations,
    featuredAccommodations,
    isLoadingAccommodations,
    isLoadingFeaturedAccommodations,
    accommodationsError,
    featuredAccommodationsError,
    selectedAccommodation,
    setSelectedAccommodation,
    getAccommodationById,
    createAccommodation: createAccommodationMutation.mutateAsync,
    updateAccommodation: updateAccommodationMutation.mutateAsync,
    deleteAccommodation: deleteAccommodationMutation.mutateAsync,
    isCreating: createAccommodationMutation.isPending,
    isUpdating: updateAccommodationMutation.isPending,
    isDeleting: deleteAccommodationMutation.isPending,
  };
}