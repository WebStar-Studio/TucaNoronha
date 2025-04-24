import { 
  users, type User, type InsertUser, 
  experiences, type Experience, type InsertExperience,
  accommodations, type Accommodation, type InsertAccommodation,
  packages, type Package, type InsertPackage,
  vehicleRentals, type VehicleRental, type InsertVehicleRental,
  restaurants, type Restaurant, type InsertRestaurant,
  testimonials, type Testimonial, type InsertTestimonial
} from "@shared/schema";
import { randomUUID } from "crypto";

// Comprehensive storage interface that handles all entities
export interface IStorage {
  // User operations
  getUser(id: number): Promise<User | undefined>;
  getUserByEmail(email: string): Promise<User | undefined>;
  createUser(user: InsertUser & { firstName?: string; lastName?: string; role?: string; profilePicture?: string }): Promise<User>;
  updateUser(id: number, userData: Partial<User>): Promise<User>;

  // Experience operations
  getAllExperiences(): Promise<Experience[]>;
  getFeaturedExperiences(): Promise<Experience[]>;
  getExperienceById(id: number): Promise<Experience | undefined>;
  createExperience(experience: InsertExperience): Promise<Experience>;
  updateExperience(id: number, experience: Partial<InsertExperience>): Promise<Experience>;
  deleteExperience(id: number): Promise<void>;

  // Accommodation operations
  getAllAccommodations(): Promise<Accommodation[]>;
  getFeaturedAccommodations(): Promise<Accommodation[]>;
  getAccommodationById(id: number): Promise<Accommodation | undefined>;
  createAccommodation(accommodation: InsertAccommodation): Promise<Accommodation>;
  updateAccommodation(id: number, accommodation: Partial<InsertAccommodation>): Promise<Accommodation>;
  deleteAccommodation(id: number): Promise<void>;

  // Package operations
  getAllPackages(): Promise<Package[]>;
  getFeaturedPackages(): Promise<Package[]>;
  getPackageById(id: number): Promise<Package | undefined>;
  createPackage(pkg: InsertPackage): Promise<Package>;
  updatePackage(id: number, pkg: Partial<InsertPackage>): Promise<Package>;
  deletePackage(id: number): Promise<void>;

  // Vehicle operations
  getAllVehicles(): Promise<VehicleRental[]>;
  getVehicleById(id: number): Promise<VehicleRental | undefined>;
  createVehicle(vehicle: InsertVehicleRental): Promise<VehicleRental>;
  updateVehicle(id: number, vehicle: Partial<InsertVehicleRental>): Promise<VehicleRental>;
  deleteVehicle(id: number): Promise<void>;

  // Restaurant operations
  getAllRestaurants(): Promise<Restaurant[]>;
  getFeaturedRestaurants(): Promise<Restaurant[]>;
  getRestaurantById(id: number): Promise<Restaurant | undefined>;
  createRestaurant(restaurant: InsertRestaurant): Promise<Restaurant>;
  updateRestaurant(id: number, restaurant: Partial<InsertRestaurant>): Promise<Restaurant>;
  deleteRestaurant(id: number): Promise<void>;

  // Testimonial operations
  getAllTestimonials(): Promise<Testimonial[]>;
  getApprovedTestimonials(): Promise<Testimonial[]>;
  getTestimonialById(id: number): Promise<Testimonial | undefined>;
  createTestimonial(testimonial: InsertTestimonial): Promise<Testimonial>;
  approveTestimonial(id: number): Promise<Testimonial>;
}

export class MemStorage implements IStorage {
  private users: Map<number, User>;
  private experiences: Map<number, Experience>;
  private accommodations: Map<number, Accommodation>;
  private packages: Map<number, Package>;
  private vehicles: Map<number, VehicleRental>;
  private restaurants: Map<number, Restaurant>;
  private testimonials: Map<number, Testimonial>;
  private currentId: { [key: string]: number } = {};

