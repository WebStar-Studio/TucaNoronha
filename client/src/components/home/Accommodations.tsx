import { Star } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Link } from 'wouter';
import { Badge } from '@/components/ui/badge';
import { ElevatedCard } from '@/components/ui/ElevatedCard';
import { BorderedCard } from '@/components/ui/BorderedCard';
import { Skeleton } from '@/components/ui/skeleton';
import { useAccommodations } from '@/hooks/use-accommodations';

export default function Accommodations() {
  const { featuredAccommodations, isLoadingFeaturedAccommodations: isLoading } = useAccommodations();

  return (
    <section className="py-20 sm:py-24 lg:py-28 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
      <div className="text-center mb-12 animate-slide-up">
        <h2 className="text-3xl sm:text-4xl font-montserrat font-bold text-foreground">Luxurious Stays</h2>
        <p className="mt-4 text-lg text-gray-600 max-w-3xl mx-auto">
          Rest in comfort with our selection of premium accommodations that blend naturally with the island's beauty.
        </p>
      </div>
      
      {/* Accommodations Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {isLoading ? (
          // Loading skeleton
          Array(2).fill(0).map((_, index) => (
            <div key={index} className="rounded-xl overflow-hidden bg-white flex flex-col md:flex-row">
              <div className="md:w-2/5">
                <Skeleton className="h-48 md:h-full w-full" />
              </div>
              <div className="md:w-3/5 p-6 space-y-4">
                <Skeleton className="h-6 w-3/4" />
                <Skeleton className="h-4 w-full" />
                <div className="flex flex-wrap gap-2">
                  <Skeleton className="h-8 w-24 rounded-full" />
                  <Skeleton className="h-8 w-24 rounded-full" />
                  <Skeleton className="h-8 w-24 rounded-full" />
                </div>
                <div className="flex justify-between items-center">
                  <Skeleton className="h-4 w-1/4" />
                  <Skeleton className="h-10 w-1/3" />
                </div>
              </div>
            </div>
          ))
        ) : featuredAccommodations.length > 0 ? (
          // Map through featured accommodations
          featuredAccommodations.slice(0, 2).map((accommodation, index) => {
            // Determine which card style to use
            const CardComponent = index === 0 ? ElevatedCard : BorderedCard;
            
            // Extract amenities (if available)
            const amenities = accommodation.amenities || [];
            
            return (
              <CardComponent key={accommodation.id} className="overflow-hidden animate-slide-up" style={{animationDelay: `${0.1 * (index + 1)}s`}}>
                <div className="flex flex-col md:flex-row">
                  <div className="md:w-2/5">
                    <img 
                      src={accommodation.image} 
                      alt={accommodation.title} 
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="md:w-3/5 p-6">
                    <div className="flex justify-between items-start">
                      <h3 className="text-xl font-montserrat font-bold">{accommodation.title}</h3>
                      <div className="flex items-center">
                        <Star className="h-4 w-4 text-accent fill-accent" />
                        <span className="ml-1 font-medium">{accommodation.rating?.toFixed(1) || '4.9'}</span>
                      </div>
                    </div>
                    <p className="mt-2 text-gray-600 line-clamp-2">{accommodation.description}</p>
                    <div className="mt-4 flex flex-wrap gap-2">
                      {accommodation.bedrooms && (
                        <Badge variant="secondary" className="px-3 py-1 bg-gray-100 text-gray-700 hover:bg-gray-200">
                          {accommodation.bedrooms} {accommodation.bedrooms === 1 ? 'Bedroom' : 'Bedrooms'}
                        </Badge>
                      )}
                      {amenities.slice(0, 2).map((amenity, i) => (
                        <Badge key={i} variant="secondary" className="px-3 py-1 bg-gray-100 text-gray-700 hover:bg-gray-200">
                          {amenity}
                        </Badge>
                      ))}
                      {amenities.length > 2 && (
                        <Badge variant="secondary" className="px-3 py-1 bg-gray-100 text-gray-700 hover:bg-gray-200">
                          +{amenities.length - 2} more
                        </Badge>
                      )}
                    </div>
                    <div className="mt-4 flex justify-between items-center">
                      <span className="text-primary font-semibold">${accommodation.price.toFixed(0)} per night</span>
                      <Button 
                        className={index === 0 
                          ? "btn-gradient" 
                          : "bg-white border border-primary text-primary hover:bg-primary hover:text-white"
                        }
                      >
                        View Details
                      </Button>
                    </div>
                  </div>
                </div>
              </CardComponent>
            );
          })
        ) : (
          // No accommodations found
          <div className="col-span-2 text-center py-12">
            <p className="text-lg text-gray-600">No accommodations found. Please check back later.</p>
          </div>
        )}
      </div>
      
      <div className="mt-12 text-center">
        <Link href="/accommodations">
          <Button variant="outline" className="inline-flex items-center px-6 py-3 border border-primary text-primary hover:bg-primary hover:text-white rounded-lg font-medium transition">
            View All Accommodations
            <svg className="ml-2 h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
            </svg>
          </Button>
        </Link>
      </div>
    </section>
  );
}
