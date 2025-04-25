import { useState } from 'react';
import { useQuery, useMutation } from '@tanstack/react-query';
import { Package, InsertPackage } from '@shared/schema';
import { apiRequest, queryClient, getQueryFn } from '@/lib/queryClient';
import { useToast } from '@/hooks/use-toast';

export function usePackages() {
  const { toast } = useToast();
  const [selectedPackage, setSelectedPackage] = useState<Package | null>(null);

  // Fetch all packages
  const {
    data: packages = [],
    isLoading: isLoadingPackages,
    error: packagesError,
  } = useQuery<Package[]>({
    queryKey: ['/api/packages'],
    queryFn: getQueryFn({ on401: 'returnNull' }),
  });

  // Fetch featured packages
  const {
    data: featuredPackages = [],
    isLoading: isLoadingFeaturedPackages,
    error: featuredPackagesError,
  } = useQuery<Package[]>({
    queryKey: ['/api/packages/featured'],
    queryFn: getQueryFn({ on401: 'returnNull' }),
  });

  // Get package by ID
  const getPackageById = async (id: number): Promise<Package | null> => {
    try {
      const response = await apiRequest('GET', `/api/packages/${id}`);
      const data = await response.json();
      return data as Package;
    } catch (error) {
      toast({
        title: 'Error',
        description: `Failed to get package: ${(error as Error).message}`,
        variant: 'destructive',
      });
      return null;
    }
  };

  // Create package mutation
  const createPackageMutation = useMutation({
    mutationFn: async (pkg: InsertPackage) => {
      const response = await apiRequest('POST', '/api/packages', pkg);
      return await response.json() as Package;
    },
    onSuccess: () => {
      toast({
        title: 'Success',
        description: 'Package created successfully',
      });
      queryClient.invalidateQueries({ queryKey: ['/api/packages'] });
      queryClient.invalidateQueries({ queryKey: ['/api/packages/featured'] });
    },
    onError: (error) => {
      toast({
        title: 'Error',
        description: `Failed to create package: ${(error as Error).message}`,
        variant: 'destructive',
      });
    },
  });

  // Update package mutation
  const updatePackageMutation = useMutation({
    mutationFn: async ({ id, data }: { id: number; data: Partial<InsertPackage> }) => {
      const response = await apiRequest('PATCH', `/api/packages/${id}`, data);
      return await response.json() as Package;
    },
    onSuccess: () => {
      toast({
        title: 'Success',
        description: 'Package updated successfully',
      });
      queryClient.invalidateQueries({ queryKey: ['/api/packages'] });
      queryClient.invalidateQueries({ queryKey: ['/api/packages/featured'] });
    },
    onError: (error) => {
      toast({
        title: 'Error',
        description: `Failed to update package: ${(error as Error).message}`,
        variant: 'destructive',
      });
    },
  });

  // Delete package mutation
  const deletePackageMutation = useMutation({
    mutationFn: async (id: number) => {
      await apiRequest('DELETE', `/api/packages/${id}`);
    },
    onSuccess: () => {
      toast({
        title: 'Success',
        description: 'Package deleted successfully',
      });
      queryClient.invalidateQueries({ queryKey: ['/api/packages'] });
      queryClient.invalidateQueries({ queryKey: ['/api/packages/featured'] });
    },
    onError: (error) => {
      toast({
        title: 'Error',
        description: `Failed to delete package: ${(error as Error).message}`,
        variant: 'destructive',
      });
    },
  });

  return {
    packages,
    featuredPackages,
    isLoadingPackages,
    isLoadingFeaturedPackages,
    packagesError,
    featuredPackagesError,
    selectedPackage,
    setSelectedPackage,
    getPackageById,
    createPackage: createPackageMutation.mutateAsync,
    updatePackage: updatePackageMutation.mutateAsync,
    deletePackage: deletePackageMutation.mutateAsync,
    isCreating: createPackageMutation.isPending,
    isUpdating: updatePackageMutation.isPending,
    isDeleting: deletePackageMutation.isPending,
  };
}