  constructor() {
    this.users = new Map();
    this.experiences = new Map();
    this.accommodations = new Map();
    this.packages = new Map();
    this.vehicles = new Map();
    this.restaurants = new Map();
    this.testimonials = new Map();
    
    this.currentId = {
      users: 1,
      experiences: 1,
      accommodations: 1,
      packages: 1,
      vehicles: 1,
      restaurants: 1,
      testimonials: 1
    };
    
    // Create admin user
    this.createUser({
      email: 'admin@tucanoronha.com',
      password: 'admin123',
      firstName: 'Admin',
      lastName: 'User',
      role: 'admin'
    });
    
    // Create sample data for initial view
    this.createSampleData();
  }

  // User operations
  async getUser(id: number): Promise<User | undefined> {
    return this.users.get(id);
  }

  async getUserByEmail(email: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(
      (user) => user.email === email,
    );
  }

  async createUser(userData: InsertUser & { firstName?: string; lastName?: string; role?: string; profilePicture?: string }): Promise<User> {
    const id = this.currentId.users++;
    const user: User = { 
      id, 
      email: userData.email,
      password: userData.password,
      firstName: userData.firstName,
      lastName: userData.lastName,
      role: userData.role || 'user',
      profilePicture: userData.profilePicture,
      createdAt: new Date()
    };
    
    this.users.set(id, user);
    return user;
  }

  async updateUser(id: number, userData: Partial<User>): Promise<User> {
    const user = await this.getUser(id);
    
    if (!user) {
      throw new Error(`User with ID ${id} not found`);
    }
    
    const updatedUser = { ...user, ...userData };
    this.users.set(id, updatedUser);
    
    return updatedUser;
  }

  // Experience operations
  async getAllExperiences(): Promise<Experience[]> {
    return Array.from(this.experiences.values());
  }

  async getFeaturedExperiences(): Promise<Experience[]> {
    return Array.from(this.experiences.values()).filter(exp => exp.featured);
  }

  async getExperienceById(id: number): Promise<Experience | undefined> {
    return this.experiences.get(id);
  }

  async createExperience(experienceData: InsertExperience): Promise<Experience> {
    const id = this.currentId.experiences++;
    const experience: Experience = { 
      ...experienceData, 
      id,
      createdAt: new Date()
    };
    
    this.experiences.set(id, experience);
    return experience;
  }

  async updateExperience(id: number, experienceData: Partial<InsertExperience>): Promise<Experience> {
    const experience = await this.getExperienceById(id);
    
    if (!experience) {
      throw new Error(`Experience with ID ${id} not found`);
    }
    
    const updatedExperience = { ...experience, ...experienceData };
    this.experiences.set(id, updatedExperience);
    
    return updatedExperience;
  }

  async deleteExperience(id: number): Promise<void> {
    this.experiences.delete(id);
  }

  // Accommodation operations
  async getAllAccommodations(): Promise<Accommodation[]> {
    return Array.from(this.accommodations.values());
  }

  async getFeaturedAccommodations(): Promise<Accommodation[]> {
    return Array.from(this.accommodations.values()).filter(acc => acc.featured);
  }

  async getAccommodationById(id: number): Promise<Accommodation | undefined> {
    return this.accommodations.get(id);
  }

  async createAccommodation(accommodationData: InsertAccommodation): Promise<Accommodation> {
    const id = this.currentId.accommodations++;
    const accommodation: Accommodation = { 
      ...accommodationData, 
      id,
      createdAt: new Date()
    };
    
    this.accommodations.set(id, accommodation);
    return accommodation;
  }

  async updateAccommodation(id: number, accommodationData: Partial<InsertAccommodation>): Promise<Accommodation> {
    const accommodation = await this.getAccommodationById(id);
    
    if (!accommodation) {
      throw new Error(`Accommodation with ID ${id} not found`);
    }
    
    const updatedAccommodation = { ...accommodation, ...accommodationData };
    this.accommodations.set(id, updatedAccommodation);
    
    return updatedAccommodation;
  }

  async deleteAccommodation(id: number): Promise<void> {
    this.accommodations.delete(id);
  }

  // Package operations
  async getAllPackages(): Promise<Package[]> {
    return Array.from(this.packages.values());
  }

  async getFeaturedPackages(): Promise<Package[]> {
    return Array.from(this.packages.values()).filter(pkg => pkg.featured);
  }

