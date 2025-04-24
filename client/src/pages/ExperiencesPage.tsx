import { useEffect, useState } from "react";
import { useExperiencesStore } from "@/store/experiencesStore";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Experience } from "@shared/schema";
import { Star, Search, Filter, MapPin, Clock } from "lucide-react";
import { ElevatedCard } from "@/components/ui/ElevatedCard";
import { BorderedCard } from "@/components/ui/BorderedCard";
import { MinimalCard } from "@/components/ui/MinimalCard";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { useLocation } from "wouter";
import { Skeleton } from "@/components/ui/skeleton";

export default function ExperiencesPage() {
  const { experiences, isLoading, loadExperiences } = useExperiencesStore();
  const [filteredExperiences, setFilteredExperiences] = useState<Experience[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [priceRange, setPriceRange] = useState<string>("all");
  const [showFilters, setShowFilters] = useState(false);
  const [duration, setDuration] = useState<string>("all");
  const [onlyFeatured, setOnlyFeatured] = useState(false);
  const [sortBy, setSortBy] = useState<string>("featured");
  const [location] = useLocation();
  
  const queryParams = new URLSearchParams(location.split('?')[1] || '');
  const dateParam = queryParams.get('date');
  const guestsParam = queryParams.get('guests');

  useEffect(() => {
    loadExperiences();
  }, [loadExperiences]);

  useEffect(() => {
    if (experiences.length > 0) {
      let result = [...experiences];
      
      // Apply search filter
      if (searchTerm) {
        result = result.filter(exp => 
          exp.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
          exp.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
          (exp.location && exp.location.toLowerCase().includes(searchTerm.toLowerCase()))
        );
      }
      
      // Apply price range filter
      if (priceRange !== "all") {
        const [min, max] = priceRange.split("-").map(Number);
        result = result.filter(exp => {
          if (max) {
            return exp.price >= min && exp.price <= max;
          } else {
            return exp.price >= min;
          }
        });
      }
      
      // Apply duration filter
      if (duration !== "all") {
        const durationHours = Number(duration);
        result = result.filter(exp => {
          const expDuration = exp.duration.toLowerCase();
          if (durationHours === 2) {
            return expDuration.includes("2 hour") || expDuration.includes("1 hour");
          } else if (durationHours === 4) {
            return expDuration.includes("3 hour") || expDuration.includes("4 hour");
          } else if (durationHours === 6) {
            return expDuration.includes("5 hour") || expDuration.includes("6 hour");
          } else if (durationHours === 8) {
            return expDuration.includes("7 hour") || expDuration.includes("8 hour") || 
                   expDuration.includes("full day");
          } else {
            return expDuration.includes("day") && !expDuration.includes("full day");
          }
        });
      }
      
      // Apply featured filter
      if (onlyFeatured) {
        result = result.filter(exp => exp.featured);
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
      
      setFilteredExperiences(result);
    }
  }, [experiences, searchTerm, priceRange, duration, onlyFeatured, sortBy]);

  const getCardComponent = (index: number) => {
    const remainder = index % 3;
    if (remainder === 0) return ElevatedCard;
    if (remainder === 1) return BorderedCard;
    return MinimalCard;
  };

  const getBadgeText = (index: number) => {
    const remainder = index % 3;
    if (remainder === 0) return "Popular";
    if (remainder === 1) return "Eco-friendly";
    return "Premium";
  };

  const getBadgeClass = (index: number) => {
    const remainder = index % 3;
    if (remainder === 0) return "bg-accent text-white";
    if (remainder === 1) return "bg-secondary text-white";
    return "bg-primary text-white";
  };

  const getButtonClass = (index: number) => {
    const remainder = index % 3;
    if (remainder === 0) return "btn-gradient";
    if (remainder === 1) return "bg-white border border-primary text-primary hover:bg-primary hover:text-white";
    return "accent-gradient";
  };

  return (
    <div className="min-h-screen pt-24 pb-16">
      {/* Hero Section */}
      <div className="relative h-64 md:h-96 mb-8">
        <div className="absolute inset-0 z-0">
          <img 
            src="https://images.unsplash.com/photo-1597466599360-3b9775841aec?ixlib=rb-4.0.3&auto=format&fit=crop&w=1964&q=80" 
            alt="Fernando de Noronha experiences" 
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 hero-gradient"></div>
        </div>
        
        <div className="relative z-10 h-full flex flex-col justify-center items-center text-white px-4">
          <h1 className="text-4xl md:text-5xl font-montserrat font-bold text-center mb-4">
            Unforgettable Experiences
          </h1>
          <p className="text-xl text-center max-w-2xl">
            Discover the most extraordinary activities that Fernando de Noronha has to offer
          </p>
          
          {(dateParam || guestsParam) && (
            <div className="mt-4 glass-card rounded-lg px-4 py-2 text-sm flex gap-4">
              {dateParam && (
                <div className="flex items-center">
                  <span className="mr-2">Date:</span>
                  <strong>{new Date(dateParam).toLocaleDateString()}</strong>
                </div>
              )}
              {guestsParam && (
                <div className="flex items-center">
                  <span className="mr-2">Guests:</span>
                  <strong>{guestsParam}</strong>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Search and Filter Section */}
        <div className="mb-8">
          <div className="flex flex-col md:flex-row gap-4 items-center">
            <div className="relative w-full md:w-1/2">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
              <Input
                placeholder="Search experiences..."
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
                  <h3 className="font-medium mb-2">Price Range</h3>
                  <Select value={priceRange} onValueChange={setPriceRange}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select price range" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Prices</SelectItem>
                      <SelectItem value="0-50">Under $50</SelectItem>
                      <SelectItem value="50-100">$50 - $100</SelectItem>
                      <SelectItem value="100-200">$100 - $200</SelectItem>
                      <SelectItem value="200-500">$200 - $500</SelectItem>
                      <SelectItem value="500-10000">$500+</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <div>
                  <h3 className="font-medium mb-2">Duration</h3>
                  <Select value={duration} onValueChange={setDuration}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select duration" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">Any Duration</SelectItem>
                      <SelectItem value="2">Up to 2 hours</SelectItem>
                      <SelectItem value="4">2-4 hours</SelectItem>
                      <SelectItem value="6">4-6 hours</SelectItem>
                      <SelectItem value="8">6-8 hours</SelectItem>
                      <SelectItem value="24">Multiple days</SelectItem>
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
                    <Label htmlFor="featured">Show only featured experiences</Label>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}
        </div>
        
        {/* Experiences Grid */}
        <div className="mb-8">
          <h2 className="text-2xl font-montserrat font-bold mb-6">
            {filteredExperiences.length} {filteredExperiences.length === 1 ? 'Experience' : 'Experiences'} Found
          </h2>
          
          {isLoading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {Array(6).fill(0).map((_, index) => (
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
              ))}
            </div>
          ) : (
            <>
              {filteredExperiences.length === 0 ? (
                <div className="text-center py-12 glass-card rounded-xl">
                  <h3 className="text-xl font-medium mb-2">No experiences found</h3>
                  <p className="text-gray-600 mb-4">Try adjusting your filters or search terms</p>
                  <Button 
                    variant="outline" 
                    onClick={() => {
                      setSearchTerm("");
                      setPriceRange("all");
                      setDuration("all");
                      setOnlyFeatured(false);
                      setSortBy("featured");
                    }}
                  >
                    Clear all filters
                  </Button>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                  {filteredExperiences.map((experience, index) => {
                    const CardComponent = getCardComponent(index);
                    const badgeText = getBadgeText(index);
                    const badgeClass = getBadgeClass(index);
                    const buttonClass = getButtonClass(index);
                    
                    return (
                      <CardComponent key={experience.id} className="overflow-hidden animate-slide-up" style={{animationDelay: `${0.1 * (index % 3 + 1)}s`}}>
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
                          <div className="flex justify-between items-start mb-2">
                            <h3 className="text-xl font-montserrat font-bold">{experience.title}</h3>
                            <div className="flex items-center">
                              <Star className="h-4 w-4 text-accent fill-accent" />
                              <span className="ml-1 font-medium">{experience.rating?.toFixed(1) || '5.0'}</span>
                            </div>
                          </div>
                          
                          <div className="flex items-center mb-2 text-sm text-gray-500">
                            <MapPin className="h-4 w-4 mr-1" />
                            <span>{experience.location || 'Fernando de Noronha, Brazil'}</span>
                          </div>
                          
                          <div className="flex items-center mb-3 text-sm text-gray-500">
                            <Clock className="h-4 w-4 mr-1" />
                            <span>{experience.duration}</span>
                          </div>
                          
                          <p className="text-gray-600 mb-4 line-clamp-2">{experience.description}</p>
                          
                          {experience.tags && experience.tags.length > 0 && (
                            <div className="flex flex-wrap gap-2 mb-4">
                              {experience.tags.slice(0, 3).map((tag, i) => (
                                <Badge key={i} variant="outline" className="text-xs">
                                  {tag}
                                </Badge>
                              ))}
                              {experience.tags.length > 3 && (
                                <Badge variant="outline" className="text-xs">
                                  +{experience.tags.length - 3}
                                </Badge>
                              )}
                            </div>
                          )}
                          
                          <div className="flex justify-between items-center mt-4">
                            <span className="text-primary font-semibold">${experience.price.toFixed(0)} per person</span>
                          </div>
                          <Button 
                            className={`mt-4 w-full ${buttonClass}`}
                          >
                            Book Now
                          </Button>
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
  );
}
