import { useEffect, useState } from "react";
import { usePackagesStore } from "@/store/packagesStore";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Package } from "@shared/schema";
import { Search, Filter, Check } from "lucide-react";
import { ElevatedCard } from "@/components/ui/ElevatedCard";
import { BorderedCard } from "@/components/ui/BorderedCard";
import { MinimalCard } from "@/components/ui/MinimalCard";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Skeleton } from "@/components/ui/skeleton";

export default function PackagesPage() {
  const { packages, isLoading, loadPackages } = usePackagesStore();
  const [filteredPackages, setFilteredPackages] = useState<Package[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [priceRange, setPriceRange] = useState<string>("all");
  const [showFilters, setShowFilters] = useState(false);
  const [duration, setDuration] = useState<string>("all");
  const [onlyFeatured, setOnlyFeatured] = useState(false);
  const [sortBy, setSortBy] = useState<string>("featured");

  useEffect(() => {
    loadPackages();
  }, [loadPackages]);

  useEffect(() => {
    if (packages.length > 0) {
      let result = [...packages];
      
      // Apply search filter
      if (searchTerm) {
        result = result.filter(pkg => 
          pkg.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
          pkg.description.toLowerCase().includes(searchTerm.toLowerCase())
        );
      }
      
      // Apply price range filter
      if (priceRange !== "all") {
        const [min, max] = priceRange.split("-").map(Number);
        result = result.filter(pkg => {
          if (max) {
            return pkg.price >= min && pkg.price <= max;
          } else {
            return pkg.price >= min;
          }
        });
      }
      
      // Apply duration filter
      if (duration !== "all") {
        result = result.filter(pkg => {
          const pkgDuration = pkg.duration.toLowerCase();
          
          if (duration === "short") {
            return pkgDuration.includes("3 day") || pkgDuration.includes("2 day") || 
                   pkgDuration.includes("weekend") || pkgDuration.includes("1 day");
          } else if (duration === "medium") {
            return pkgDuration.includes("4 day") || pkgDuration.includes("5 day") || 
                   pkgDuration.includes("6 day");
          } else if (duration === "long") {
            return pkgDuration.includes("week") || 
                   pkgDuration.includes("7 day") || pkgDuration.includes("8 day") || 
                   pkgDuration.includes("9 day") || pkgDuration.includes("10 day");
          } else if (duration === "extended") {
            return pkgDuration.includes("2 week") || pkgDuration.includes("14 day") || 
                   pkgDuration.includes("longer");
          }
          
          return true;
        });
      }
      
      // Apply featured filter
      if (onlyFeatured) {
        result = result.filter(pkg => pkg.featured);
      }
      
      // Apply sorting
      if (sortBy === "priceAsc") {
        result.sort((a, b) => a.price - b.price);
      } else if (sortBy === "priceDesc") {
        result.sort((a, b) => b.price - a.price);
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
      
      setFilteredPackages(result);
    }
  }, [packages, searchTerm, priceRange, duration, onlyFeatured, sortBy]);

  const getCardComponent = (index: number) => {
    const remainder = index % 3;
    if (remainder === 0) return ElevatedCard;
    if (remainder === 1) return MinimalCard;
    return BorderedCard;
  };

  const getBadgeText = (index: number) => {
    const remainder = index % 3;
    if (remainder === 0) return "Best Seller";
    if (remainder === 1) return "Eco-friendly";
    return "Family Friendly";
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
    if (remainder === 1) return "secondary-gradient";
    return "accent-gradient";
  };

  return (
    <div className="min-h-screen pt-24 pb-16">
      {/* Hero Section */}
      <div className="relative h-64 md:h-96 mb-8">
        <div className="absolute inset-0 z-0">
          <img 
            src="https://images.unsplash.com/photo-1586005660198-47ec6ff5a5ce?ixlib=rb-4.0.3&auto=format&fit=crop&w=2071&q=80" 
            alt="Fernando de Noronha packages" 
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 hero-gradient"></div>
        </div>
        
        <div className="relative z-10 h-full flex flex-col justify-center items-center text-white px-4">
          <h1 className="text-4xl md:text-5xl font-montserrat font-bold text-center mb-4">
            Curated Packages
          </h1>
          <p className="text-xl text-center max-w-2xl">
            Experience the best of Fernando de Noronha with our carefully crafted all-inclusive packages
          </p>
        </div>
      </div>
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Search and Filter Section */}
        <div className="mb-8">
          <div className="flex flex-col md:flex-row gap-4 items-center">
            <div className="relative w-full md:w-1/2">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
              <Input
                placeholder="Search packages..."
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
                      <SelectItem value="0-500">Under $500</SelectItem>
                      <SelectItem value="500-1000">$500 - $1,000</SelectItem>
                      <SelectItem value="1000-2000">$1,000 - $2,000</SelectItem>
                      <SelectItem value="2000-5000">$2,000 - $5,000</SelectItem>
                      <SelectItem value="5000-50000">$5,000+</SelectItem>
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
                      <SelectItem value="short">Short (1-3 days)</SelectItem>
                      <SelectItem value="medium">Medium (4-6 days)</SelectItem>
                      <SelectItem value="long">Long (7-10 days)</SelectItem>
                      <SelectItem value="extended">Extended (2+ weeks)</SelectItem>
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
                    <Label htmlFor="featured">Show only featured packages</Label>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}
        </div>
        
        {/* Packages Grid */}
        <div className="mb-8">
          <h2 className="text-2xl font-montserrat font-bold mb-6">
            {filteredPackages.length} {filteredPackages.length === 1 ? 'Package' : 'Packages'} Found
          </h2>
          
          {isLoading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8">
              {Array(6).fill(0).map((_, index) => (
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
              ))}
            </div>
          ) : (
            <>
              {filteredPackages.length === 0 ? (
                <div className="text-center py-12 glass-card rounded-xl">
                  <h3 className="text-xl font-medium mb-2">No packages found</h3>
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
                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8">
                  {filteredPackages.map((pkg, index) => {
                    const CardComponent = getCardComponent(index);
                    const badgeText = getBadgeText(index);
                    const badgeClass = getBadgeClass(index);
                    const buttonClass = getButtonClass(index);
                    
                    // Extract inclusions (if available)
                    const inclusions = pkg.inclusions || [
                      'Luxury accommodation',
                      'Selected activities',
                      'Airport transfers',
                      'Daily breakfast'
                    ];
                    
                    return (
                      <CardComponent key={pkg.id} className="overflow-hidden animate-slide-up" style={{animationDelay: `${0.1 * (index % 3 + 1)}s`}}>
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
                            {inclusions.slice(0, 4).map((inclusion, i) => (
                              <div key={i} className="flex items-center mb-2">
                                <Check className="text-secondary mr-2 h-4 w-4" />
                                <span className="text-gray-700">{inclusion}</span>
                              </div>
                            ))}
                          </div>
                          
                          {pkg.tags && pkg.tags.length > 0 && (
                            <div className="flex flex-wrap gap-2 mt-4 mb-2">
                              {pkg.tags.slice(0, 3).map((tag, i) => (
                                <Badge key={i} variant="outline" className="text-xs">
                                  {tag}
                                </Badge>
                              ))}
                            </div>
                          )}
                          
                          <div className="mt-4 flex justify-between items-center">
                            <div>
                              <span className="text-primary font-semibold text-xl">${pkg.price.toFixed(0)}</span>
                              <span className="text-gray-500"> / person</span>
                            </div>
                            <Button 
                              className={buttonClass}
                            >
                              Book Package
                            </Button>
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
  );
}