  async getPackageById(id: number): Promise<Package | undefined> {
    return this.packages.get(id);
  }

  async createPackage(packageData: InsertPackage): Promise<Package> {
    const id = this.currentId.packages++;
    const pkg: Package = { 
      ...packageData, 
      id,
      createdAt: new Date()
    };
    
    this.packages.set(id, pkg);
    return pkg;
  }

  async updatePackage(id: number, packageData: Partial<InsertPackage>): Promise<Package> {
    const pkg = await this.getPackageById(id);
    
    if (!pkg) {
      throw new Error(`Package with ID ${id} not found`);
    }
    
    const updatedPackage = { ...pkg, ...packageData };
    this.packages.set(id, updatedPackage);
    
    return updatedPackage;
  }

  async deletePackage(id: number): Promise<void> {
    this.packages.delete(id);
  }

  // Vehicle operations
  async getAllVehicles(): Promise<VehicleRental[]> {
    return Array.from(this.vehicles.values());
  }

  async getVehicleById(id: number): Promise<VehicleRental | undefined> {
    return this.vehicles.get(id);
  }

  async createVehicle(vehicleData: InsertVehicleRental): Promise<VehicleRental> {
    const id = this.currentId.vehicles++;
    const vehicle: VehicleRental = { 
      ...vehicleData, 
      id,
      createdAt: new Date()
    };
    
    this.vehicles.set(id, vehicle);
    return vehicle;
  }

  async updateVehicle(id: number, vehicleData: Partial<InsertVehicleRental>): Promise<VehicleRental> {
    const vehicle = await this.getVehicleById(id);
    
    if (!vehicle) {
      throw new Error(`Vehicle with ID ${id} not found`);
    }
    
    const updatedVehicle = { ...vehicle, ...vehicleData };
    this.vehicles.set(id, updatedVehicle);
    
    return updatedVehicle;
  }

  async deleteVehicle(id: number): Promise<void> {
    this.vehicles.delete(id);
  }

  // Restaurant operations
  async getAllRestaurants(): Promise<Restaurant[]> {
    return Array.from(this.restaurants.values());
  }

  async getFeaturedRestaurants(): Promise<Restaurant[]> {
    return Array.from(this.restaurants.values()).filter(rest => rest.featured);
  }

  async getRestaurantById(id: number): Promise<Restaurant | undefined> {
    return this.restaurants.get(id);
  }

  async createRestaurant(restaurantData: InsertRestaurant): Promise<Restaurant> {
    const id = this.currentId.restaurants++;
    const restaurant: Restaurant = { 
      ...restaurantData, 
      id,
      createdAt: new Date()
    };
    
    this.restaurants.set(id, restaurant);
    return restaurant;
  }

  async updateRestaurant(id: number, restaurantData: Partial<InsertRestaurant>): Promise<Restaurant> {
    const restaurant = await this.getRestaurantById(id);
    
    if (!restaurant) {
      throw new Error(`Restaurant with ID ${id} not found`);
    }
    
    const updatedRestaurant = { ...restaurant, ...restaurantData };
    this.restaurants.set(id, updatedRestaurant);
    
    return updatedRestaurant;
  }

  async deleteRestaurant(id: number): Promise<void> {
    this.restaurants.delete(id);
  }

  // Testimonial operations
  async getAllTestimonials(): Promise<Testimonial[]> {
    return Array.from(this.testimonials.values());
  }

  async getApprovedTestimonials(): Promise<Testimonial[]> {
    return Array.from(this.testimonials.values()).filter(testimonial => testimonial.approved);
  }

  async getTestimonialById(id: number): Promise<Testimonial | undefined> {
    return this.testimonials.get(id);
  }

  async createTestimonial(testimonialData: InsertTestimonial): Promise<Testimonial> {
    const id = this.currentId.testimonials++;
    const testimonial: Testimonial = { 
      ...testimonialData, 
      id,
      createdAt: new Date()
    };
    
    this.testimonials.set(id, testimonial);
    return testimonial;
  }

