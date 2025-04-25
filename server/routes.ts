import type { Express, Request, Response, NextFunction } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { 
  insertExperienceSchema, 
  insertAccommodationSchema, 
  insertPackageSchema,
  insertVehicleRentalSchema,
  insertRestaurantSchema,
  insertTestimonialSchema,
  insertFavoriteSchema
} from "@shared/schema";
import { z } from "zod";
import { ParsedQs } from "qs";
import session from "express-session";

// Add types for Express session
declare module "express-session" {
  interface SessionData {
    userId?: number;
  }
}

// Define custom request type with session
interface RequestWithSession extends Request {
  session: session.Session & session.SessionData;
}

export async function registerRoutes(app: Express): Promise<Server> {
  // Middleware setup
  // Auth middleware for protected routes
  const requireAuth = (req: RequestWithSession, res: Response, next: NextFunction): Response | void => {
    if (!req.session.userId) {
      return res.status(401).json({ message: 'Authentication required' });
    }
    next();
  };

  // Middleware to check if user is an admin
  const requireAdmin = async (req: RequestWithSession, res: Response, next: NextFunction): Promise<Response | void> => {
    if (!req.session.userId) {
      return res.status(401).json({ message: 'Authentication required' });
    }
    
    try {
      const user = await storage.getUser(req.session.userId);
      if (!user || user.role !== 'admin') {
        return res.status(403).json({ message: 'Admin access required' });
      }
      next();
    } catch (error) {
      console.error('Admin check error:', error);
      return res.status(500).json({ message: 'Server error' });
    }
  };
  
  // AUTH ROUTES
  app.post('/api/auth/register', async (req: RequestWithSession, res: Response) => {
    try {
      // Extract basic user data
      const userData = {
        email: req.body.email,
        password: req.body.password,
        firstName: req.body.firstName,
        lastName: req.body.lastName,
        role: 'user', // Default role for new users
        // Extract travel preferences if present
        travelDates: req.body.travelDates,
        groupSize: req.body.groupSize,
        travelInterests: req.body.travelInterests,
        accommodationPreference: req.body.accommodationPreference,
        dietaryRestrictions: req.body.dietaryRestrictions,
        activityLevel: req.body.activityLevel,
        transportPreference: req.body.transportPreference,
        specialRequirements: req.body.specialRequirements,
        previousVisit: req.body.previousVisit
      };
      
      const user = await storage.createUser(userData);
      
      // Set the user's ID in the session to log them in
      req.session.userId = user.id;
      
      res.status(201).json({ 
        message: 'User registered successfully',
        user: { 
          id: user.id, 
          email: user.email,
          firstName: user.firstName,
          lastName: user.lastName,
          role: user.role,
          // Include travel preferences in response
          travelDates: user.travelDates,
          groupSize: user.groupSize,
          travelInterests: user.travelInterests
        } 
      });
    } catch (error) {
      console.error('Registration error:', error);
      res.status(400).json({ message: 'Registration failed' });
    }
  });

  app.post('/api/auth/login', async (req: RequestWithSession, res: Response) => {
    try {
      const { email, password } = req.body;
      
      const user = await storage.getUserByEmail(email);
      if (!user || user.password !== password) {
        return res.status(401).json({ message: 'Invalid credentials' });
      }
      
      // Set user in session
      req.session.userId = user.id;
      
      res.json({ 
        message: 'Login successful',
        user: { 
          id: user.id, 
          email: user.email,
          firstName: user.firstName,
          lastName: user.lastName,
          role: user.role
        } 
      });
    } catch (error) {
      console.error('Login error:', error);
      res.status(500).json({ message: 'Login failed' });
    }
  });

  app.post('/api/auth/logout', (req: RequestWithSession, res: Response) => {
    req.session.destroy(err => {
      if (err) {
        return res.status(500).json({ message: 'Logout failed' });
      }
      res.json({ message: 'Logout successful' });
    });
  });

  app.get('/api/auth/me', async (req: RequestWithSession, res: Response) => {
    if (!req.session.userId) {
      return res.status(401).json({ message: 'Not authenticated' });
    }
    
    try {
      const user = await storage.getUser(req.session.userId);
      if (!user) {
        return res.status(404).json({ message: 'User not found' });
      }
      
      res.json({ 
        user: { 
          id: user.id, 
          email: user.email,
          firstName: user.firstName,
          lastName: user.lastName,
          role: user.role,
          profilePicture: user.profilePicture
        } 
      });
    } catch (error) {
      console.error('Auth check error:', error);
      res.status(500).json({ message: 'Authentication check failed' });
    }
  });

  // EXPERIENCES ROUTES
  app.get('/api/experiences', async (req, res) => {
    try {
      const experiences = await storage.getAllExperiences();
      res.json(experiences);
    } catch (error) {
      console.error('Error fetching experiences:', error);
      res.status(500).json({ message: 'Failed to fetch experiences' });
    }
  });

  app.get('/api/experiences/featured', async (req, res) => {
    try {
      const experiences = await storage.getFeaturedExperiences();
      res.json(experiences);
    } catch (error) {
      console.error('Error fetching featured experiences:', error);
      res.status(500).json({ message: 'Failed to fetch featured experiences' });
    }
  });

  app.get('/api/experiences/:id', async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const experience = await storage.getExperienceById(id);
      
      if (!experience) {
        return res.status(404).json({ message: 'Experience not found' });
      }
      
      res.json(experience);
    } catch (error) {
      console.error('Error fetching experience:', error);
      res.status(500).json({ message: 'Failed to fetch experience' });
    }
  });

  app.post('/api/experiences', requireAdmin, async (req, res) => {
    try {
      const result = insertExperienceSchema.safeParse(req.body);
      if (!result.success) {
        return res.status(400).json({ message: 'Invalid experience data', errors: result.error.format() });
      }
      
      const experience = await storage.createExperience(result.data);
      res.status(201).json(experience);
    } catch (error) {
      console.error('Error creating experience:', error);
      res.status(500).json({ message: 'Failed to create experience' });
    }
  });

  app.patch('/api/experiences/:id', requireAdmin, async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const existingExperience = await storage.getExperienceById(id);
      
      if (!existingExperience) {
        return res.status(404).json({ message: 'Experience not found' });
      }
      
      const result = insertExperienceSchema.partial().safeParse(req.body);
      if (!result.success) {
        return res.status(400).json({ message: 'Invalid experience data', errors: result.error.format() });
      }
      
      const updatedExperience = await storage.updateExperience(id, result.data);
      res.json(updatedExperience);
    } catch (error) {
      console.error('Error updating experience:', error);
      res.status(500).json({ message: 'Failed to update experience' });
    }
  });

  app.delete('/api/experiences/:id', requireAdmin, async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const existingExperience = await storage.getExperienceById(id);
      
      if (!existingExperience) {
        return res.status(404).json({ message: 'Experience not found' });
      }
      
      await storage.deleteExperience(id);
      res.json({ message: 'Experience deleted successfully' });
    } catch (error) {
      console.error('Error deleting experience:', error);
      res.status(500).json({ message: 'Failed to delete experience' });
    }
  });

  // ACCOMMODATIONS ROUTES
  app.get('/api/accommodations', async (req, res) => {
    try {
      const accommodations = await storage.getAllAccommodations();
      res.json(accommodations);
    } catch (error) {
      console.error('Error fetching accommodations:', error);
      res.status(500).json({ message: 'Failed to fetch accommodations' });
    }
  });

  app.get('/api/accommodations/featured', async (req, res) => {
    try {
      const accommodations = await storage.getFeaturedAccommodations();
      res.json(accommodations);
    } catch (error) {
      console.error('Error fetching featured accommodations:', error);
      res.status(500).json({ message: 'Failed to fetch featured accommodations' });
    }
  });

  app.get('/api/accommodations/:id', async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const accommodation = await storage.getAccommodationById(id);
      
      if (!accommodation) {
        return res.status(404).json({ message: 'Accommodation not found' });
      }
      
      res.json(accommodation);
    } catch (error) {
      console.error('Error fetching accommodation:', error);
      res.status(500).json({ message: 'Failed to fetch accommodation' });
    }
  });

  app.post('/api/accommodations', requireAdmin, async (req, res) => {
    try {
      const result = insertAccommodationSchema.safeParse(req.body);
      if (!result.success) {
        return res.status(400).json({ message: 'Invalid accommodation data', errors: result.error.format() });
      }
      
      const accommodation = await storage.createAccommodation(result.data);
      res.status(201).json(accommodation);
    } catch (error) {
      console.error('Error creating accommodation:', error);
      res.status(500).json({ message: 'Failed to create accommodation' });
    }
  });

  app.patch('/api/accommodations/:id', requireAdmin, async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const existingAccommodation = await storage.getAccommodationById(id);
      
      if (!existingAccommodation) {
        return res.status(404).json({ message: 'Accommodation not found' });
      }
      
      const result = insertAccommodationSchema.partial().safeParse(req.body);
      if (!result.success) {
        return res.status(400).json({ message: 'Invalid accommodation data', errors: result.error.format() });
      }
      
      const updatedAccommodation = await storage.updateAccommodation(id, result.data);
      res.json(updatedAccommodation);
    } catch (error) {
      console.error('Error updating accommodation:', error);
      res.status(500).json({ message: 'Failed to update accommodation' });
    }
  });

  app.delete('/api/accommodations/:id', requireAdmin, async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const existingAccommodation = await storage.getAccommodationById(id);
      
      if (!existingAccommodation) {
        return res.status(404).json({ message: 'Accommodation not found' });
      }
      
      await storage.deleteAccommodation(id);
      res.json({ message: 'Accommodation deleted successfully' });
    } catch (error) {
      console.error('Error deleting accommodation:', error);
      res.status(500).json({ message: 'Failed to delete accommodation' });
    }
  });

  // PACKAGES ROUTES
  app.get('/api/packages', async (req, res) => {
    try {
      const packages = await storage.getAllPackages();
      res.json(packages);
    } catch (error) {
      console.error('Error fetching packages:', error);
      res.status(500).json({ message: 'Failed to fetch packages' });
    }
  });

  app.get('/api/packages/featured', async (req, res) => {
    try {
      const packages = await storage.getFeaturedPackages();
      res.json(packages);
    } catch (error) {
      console.error('Error fetching featured packages:', error);
      res.status(500).json({ message: 'Failed to fetch featured packages' });
    }
  });

  app.get('/api/packages/:id', async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const pkg = await storage.getPackageById(id);
      
      if (!pkg) {
        return res.status(404).json({ message: 'Package not found' });
      }
      
      res.json(pkg);
    } catch (error) {
      console.error('Error fetching package:', error);
      res.status(500).json({ message: 'Failed to fetch package' });
    }
  });

  app.post('/api/packages', requireAdmin, async (req, res) => {
    try {
      const result = insertPackageSchema.safeParse(req.body);
      if (!result.success) {
        return res.status(400).json({ message: 'Invalid package data', errors: result.error.format() });
      }
      
      const pkg = await storage.createPackage(result.data);
      res.status(201).json(pkg);
    } catch (error) {
      console.error('Error creating package:', error);
      res.status(500).json({ message: 'Failed to create package' });
    }
  });

  app.patch('/api/packages/:id', requireAdmin, async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const existingPackage = await storage.getPackageById(id);
      
      if (!existingPackage) {
        return res.status(404).json({ message: 'Package not found' });
      }
      
      const result = insertPackageSchema.partial().safeParse(req.body);
      if (!result.success) {
        return res.status(400).json({ message: 'Invalid package data', errors: result.error.format() });
      }
      
      const updatedPackage = await storage.updatePackage(id, result.data);
      res.json(updatedPackage);
    } catch (error) {
      console.error('Error updating package:', error);
      res.status(500).json({ message: 'Failed to update package' });
    }
  });

  app.delete('/api/packages/:id', requireAdmin, async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const existingPackage = await storage.getPackageById(id);
      
      if (!existingPackage) {
        return res.status(404).json({ message: 'Package not found' });
      }
      
      await storage.deletePackage(id);
      res.json({ message: 'Package deleted successfully' });
    } catch (error) {
      console.error('Error deleting package:', error);
      res.status(500).json({ message: 'Failed to delete package' });
    }
  });

  // VEHICLES ROUTES
  app.get('/api/vehicles', async (req, res) => {
    try {
      const vehicles = await storage.getAllVehicles();
      res.json(vehicles);
    } catch (error) {
      console.error('Error fetching vehicles:', error);
      res.status(500).json({ message: 'Failed to fetch vehicles' });
    }
  });

  app.get('/api/vehicles/:id', async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const vehicle = await storage.getVehicleById(id);
      
      if (!vehicle) {
        return res.status(404).json({ message: 'Vehicle not found' });
      }
      
      res.json(vehicle);
    } catch (error) {
      console.error('Error fetching vehicle:', error);
      res.status(500).json({ message: 'Failed to fetch vehicle' });
    }
  });

  app.post('/api/vehicles', requireAdmin, async (req, res) => {
    try {
      const result = insertVehicleRentalSchema.safeParse(req.body);
      if (!result.success) {
        return res.status(400).json({ message: 'Invalid vehicle data', errors: result.error.format() });
      }
      
      const vehicle = await storage.createVehicle(result.data);
      res.status(201).json(vehicle);
    } catch (error) {
      console.error('Error creating vehicle:', error);
      res.status(500).json({ message: 'Failed to create vehicle' });
    }
  });

  app.patch('/api/vehicles/:id', requireAdmin, async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const existingVehicle = await storage.getVehicleById(id);
      
      if (!existingVehicle) {
        return res.status(404).json({ message: 'Vehicle not found' });
      }
      
      const result = insertVehicleRentalSchema.partial().safeParse(req.body);
      if (!result.success) {
        return res.status(400).json({ message: 'Invalid vehicle data', errors: result.error.format() });
      }
      
      const updatedVehicle = await storage.updateVehicle(id, result.data);
      res.json(updatedVehicle);
    } catch (error) {
      console.error('Error updating vehicle:', error);
      res.status(500).json({ message: 'Failed to update vehicle' });
    }
  });

  app.delete('/api/vehicles/:id', requireAdmin, async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const existingVehicle = await storage.getVehicleById(id);
      
      if (!existingVehicle) {
        return res.status(404).json({ message: 'Vehicle not found' });
      }
      
      await storage.deleteVehicle(id);
      res.json({ message: 'Vehicle deleted successfully' });
    } catch (error) {
      console.error('Error deleting vehicle:', error);
      res.status(500).json({ message: 'Failed to delete vehicle' });
    }
  });

  // RESTAURANTS ROUTES
  app.get('/api/restaurants', async (req, res) => {
    try {
      const restaurants = await storage.getAllRestaurants();
      res.json(restaurants);
    } catch (error) {
      console.error('Error fetching restaurants:', error);
      res.status(500).json({ message: 'Failed to fetch restaurants' });
    }
  });

  app.get('/api/restaurants/featured', async (req, res) => {
    try {
      const restaurants = await storage.getFeaturedRestaurants();
      res.json(restaurants);
    } catch (error) {
      console.error('Error fetching featured restaurants:', error);
      res.status(500).json({ message: 'Failed to fetch featured restaurants' });
    }
  });

  app.get('/api/restaurants/:id', async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const restaurant = await storage.getRestaurantById(id);
      
      if (!restaurant) {
        return res.status(404).json({ message: 'Restaurant not found' });
      }
      
      res.json(restaurant);
    } catch (error) {
      console.error('Error fetching restaurant:', error);
      res.status(500).json({ message: 'Failed to fetch restaurant' });
    }
  });

  app.post('/api/restaurants', requireAdmin, async (req, res) => {
    try {
      const result = insertRestaurantSchema.safeParse(req.body);
      if (!result.success) {
        return res.status(400).json({ message: 'Invalid restaurant data', errors: result.error.format() });
      }
      
      const restaurant = await storage.createRestaurant(result.data);
      res.status(201).json(restaurant);
    } catch (error) {
      console.error('Error creating restaurant:', error);
      res.status(500).json({ message: 'Failed to create restaurant' });
    }
  });

  app.patch('/api/restaurants/:id', requireAdmin, async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const existingRestaurant = await storage.getRestaurantById(id);
      
      if (!existingRestaurant) {
        return res.status(404).json({ message: 'Restaurant not found' });
      }
      
      const result = insertRestaurantSchema.partial().safeParse(req.body);
      if (!result.success) {
        return res.status(400).json({ message: 'Invalid restaurant data', errors: result.error.format() });
      }
      
      const updatedRestaurant = await storage.updateRestaurant(id, result.data);
      res.json(updatedRestaurant);
    } catch (error) {
      console.error('Error updating restaurant:', error);
      res.status(500).json({ message: 'Failed to update restaurant' });
    }
  });

  app.delete('/api/restaurants/:id', requireAdmin, async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const existingRestaurant = await storage.getRestaurantById(id);
      
      if (!existingRestaurant) {
        return res.status(404).json({ message: 'Restaurant not found' });
      }
      
      await storage.deleteRestaurant(id);
      res.json({ message: 'Restaurant deleted successfully' });
    } catch (error) {
      console.error('Error deleting restaurant:', error);
      res.status(500).json({ message: 'Failed to delete restaurant' });
    }
  });

  // TESTIMONIALS ROUTES
  app.get('/api/testimonials', async (req, res) => {
    try {
      const testimonials = await storage.getAllTestimonials();
      res.json(testimonials);
    } catch (error) {
      console.error('Error fetching testimonials:', error);
      res.status(500).json({ message: 'Failed to fetch testimonials' });
    }
  });

  app.get('/api/testimonials/approved', async (req, res) => {
    try {
      const testimonials = await storage.getApprovedTestimonials();
      res.json(testimonials);
    } catch (error) {
      console.error('Error fetching approved testimonials:', error);
      res.status(500).json({ message: 'Failed to fetch approved testimonials' });
    }
  });

  app.post('/api/testimonials', async (req, res) => {
    try {
      if (!req.session.userId) {
        return res.status(401).json({ message: 'Authentication required' });
      }
      
      const result = insertTestimonialSchema.safeParse({
        ...req.body,
        userId: req.session.userId
      });
      
      if (!result.success) {
        return res.status(400).json({ message: 'Invalid testimonial data', errors: result.error.format() });
      }
      
      const testimonial = await storage.createTestimonial(result.data);
      res.status(201).json(testimonial);
    } catch (error) {
      console.error('Error creating testimonial:', error);
      res.status(500).json({ message: 'Failed to create testimonial' });
    }
  });

  app.patch('/api/testimonials/:id/approve', requireAdmin, async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const existingTestimonial = await storage.getTestimonialById(id);
      
      if (!existingTestimonial) {
        return res.status(404).json({ message: 'Testimonial not found' });
      }
      
      const updatedTestimonial = await storage.approveTestimonial(id);
      res.json(updatedTestimonial);
    } catch (error) {
      console.error('Error approving testimonial:', error);
      res.status(500).json({ message: 'Failed to approve testimonial' });
    }
  });

  // FAVORITES ROUTES

  // Get all favorites for the logged in user
  app.get('/api/favorites', requireAuth, async (req: RequestWithSession, res: Response) => {
    try {
      // We can safely use userId here because requireAuth middleware ensures it exists
      const userId = req.session.userId as number;
      const favorites = await storage.getUserFavorites(userId);
      res.json(favorites);
    } catch (error) {
      console.error('Error fetching favorites:', error);
      res.status(500).json({ message: 'Failed to fetch favorites' });
    }
  });

  // Add a new item to favorites
  app.post('/api/favorites', requireAuth, async (req: RequestWithSession, res: Response) => {
    try {
      const userId = req.session.userId as number;
      
      const result = insertFavoriteSchema.safeParse({
        ...req.body,
        userId
      });
      
      if (!result.success) {
        return res.status(400).json({ message: 'Invalid favorite data', errors: result.error.format() });
      }

      // Check if item is already in favorites
      const isFavorite = await storage.checkIsFavorite(
        userId,
        result.data.itemType,
        result.data.itemId
      );

      if (isFavorite) {
        return res.status(400).json({ message: 'Item is already in favorites' });
      }
      
      const favorite = await storage.addFavorite(result.data);
      res.status(201).json(favorite);
    } catch (error) {
      console.error('Error adding favorite:', error);
      res.status(500).json({ message: 'Failed to add favorite' });
    }
  });

  // Check if an item is in the user's favorites
  app.get('/api/favorites/check', requireAuth, async (req: RequestWithSession, res: Response) => {
    try {
      const { itemType, itemId } = req.query;
      const userId = req.session.userId as number;
      
      if (!itemType || !itemId) {
        return res.status(400).json({ message: 'Missing itemType or itemId query parameters' });
      }
      
      const isFavorite = await storage.checkIsFavorite(
        userId,
        itemType as string,
        parseInt(itemId as string)
      );
      
      res.json({ isFavorite });
    } catch (error) {
      console.error('Error checking favorite status:', error);
      res.status(500).json({ message: 'Failed to check favorite status' });
    }
  });

  // Get a specific favorite by ID
  app.get('/api/favorites/:id', requireAuth, async (req: RequestWithSession, res: Response) => {
    try {
      const id = parseInt(req.params.id);
      const favorite = await storage.getFavoriteById(id);
      const userId = req.session.userId as number;
      
      if (!favorite) {
        return res.status(404).json({ message: 'Favorite not found' });
      }
      
      // Check if favorite belongs to the logged in user
      if (favorite.userId !== userId) {
        return res.status(403).json({ message: 'Access denied' });
      }
      
      res.json(favorite);
    } catch (error) {
      console.error('Error fetching favorite:', error);
      res.status(500).json({ message: 'Failed to fetch favorite' });
    }
  });

  // Update favorite notes
  app.patch('/api/favorites/:id', requireAuth, async (req: RequestWithSession, res: Response) => {
    try {
      const id = parseInt(req.params.id);
      const favorite = await storage.getFavoriteById(id);
      const userId = req.session.userId as number;
      
      if (!favorite) {
        return res.status(404).json({ message: 'Favorite not found' });
      }
      
      // Check if favorite belongs to the logged in user
      if (favorite.userId !== userId) {
        return res.status(403).json({ message: 'Access denied' });
      }
      
      const { notes } = req.body;
      if (notes === undefined) {
        return res.status(400).json({ message: 'Notes field is required' });
      }
      
      const updatedFavorite = await storage.updateFavoriteNotes(id, notes);
      res.json(updatedFavorite);
    } catch (error) {
      console.error('Error updating favorite:', error);
      res.status(500).json({ message: 'Failed to update favorite' });
    }
  });

  // Remove item from favorites
  app.delete('/api/favorites/:id', requireAuth, async (req: RequestWithSession, res: Response) => {
    try {
      const id = parseInt(req.params.id);
      const favorite = await storage.getFavoriteById(id);
      const userId = req.session.userId as number;
      
      if (!favorite) {
        return res.status(404).json({ message: 'Favorite not found' });
      }
      
      // Check if favorite belongs to the logged in user
      if (favorite.userId !== userId) {
        return res.status(403).json({ message: 'Access denied' });
      }
      
      await storage.deleteFavorite(id);
      res.json({ message: 'Favorite removed successfully' });
    } catch (error) {
      console.error('Error removing favorite:', error);
      res.status(500).json({ message: 'Failed to remove favorite' });
    }
  });

  const httpServer = createServer(app);

  return httpServer;
}
