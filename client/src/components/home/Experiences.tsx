import { useEffect } from 'react';
import { Star } from 'lucide-react';
import { useExperiencesStore } from '@/store/experiencesStore';
import { Button } from '@/components/ui/button';
import { Link } from 'wouter';
import { ElevatedCard } from '@/components/ui/ElevatedCard';
import { BorderedCard } from '@/components/ui/BorderedCard';
import { MinimalCard } from '@/components/ui/MinimalCard';
import { Skeleton } from '@/components/ui/skeleton';

export default function Experiences() {
  const { featuredExperiences, isLoading, loadFeaturedExperiences } = useExperiencesStore();

  useEffect(() => {
    loadFeaturedExperiences();
  }, [loadFeaturedExperiences]);

  return (
    <section id="experiences" className="py-20 sm:py-24 lg:py-28 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
      <div className="text-center mb-12 animate-slide-up">
        <h2 className="text-3xl sm:text-4xl font-montserrat font-bold text-foreground">Unforgettable Experiences</h2>
        <p className="mt-4 text-lg text-gray-600 max-w-3xl mx-auto">
          Discover the most extraordinary activities that Fernando de Noronha has to offer, handpicked by our local experts.
        </p>
      </div>
      
      {/* Featured Experience Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {isLoading ? (
          // Loading skeleton
          Array(3).fill(0).map((_, index) => (
            <div key={index} className="rounded-xl overflow-hidden bg-white">
              <Skeleton className="h-64 w-full" />
              <div className="p-6 space-y-4">
                <Skeleton className="h-6 w-3/4" />
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-full" />
                <div className="flex justify-between">
                  <Skeleton className="h-4 w-1/4" />
                  <Skeleton className="h-4 w-1/4" />
                </div>
                <Skeleton className="h-10 w-full" />
              </div>
            </div>
          ))
        ) : featuredExperiences.length > 0 ? (
          // Map through featured experiences
          featuredExperiences.slice(0, 3).map((experience, index) => {
            // Determine which card style to use for each experience
            const CardComponent = index === 0 
              ? ElevatedCard 
              : index === 1 
                ? BorderedCard 
                : MinimalCard;
            
            // Determine badge style based on index
            const badgeClass = index === 0 
              ? "bg-accent text-white" 
              : index === 1 
                ? "bg-secondary text-white" 
                : "bg-primary text-white";
            
            // Determine badge text based on index
            const badgeText = index === 0 
              ? "Popular" 
              : index === 1 
                ? "Eco-friendly" 
                : "Premium";

            return (
              <CardComponent key={experience.id} className="overflow-hidden animate-slide-up" style={{animationDelay: `${0.1 * (index + 1)}s`}}>
                <div className="relative h-64">
                  <img 
                    src={experience.image} 
                    alt={experience.title} 
                    className="w-full h-full object-cover"
                  />
                  <div className={`absolute top-4 right-4 ${badgeClass} text-sm font-medium px-3 py-1 rounded-full`}>
                    {badgeText}
                  </div>
                </div>
                <div className="p-6">
                  <div className="flex justify-between items-start">
                    <h3 className="text-xl font-montserrat font-bold">{experience.title}</h3>
                    <div className="flex items-center">
                      <Star className="h-4 w-4 text-accent fill-accent" />
                      <span className="ml-1 font-medium">{experience.rating?.toFixed(1) || '5.0'}</span>
                    </div>
                  </div>
                  <p className="mt-2 text-gray-600 line-clamp-2">{experience.description}</p>
                  <div className="mt-4 flex justify-between items-center">
                    <span className="text-primary font-semibold">${experience.price.toFixed(0)} per person</span>
                    <span className="text-sm text-gray-500">{experience.duration}</span>
                  </div>
                  <Button 
                    className={index === 0 
                      ? "mt-4 w-full btn-gradient" 
                      : index === 1 
                        ? "mt-4 w-full bg-white border border-primary text-primary hover:bg-primary hover:text-white"
                        : "mt-4 w-full accent-gradient"
                    }
                  >
                    Book Now
                  </Button>
                </div>
              </CardComponent>
            );
          })
        ) : (
          // No experiences found
          <div className="col-span-3 text-center py-12">
            <p className="text-lg text-gray-600">No experiences found. Please check back later.</p>
          </div>
        )}
      </div>
      
      <div className="mt-12 text-center">
        <Link href="/experiences">
          <Button variant="outline" className="inline-flex items-center px-6 py-3 border border-primary text-primary hover:bg-primary hover:text-white rounded-lg font-medium transition">
            View All Experiences
            <svg className="ml-2 h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
            </svg>
          </Button>
        </Link>
      </div>
    </section>
  );
}
