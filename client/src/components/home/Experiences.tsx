import { useEffect, useState, useRef } from 'react';
import { Star, MapPin, Clock, ArrowRight, ChevronRight } from 'lucide-react';
import { useExperiencesStore } from '@/store/experiencesStore';
import { Button } from '@/components/ui/button';
import { Link } from 'wouter';
import { Skeleton } from '@/components/ui/skeleton';

export default function Experiences() {
  const { featuredExperiences, isLoading, loadFeaturedExperiences } = useExperiencesStore();
  const [isInView, setIsInView] = useState(false);
  const sectionRef = useRef<HTMLElement>(null);

  useEffect(() => {
    loadFeaturedExperiences();
  }, [loadFeaturedExperiences]);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsInView(true);
          observer.disconnect();
        }
      },
      { threshold: 0.1 }
    );

    if (sectionRef.current) {
      observer.observe(sectionRef.current);
    }

    return () => {
      observer.disconnect();
    };
  }, []);

  return (
    <section 
      id="experiences" 
      ref={sectionRef}
      className="py-20 sm:py-24 lg:py-28 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto relative overflow-hidden"
    >
      {/* Decorative elements */}
      <div className="absolute -top-20 -right-20 w-64 h-64 bg-primary/5 rounded-full blur-3xl"></div>
      <div className="absolute -bottom-20 -left-20 w-64 h-64 bg-accent/5 rounded-full blur-3xl"></div>
      
      <div className={`text-center mb-16 transform transition-all duration-1000 ${isInView ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'}`}>
        <span className="inline-block px-4 py-1 bg-primary/10 text-primary rounded-full text-sm font-medium mb-4 animate-pulse-slow">
          Explore Our Experiences
        </span>
        <h2 className="text-3xl sm:text-4xl font-montserrat font-bold text-foreground">
          Unforgettable <span className="text-primary">Experiences</span>
        </h2>
        <div className="w-24 h-1 bg-primary/30 mx-auto mt-4 rounded-full"></div>
        <p className="mt-6 text-lg text-gray-600 max-w-3xl mx-auto">
          Discover the most extraordinary activities that Fernando de Noronha has to offer, handpicked by our local experts.
        </p>
      </div>
      
      {/* Featured Experience Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {isLoading ? (
          // Loading skeleton
          Array(3).fill(0).map((_, index) => (
            <div key={index} className="rounded-xl overflow-hidden glass-card">
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
            // Determine badge style based on index
            const badgeClass = index === 0 
              ? "bg-gradient-to-r from-accent to-accent/80 text-white" 
              : index === 1 
                ? "bg-gradient-to-r from-secondary to-secondary/80 text-white" 
                : "bg-gradient-to-r from-primary to-primary/80 text-white";
            
            // Determine badge text based on index
            const badgeText = index === 0 
              ? "Popular" 
              : index === 1 
                ? "Eco-friendly" 
                : "Premium";

            return (
              <div 
                key={experience.id} 
                className={`futuristic-card overflow-hidden transform transition-all duration-1000 ${isInView ? 'translate-y-0 opacity-100 scale-100' : 'translate-y-10 opacity-0 scale-95'}`}
                style={{ transitionDelay: `${0.2 * (index + 1)}s` }}
              >
                <div className="relative h-64 overflow-hidden group">
                  <img 
                    src={experience.image} 
                    alt={experience.title} 
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent"></div>
                  <div className={`absolute top-4 right-4 ${badgeClass} text-sm font-medium px-3 py-1 rounded-full shadow-lg backdrop-blur-sm`}>
                    {badgeText}
                  </div>
                  <div className="absolute bottom-4 left-4 flex items-center text-white">
                    <MapPin className="h-4 w-4 mr-1 text-white/80" />
                    <span className="text-sm">{experience.location || 'Fernando de Noronha'}</span>
                  </div>
                </div>
                <div className="p-6 relative">
                  <div className="flex justify-between items-start mb-2">
                    <h3 className="text-xl font-montserrat font-bold">{experience.title}</h3>
                    <div className="flex items-center bg-accent/10 px-2 py-1 rounded-lg">
                      <Star className="h-4 w-4 text-accent fill-accent" />
                      <span className="ml-1 font-medium text-accent">{experience.rating?.toFixed(1) || '5.0'}</span>
                    </div>
                  </div>
                  
                  <div className="flex items-center text-gray-500 mt-2 mb-3">
                    <Clock className="h-4 w-4 mr-1" />
                    <span className="text-sm">{experience.duration}</span>
                  </div>
                  
                  <p className="text-gray-600 line-clamp-2 mb-4">{experience.description}</p>
                  
                  <div className="flex items-center justify-between mt-4">
                    <div className="flex flex-col">
                      <span className="text-sm text-gray-500">Starting from</span>
                      <span className="text-primary font-semibold text-lg">${experience.price.toFixed(0)}</span>
                    </div>
                    
                    <Button 
                      className={index === 0 
                        ? "btn-gradient rounded-full" 
                        : index === 1 
                          ? "secondary-gradient rounded-full"
                          : "accent-gradient rounded-full"
                      }
                    >
                      <span>Book Now</span>
                      <ChevronRight className="ml-1 h-4 w-4 transition-transform group-hover:translate-x-1" />
                    </Button>
                  </div>
                </div>
              </div>
            );
          })
        ) : (
          // No experiences found
          <div className="col-span-3 text-center py-12">
            <p className="text-lg text-gray-600">No experiences found. Please check back later.</p>
          </div>
        )}
      </div>
      
      <div className={`mt-16 text-center transform transition-all duration-1000 delay-500 ${isInView ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'}`}>
        <Link href="/experiences">
          <Button 
            variant="outline" 
            className="px-8 py-6 rounded-full bg-white border border-primary/20 text-primary hover:bg-primary hover:text-white font-medium shadow-lg transition-all hover:scale-105 group"
          >
            View All Experiences
            <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
          </Button>
        </Link>
      </div>
    </section>
  );
}
