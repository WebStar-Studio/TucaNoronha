import { Button } from '@/components/ui/button';
import { ChevronDown, ArrowRight } from 'lucide-react';
import { useLocation } from 'wouter';

export default function Hero() {
  const [, setLocation] = useLocation();

  const handleExploreExperiences = () => {
    setLocation('/experiences');
  };
  
  const handleExplorePackages = () => {
    setLocation('/packages');
  };

  return (
    <section className="relative h-screen">
      <div className="absolute inset-0 z-0">
        <img 
          src="https://images.unsplash.com/photo-1506929562872-bb421503ef21?ixlib=rb-4.0.3&auto=format&fit=crop&w=2068&q=80" 
          alt="Fernando de Noronha beach" 
          className="w-full h-full object-cover" 
        />
        <div className="absolute inset-0 hero-gradient"></div>
      </div>
      
      <div className="relative z-10 h-full flex flex-col justify-center items-center text-white px-4 sm:px-6 lg:px-8 animate-fade-in">
        <h1 className="text-4xl sm:text-5xl md:text-6xl font-montserrat font-bold text-center max-w-4xl">
          Discover the Paradise of <span className="text-accent">Fernando de Noronha</span>
        </h1>
        <p className="mt-6 text-xl sm:text-2xl text-center max-w-2xl text-white/90 font-inter">
          Exclusive experiences in Brazil's most breathtaking archipelago
        </p>
        
        {/* Call-to-action buttons */}
        <div className="flex flex-col sm:flex-row gap-4 mt-12 justify-center">
          <Button 
            onClick={handleExploreExperiences} 
            className="px-8 py-6 rounded-full bg-white text-gray-800 hover:bg-gray-100 hover:text-gray-900 text-lg font-medium shadow-lg flex items-center transition-all"
          >
            Explore Experiences
            <ArrowRight className="ml-2 h-5 w-5" />
          </Button>
          
          <Button 
            onClick={handleExplorePackages} 
            className="px-8 py-6 rounded-full bg-white/20 backdrop-blur-md text-white hover:bg-white/30 text-lg font-medium shadow-lg flex items-center transition-all"
          >
            See Packages
          </Button>
        </div>
        
        <div className="mt-8 flex flex-wrap justify-center gap-4">
          <a href="#experiences" className="flex items-center text-white hover:text-accent transition-colors">
            <span>Scroll to discover</span>
            <ChevronDown className="ml-2 h-4 w-4" />
          </a>
        </div>
      </div>
    </section>
  );
}
