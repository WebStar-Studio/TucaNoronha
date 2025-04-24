import { Button } from '@/components/ui/button';
import { ChevronDown, ArrowRight, Compass, Package } from 'lucide-react';
import { useLocation } from 'wouter';
import { useEffect, useState } from 'react';

export default function Hero() {
  const [, setLocation] = useLocation();
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    setIsLoaded(true);
  }, []);

  const handleExploreExperiences = () => {
    setLocation('/experiences');
  };
  
  const handleExplorePackages = () => {
    setLocation('/packages');
  };

  return (
    <section className="relative h-screen overflow-hidden">
      {/* Background image with overlay */}
      <div className="absolute inset-0 z-0">
        <img 
          src="https://images.unsplash.com/photo-1506929562872-bb421503ef21?ixlib=rb-4.0.3&auto=format&fit=crop&w=2068&q=80" 
          alt="Fernando de Noronha beach" 
          className="w-full h-full object-cover transition-transform duration-10000 hover:scale-105" 
        />
        <div className="absolute inset-0 hero-gradient"></div>
        
        {/* Decorative elements */}
        <div className="absolute top-[15%] left-[10%] w-32 h-32 rounded-full bg-primary/10 backdrop-blur-sm animate-pulse-slow"></div>
        <div className="absolute bottom-[20%] right-[10%] w-40 h-40 rounded-full bg-accent/10 backdrop-blur-sm animate-float"></div>
        <div className="absolute top-[40%] right-[20%] w-24 h-24 rounded-full bg-secondary/10 backdrop-blur-sm animate-float animate-delay-300"></div>
      </div>
      
      {/* Content */}
      <div className="relative z-10 h-full flex flex-col justify-center items-center text-white px-4 sm:px-6 lg:px-8">
        <div className={`transform transition-all duration-1000 ${isLoaded ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'}`}>
          <h1 className="text-4xl sm:text-5xl md:text-6xl font-montserrat font-bold text-center max-w-4xl leading-tight">
            Discover the Paradise of{" "}
            <span className="text-accent relative">
              Fernando de Noronha
              <span className="absolute bottom-1 left-0 w-full h-1 bg-accent/50 animate-pulse-slow"></span>
            </span>
          </h1>
        </div>
        
        <div className={`mt-6 transform transition-all duration-1000 delay-100 ${isLoaded ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'}`}>
          <p className="text-xl sm:text-2xl text-center max-w-2xl text-white/90 font-inter">
            Exclusive experiences in Brazil's most breathtaking archipelago
          </p>
        </div>
        
        {/* Call-to-action buttons */}
        <div className={`flex flex-col sm:flex-row gap-4 mt-12 justify-center transform transition-all duration-1000 delay-200 ${isLoaded ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'}`}>
          <Button 
            onClick={handleExploreExperiences} 
            className="px-8 py-6 rounded-full bg-white text-gray-800 hover:bg-gray-100 hover:text-gray-900 text-lg font-medium shadow-lg flex items-center transition-all hover:scale-105"
          >
            <Compass className="mr-2 h-5 w-5 animate-pulse-slow" />
            Explore Experiences
            <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
          </Button>
          
          <Button 
            onClick={handleExplorePackages} 
            className="px-8 py-6 rounded-full bg-white/20 backdrop-blur-md text-white hover:bg-white/30 text-lg font-medium shadow-lg flex items-center transition-all hover:scale-105"
          >
            <Package className="mr-2 h-5 w-5 animate-pulse-slow" />
            See Packages
          </Button>
        </div>
        
        <div className={`mt-8 flex flex-wrap justify-center gap-4 transform transition-all duration-1000 delay-300 ${isLoaded ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'}`}>
          <a 
            href="#experiences" 
            className="flex items-center text-white hover:text-accent transition-colors group"
          >
            <span>Scroll to discover</span>
            <ChevronDown className="ml-2 h-4 w-4 group-hover:translate-y-1 transition-transform animate-float" />
          </a>
        </div>
      </div>
      
      {/* Floating decorative elements */}
      <div className="absolute bottom-10 left-10 z-10 w-32 h-3 bg-white/20 rounded-full animate-shimmer"></div>
      <div className="absolute bottom-10 right-10 z-10 w-32 h-3 bg-white/20 rounded-full animate-shimmer animate-delay-500"></div>
    </section>
  );
}
