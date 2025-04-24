import { useEffect, useState } from "react";
import { useAccommodationsStore } from "@/store/accommodationsStore";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Accommodation } from "@shared/schema";
import { Star, Search, Filter, MapPin, Users } from "lucide-react";
import { ElevatedCard } from "@/components/ui/ElevatedCard";
import { BorderedCard } from "@/components/ui/BorderedCard";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Skeleton } from "@/components/ui/skeleton";

export default function AccommodationsPage() {
  const { accommodations, isLoading, loadAccommodations } = useAccommodationsStore();
  const [filteredAccommodations, setFilteredAccommodations] = useState<Accommodation[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [priceRange, setPriceRange] = useState<string>("all");
  const [showFilters, setShowFilters] = useState(false);
  const [bedrooms, setBedrooms] = useState<string>("all");
  const [onlyFeatured, setOnlyFeatured] = useState(false);
  const [sortBy, setSortBy] = useState<string>("featured");

  useEffect(() => {
    loadAccommodations();
  }, [loadAccommodations]);

  useEffect(() => {
    if (accommodations.length > 0) {
      let result = [...accommodations];
      
      // Apply search filter
      if (searchTerm) {
        result = result.filter(acc => 
          acc.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
          acc.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
          (acc.location && acc.location.toLowerCase().includes(searchTerm.toLowerCase()))
        );
      }
      
      // Apply price range filter
      if (priceRange !== "all") {
        const [min, max] = priceRange.split("-").map(Number);
        result = result.filter(acc => {
          if (max) {
            return acc.price >= min && acc.price <= max;
          } else {
            return acc.price >= min;
          }
        });
      }
      
      // Apply bedrooms filter
      if (bedrooms !== "all") {
        if (bedrooms === "4+") {
          result = result.filter(acc => acc.bedrooms >= 4);
        } else {
          const bedroomCount = Number(bedrooms);
          result = result.filter(acc => acc.bedrooms === bedroomCount);
        }
      }
      
      // Apply featured filter
      if (onlyFeatured) {
        result = result.filter(acc => acc.featured);
      }
      
      // Apply sorting
      if (sortBy === "priceAsc") {
        result.sort((a, b) => a.price - b.price);
      } else if (sortBy === "priceDesc") {
        result.sort((a, b) => b.price - a.price);
      } else if (sortBy === "ratingDesc") {
        result.sort((a, b) => (b.rating || 0) - (a.rating || 0));
      } else if (sortBy === "newest") {
        result.sort((a, b) => new Date(b.createdAt || "").getTime() - new Date(a.createdAt || "").getTime());
      } else {
        // Sort by featured by default
        result.sort((a, b) => {
          if (a.featured && !b.featured) return -1;
          if (!a.featured && b.featured) return 1;
          return 0;
        });
      }
      
      setFilteredAccommodations(result);
    }
  }, [accommodations, searchTerm, priceRange, bedrooms, onlyFeatured, sortBy]);

  const getCardComponent = (index: number) => {
    return index % 2 === 0 ? ElevatedCard : BorderedCard;
  };

  const getButtonClass = (index: number) => {
    return index % 2 === 0 
      ? "btn-gradient" 
      : "bg-white border border-primary text-primary hover:bg-primary hover:text-white";
  };

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <div className="relative h-screen">
        <div className="absolute inset-0 z-0">
          <img 
            src="https://images.unsplash.com/photo-1571896349842-33c89424de2d?ixlib=rb-4.0.3&auto=format&fit=crop&w=1480&q=80" 
            alt="Fernando de Noronha accommodations" 
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-black/40"></div>
          <div className="absolute inset-0 hero-gradient"></div>
        </div>
        
        <div className="relative z-10 h-full flex flex-col justify-center items-center text-white px-4 animate-fade-in">
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-montserrat font-bold text-center mb-4 mt-16">
            Luxurious <span className="text-accent">Stays</span>
          </h1>
          <p className="text-xl text-center max-w-2xl text-white/90">
            Rest in comfort with our selection of premium accommodations in Fernando de Noronha
          </p>
          
          <div className="mt-8 animate-bounce">
            <a href="#accommodations-content" className="flex items-center text-white hover:text-accent transition-colors">
              <span>Discover places to stay</span>
              <svg xmlns="http://www.w3.org/2000/svg" className="ml-2 h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
              </svg>
            </a>
          </div>
        </div>
      </div>
      
      <div id="accommodations-content" className="pt-16 pb-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Search and Filter Section */}
          <div className="mb-8">
            <div className="flex flex-col md:flex-row gap-4 items-center">
              <div className="relative w-full md:w-1/2">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
                <Input
                  placeholder="Search accommodations..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
              
              <div className="flex gap-2 w-full md:w-auto">
                <Button 
                  variant="outline" 
                  className="flex items-center gap-2"
                  onClick={() => setShowFilters(!showFilters)}
                >
                  <Filter className="h-4 w-4" />
                  Filters
                </Button>
                
                <Select value={sortBy} onValueChange={setSortBy}>
                  <SelectTrigger className="w-[180px]">
                    <SelectValue placeholder="Sort by" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="featured">Featured</SelectItem>
                    <SelectItem value="priceAsc">Price: Low to High</SelectItem>
                    <SelectItem value="priceDesc">Price: High to Low</SelectItem>
                    <SelectItem value="ratingDesc">Highest Rated</SelectItem>
                    <SelectItem value="newest">Newest</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            
            {showFilters && (
              <Card className="mt-4 p-4">
                <CardContent className="p-0 grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div>
                    <h3 className="font-medium mb-2">Price Range (per night)</h3>
                    <Select value={priceRange} onValueChange={setPriceRange}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select price range" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">All Prices</SelectItem>
                        <SelectItem value="0-100">Under $100</SelectItem>
                        <SelectItem value="100-200">$100 - $200</SelectItem>
                        <SelectItem value="200-500">$200 - $500</SelectItem>
                        <SelectItem value="500-1000">$500 - $1000</SelectItem>
                        <SelectItem value="1000-10000">$1000+</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div>
                    <h3 className="font-medium mb-2">Bedrooms</h3>
                    <Select value={bedrooms} onValueChange={setBedrooms}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select number of bedrooms" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">Any</SelectItem>
                        <SelectItem value="1">1 Bedroom</SelectItem>
                        <SelectItem value="2">2 Bedrooms</SelectItem>
                        <SelectItem value="3">3 Bedrooms</SelectItem>
                        <SelectItem value="4+">4+ Bedrooms</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div>
                    <h3 className="font-medium mb-2">Options</h3>
                    <div className="flex items-center space-x-2">
                      <Checkbox 
                        id="featured" 
                        checked={onlyFeatured}
                        onCheckedChange={(checked) => setOnlyFeatured(checked as boolean)}
                      />
                      <Label htmlFor="featured">Show only featured accommodations</Label>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}
          </div>
          
          {/* Accommodations Grid */}
          <div className="mb-8">
            <h2 className="text-2xl font-montserrat font-bold mb-6">
              {filteredAccommodations.length} {filteredAccommodations.length === 1 ? 'Accommodation' : 'Accommodations'} Found
            </h2>
            
            {isLoading ? (
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {Array(4).fill(0).map((_, index) => (
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
                ))}
              </div>
            ) : (
              <>
                {filteredAccommodations.length === 0 ? (
                  <div className="text-center py-12 glass-card rounded-xl">
                    <h3 className="text-xl font-medium mb-2">No accommodations found</h3>
                    <p className="text-gray-600 mb-4">Try adjusting your filters or search terms</p>
                    <Button 
                      variant="outline" 
                      onClick={() => {
                        setSearchTerm("");
                        setPriceRange("all");
                        setBedrooms("all");
                        setOnlyFeatured(false);
                        setSortBy("featured");
                      }}
                    >
                      Clear all filters
                    </Button>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                    {filteredAccommodations.map((accommodation, index) => {
                      const CardComponent = getCardComponent(index);
                      const buttonClass = getButtonClass(index);
                      
                      // Extract amenities (if available)
                      const amenities = accommodation.amenities || [];
                      
                      return (
                        <CardComponent key={accommodation.id} className="overflow-hidden animate-slide-up" style={{animationDelay: `${0.1 * (index % 2 + 1)}s`}}>
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
                              
                              <div className="flex items-center mt-2 mb-3 text-sm text-gray-500">
                                <MapPin className="h-4 w-4 mr-1" />
                                <span>{accommodation.location || 'Fernando de Noronha, Brazil'}</span>
                              </div>
                              
                              <div className="flex items-center mb-3 text-sm text-gray-500">
                                <Users className="h-4 w-4 mr-1" />
                                <span>
                                  {accommodation.bedrooms || 1} {accommodation.bedrooms === 1 ? 'Bedroom' : 'Bedrooms'} · 
                                  {accommodation.capacity || 2} Guests
                                </span>
                              </div>
                              
                              <p className="text-gray-600 mb-4 line-clamp-2">{accommodation.description}</p>
                              
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
                                  className={buttonClass}
                                >
                                  Book Now
                                </Button>
                              </div>
                            </div>
                          </div>
                        </CardComponent>
                      );
                    })}
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}