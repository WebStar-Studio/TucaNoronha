import { useEffect } from 'react';
import { Check } from 'lucide-react';
import { usePackagesStore } from '@/store/packagesStore';
import { Button } from '@/components/ui/button';
import { Link } from 'wouter';
import { ElevatedCard } from '@/components/ui/ElevatedCard';
import { MinimalCard } from '@/components/ui/MinimalCard';
import { BorderedCard } from '@/components/ui/BorderedCard';
import { Skeleton } from '@/components/ui/skeleton';

export default function Packages() {
  const { featuredPackages, isLoading, loadFeaturedPackages } = usePackagesStore();

  useEffect(() => {
    loadFeaturedPackages();
  }, [loadFeaturedPackages]);

  return (
    <section className="py-20 sm:py-24 lg:py-28 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
      <div className="text-center mb-12 animate-slide-up">
        <h2 className="text-3xl sm:text-4xl font-montserrat font-bold text-foreground">Curated Packages</h2>
        <p className="mt-4 text-lg text-gray-600 max-w-3xl mx-auto">
          Experience the best of Fernando de Noronha with our carefully crafted all-inclusive packages.
        </p>
      </div>
      
      {/* Packages Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8">
        {isLoading ? (
          // Loading skeleton
          Array(3).fill(0).map((_, index) => (
            <div key={index} className="rounded-xl overflow-hidden bg-white">
              <Skeleton className="h-48 w-full" />
              <div className="p-6 space-y-4">
                <Skeleton className="h-6 w-3/4" />
                <Skeleton className="h-4 w-full" />
                <div className="space-y-2">
                  <Skeleton className="h-4 w-full" />
                  <Skeleton className="h-4 w-full" />
                  <Skeleton className="h-4 w-full" />
                  <Skeleton className="h-4 w-full" />
                </div>
                <div className="flex justify-between items-center">
                  <Skeleton className="h-6 w-1/3" />
                  <Skeleton className="h-10 w-1/3" />
                </div>
              </div>
            </div>
          ))
        ) : featuredPackages.length > 0 ? (
          // Map through featured packages
          featuredPackages.slice(0, 3).map((pkg, index) => {
            // Determine which card style to use
            const CardComponent = index === 0 
              ? ElevatedCard 
              : index === 1 
                ? MinimalCard 
                : BorderedCard;
            
            // Determine badge style based on index
            const badgeClass = index === 0 
              ? "bg-accent text-white" 
              : index === 1 
                ? "bg-secondary text-white" 
                : "bg-primary text-white";
            
            // Determine badge text based on index
            const badgeText = index === 0 
              ? "Best Seller" 
              : index === 1 
                ? "Eco-friendly" 
                : "Family Friendly";

            // Extract inclusions (if available)
            const inclusions = pkg.inclusions || [
              '5 days / 4 nights luxury accommodation',
              '4 adventure activities',
              'Airport transfers included',
              'Daily breakfast and 2 special dinners'
            ];

            return (
              <CardComponent key={pkg.id} className="overflow-hidden animate-slide-up" style={{animationDelay: `${0.1 * (index + 1)}s`}}>
                <div className="relative">
                  <img 
                    src={pkg.image} 
                    alt={pkg.title} 
                    className="w-full h-48 object-cover"
                  />
                  <div className={`absolute top-4 right-4 ${badgeClass} text-sm font-medium px-3 py-1 rounded-full`}>
                    {badgeText}
                  </div>
                </div>
                <div className="p-6">
                  <h3 className="text-xl font-montserrat font-bold">{pkg.title}</h3>
                  <p className="mt-2 text-gray-600 line-clamp-2">{pkg.description}</p>
                  <div className="mt-4">
                    {inclusions.map((inclusion, i) => (
                      <div key={i} className="flex items-center mb-2">
                        <Check className="text-secondary mr-2 h-4 w-4" />
                        <span className="text-gray-700">{inclusion}</span>
                      </div>
                    ))}
                  </div>
                  <div className="mt-6 flex justify-between items-center">
                    <div>
                      <span className="text-primary font-semibold text-xl">${pkg.price.toFixed(0)}</span>
                      <span className="text-gray-500"> / person</span>
                    </div>
                    <Button 
                      className={index === 0 
                        ? "btn-gradient" 
                        : index === 1 
                          ? "secondary-gradient" 
                          : "accent-gradient"
                      }
                    >
                      Book Package
                    </Button>
                  </div>
                </div>
              </CardComponent>
            );
          })
        ) : (
          // No packages found
          <div className="col-span-3 text-center py-12">
            <p className="text-lg text-gray-600">No packages found. Please check back later.</p>
          </div>
        )}
      </div>
      
      <div className="mt-12 text-center">
        <Link href="/packages">
          <Button variant="outline" className="inline-flex items-center px-6 py-3 border border-primary text-primary hover:bg-primary hover:text-white rounded-lg font-medium transition">
            View All Packages
            <svg className="ml-2 h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
            </svg>
          </Button>
        </Link>
      </div>
    </section>
  );
}
