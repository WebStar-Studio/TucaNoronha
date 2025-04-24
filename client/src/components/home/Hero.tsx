import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { CalendarIcon, Users, ChevronDown } from 'lucide-react';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { format } from 'date-fns';
import { useLocation } from 'wouter';

export default function Hero() {
  const [date, setDate] = useState<Date | undefined>(undefined);
  const [guests, setGuests] = useState<string>('2');
  const [, setLocation] = useLocation();

  const handleExplore = () => {
    // Navigate to experiences page with query parameters
    setLocation(`/experiences${date ? `?date=${format(date, 'yyyy-MM-dd')}` : ''}${guests ? `&guests=${guests}` : ''}`);
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
        
        {/* Search */}
        <div className="w-full max-w-4xl mt-12 glass-card rounded-xl p-4 sm:p-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="relative rounded-lg bg-white shadow-sm">
              <Popover>
                <PopoverTrigger asChild>
                  <Button variant="outline" className="w-full justify-start text-left font-normal pl-10 py-6 border-0">
                    <CalendarIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
                    {date ? format(date, 'PPP') : <span className="text-gray-500">When are you visiting?</span>}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <Calendar
                    mode="single"
                    selected={date}
                    onSelect={setDate}
                    initialFocus
                    disabled={(date) => date < new Date()}
                  />
                </PopoverContent>
              </Popover>
            </div>
            
            <div className="relative rounded-lg bg-white shadow-sm">
              <Users className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
              <Select value={guests} onValueChange={setGuests}>
                <SelectTrigger className="w-full border-0 pl-10 py-6">
                  <SelectValue placeholder="2 Guests" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="1">1 Guest</SelectItem>
                  <SelectItem value="2">2 Guests</SelectItem>
                  <SelectItem value="3">3 Guests</SelectItem>
                  <SelectItem value="4">4 Guests</SelectItem>
                  <SelectItem value="5">5 Guests</SelectItem>
                  <SelectItem value="6+">6+ Guests</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div className="relative rounded-lg">
              <Button onClick={handleExplore} className="w-full btn-gradient py-6 px-4 rounded-lg font-medium shadow-sm">
                Explore Now
              </Button>
            </div>
          </div>
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