  async approveTestimonial(id: number): Promise<Testimonial> {
    const testimonial = await this.getTestimonialById(id);
    
    if (!testimonial) {
      throw new Error(`Testimonial with ID ${id} not found`);
    }
    
    const updatedTestimonial = { ...testimonial, approved: true };
    this.testimonials.set(id, updatedTestimonial);
    
    return updatedTestimonial;
  }

  // Create sample data
  private async createSampleData() {
    // Sample experiences
    this.createExperience({
      title: "Dolphin Bay Tour",
      description: "Swim alongside spinner dolphins in their natural habitat at the famous Dolphin Bay, guided by marine biologists.",
      price: 120,
      duration: "3 hours",
      image: "https://images.unsplash.com/photo-1597466599360-3b9775841aec?ixlib=rb-4.0.3&auto=format&fit=crop&w=1964&q=80",
      featured: true,
      rating: 4.9,
      location: "Dolphin Bay, Fernando de Noronha",
      tags: ["Wildlife", "Swimming", "Guided Tour"]
    });

    this.createExperience({
      title: "Snorkeling Adventure",
      description: "Explore the vibrant coral reefs and encounter unique marine species in the crystal-clear waters of Fernando de Noronha.",
      price: 85,
      duration: "4 hours",
      image: "https://images.unsplash.com/photo-1544551763-46a013bb70d5?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80",
      featured: true,
      rating: 4.8,
      location: "Sueste Bay, Fernando de Noronha",
      tags: ["Snorkeling", "Marine Life", "Beginner Friendly"]
    });

    this.createExperience({
      title: "Luxury Sunset Sailing",
      description: "Set sail on a private catamaran and witness the breathtaking Noronha sunset while enjoying champagne and gourmet appetizers.",
      price: 195,
      duration: "2.5 hours",
      image: "https://images.unsplash.com/photo-1502680390469-be75c86b636f?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80",
      featured: true,
      rating: 5.0,
      location: "Port of Santo Antônio, Fernando de Noronha",
      tags: ["Sunset", "Sailing", "Luxury", "Food & Drinks"]
    });

    // Sample accommodations
    this.createAccommodation({
      title: "Oceanfront Villa Serenity",
      description: "A luxurious 3-bedroom villa with panoramic ocean views, private infinity pool, and direct beach access.",
      price: 750,
      image: "https://images.unsplash.com/photo-1571896349842-33c89424de2d?ixlib=rb-4.0.3&auto=format&fit=crop&w=1480&q=80",
      featured: true,
      rating: 4.9,
      location: "Praia do Sueste, Fernando de Noronha",
      amenities: ["Private Pool", "Beach Access", "Air Conditioning", "Full Kitchen", "WiFi"],
      bedrooms: 3,
      capacity: 6
    });

    this.createAccommodation({
      title: "Eco-Luxury Bungalow",
      description: "Sustainable luxury in a private bungalow surrounded by tropical vegetation, featuring solar power and rainwater harvesting.",
      price: 390,
      image: "https://images.unsplash.com/photo-1602002418082-dd4a3f5298d8?ixlib=rb-4.0.3&auto=format&fit=crop&w=1974&q=80",
      featured: true,
      rating: 4.8,
      location: "Morro do Pico Area, Fernando de Noronha",
      amenities: ["Eco-Friendly", "Outdoor Shower", "Garden View", "Breakfast Included"],
      bedrooms: 1,
      capacity: 2
    });

    // Sample packages
    this.createPackage({
      title: "Adventure Explorer",
      description: "Perfect for thrill-seekers, this package includes snorkeling, hiking to Pico hill, boat tour, and more.",
      price: 1295,
      image: "https://images.unsplash.com/photo-1586005660198-47ec6ff5a5ce?ixlib=rb-4.0.3&auto=format&fit=crop&w=2071&q=80",
      featured: true,
      duration: "5 days / 4 nights",
      inclusions: ["5 days / 4 nights luxury accommodation", "4 adventure activities", "Airport transfers included", "Daily breakfast and 2 special dinners"],
      tags: ["Adventure", "Active", "Nature"]
    });

    this.createPackage({
      title: "Relaxation Retreat",
      description: "Unwind with beach yoga, spa treatments, sunset sailing, and peaceful moments on the island's most secluded beaches.",
      price: 1695,
      image: "https://images.unsplash.com/photo-1544551763-92ab472cad5d?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80",
      featured: true,
      duration: "6 days / 5 nights",
      inclusions: ["6 days / 5 nights eco-luxury accommodation", "3 spa treatments & daily yoga", "Private beach picnic & sunset sailing", "All meals with healthy, local cuisine"],
      tags: ["Relaxation", "Wellness", "Spa"]
    });

    this.createPackage({
      title: "Family Discovery",
      description: "Create unforgettable memories with activities suitable for all ages, including wildlife encounters and educational experiences.",
      price: 4495,
      image: "https://images.unsplash.com/photo-1540541338287-41700207dee6?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80",
      featured: true,
      duration: "7 days / 6 nights",
      inclusions: ["7 days / 6 nights family villa", "Kid-friendly activities & nature tours", "Marine conservation workshop", "All meals & special family dinner"],
      tags: ["Family", "Educational", "Kid-friendly"]
    });

    // Sample vehicles
    this.createVehicle({
      vehicleType: "buggy",
      title: "Island Explorer Buggy",
      description: "Perfect for navigating the island's beaches and hills, this open-air buggy offers freedom and adventure.",
      pricePerDay: 85,
      image: "https://images.unsplash.com/photo-1566775809090-f819c83325ba?ixlib=rb-4.0.3&auto=format&fit=crop&w=1974&q=80",
      capacity: 4,
      features: ["4x4 Capability", "Open Air", "Bluetooth Audio", "GPS Navigation"]
    });

    this.createVehicle({
      vehicleType: "scooter",
      title: "Eco Scooter",
      description: "Environmentally friendly electric scooter for easy and fun transportation around the island.",
      pricePerDay: 45,
      image: "https://images.unsplash.com/photo-1558980663-3685c1d673c4?ixlib=rb-4.0.3&auto=format&fit=crop&w=1970&q=80",
      capacity: 2,
      features: ["Electric", "Eco-friendly", "Helmet Included", "Easy to Park"]
    });

    // Sample restaurants
    this.createRestaurant({
      name: "Mirante do Noronha",
      description: "Stunning seafood restaurant with panoramic views of the island and ocean, specializing in freshly caught local fish.",
      cuisine: "Seafood",
      priceRange: "$$$",
      image: "https://images.unsplash.com/photo-1516997121675-4c2d1684aa3e?ixlib=rb-4.0.3&auto=format&fit=crop&w=1974&q=80",
      location: "Morro do Pico, Fernando de Noronha",
      openingHours: "12PM-10PM daily",
      featured: true,
      rating: 4.8
    });

    this.createRestaurant({
      name: "Eco Café",
      description: "Organic café serving sustainable, locally-sourced breakfast and lunch options with excellent coffee.",
      cuisine: "Vegetarian",
      priceRange: "$$",
      image: "https://images.unsplash.com/photo-1521017432531-fbd92d768814?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80",
      location: "Vila dos Remédios, Fernando de Noronha",
      openingHours: "7AM-3PM daily",
      featured: true,
      rating: 4.7
    });

    // Sample testimonials
    this.createTestimonial({
      userId: 1,
      content: "The Dolphin Bay Tour was the highlight of our trip! The guides were knowledgeable and passionate, making sure we had the perfect experience while respecting the marine life.",
      rating: 5.0,
      experienceId: 1,
      approved: true
    });

    this.createTestimonial({
      userId: 1,
      content: "Staying at the Oceanfront Villa Serenity was a dream come true. The views were spectacular, and the staff went above and beyond to ensure our comfort. Worth every penny!",
      rating: 5.0,
      accommodationId: 1,
      approved: true
    });

    this.createTestimonial({
      userId: 1,
      content: "The luxury sunset sailing exceeded our expectations. The crew was professional, the catamaran was immaculate, and the sunset views with champagne were absolutely magical.",
      rating: 5.0,
      experienceId: 3,
      approved: true
    });
  }
}

export const storage = new MemStorage();
