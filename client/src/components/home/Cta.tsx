import { Button } from '@/components/ui/button';
import { useLocation } from 'wouter';
import { useAuthStore } from '@/store/authStore';

export default function Cta() {
  const [, setLocation] = useLocation();
  const { isAuthenticated } = useAuthStore();

  const handlePlanTrip = () => {
    if (isAuthenticated) {
      setLocation('/packages');
    } else {
      setLocation('/signup');
    }
  };

  return (
    <section className="py-20 sm:py-24 lg:py-28 relative">
      <div className="absolute inset-0 z-0">
        <img 
          src="https://images.unsplash.com/photo-1507525428034-b723cf961d3e?ixlib=rb-4.0.3&auto=format&fit=crop&w=1473&q=80" 
          alt="Fernando de Noronha beach" 
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 hero-gradient opacity-80"></div>
      </div>
      
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center text-white">
        <h2 className="text-3xl sm:text-4xl md:text-5xl font-montserrat font-bold max-w-3xl mx-auto animate-slide-up">
          Ready to Experience the Magic of Fernando de Noronha?
        </h2>
        <p className="mt-6 text-lg sm:text-xl max-w-2xl mx-auto text-white/90 animate-slide-up" style={{animationDelay: "0.1s"}}>
          Book your dream vacation today and let us handle every detail of your journey to paradise.
        </p>
        <div className="mt-10 flex flex-col sm:flex-row justify-center space-y-4 sm:space-y-0 sm:space-x-4 animate-slide-up" style={{animationDelay: "0.2s"}}>
          <Button 
            className="btn-gradient px-8 py-4 rounded-full text-base font-medium text-white shadow-md hover:shadow-lg transition"
            onClick={handlePlanTrip}
          >
            Start Planning My Trip
          </Button>
          <Button 
            variant="outline" 
            className="px-8 py-4 border-2 border-white rounded-full text-base font-medium text-white hover:bg-white hover:text-foreground transition"
            onClick={() => setLocation('/contact')}
          >
            Contact a Travel Expert
          </Button>
        </div>
      </div>
    </section>
  );
}
