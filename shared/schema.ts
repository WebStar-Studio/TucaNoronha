import { pgTable, text, serial, integer, boolean, timestamp, doublePrecision, jsonb } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";
import { relations } from "drizzle-orm";

// User schema
export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  email: text("email").notNull().unique(),
  password: text("password").notNull(),
  firstName: text("first_name"),
  lastName: text("last_name"),
  profilePicture: text("profile_picture"),
  role: text("role").default("user").notNull(),
  // Travel-related information
  travelDates: jsonb("travel_dates"), // Store arrival/departure as JSON
  groupSize: integer("group_size"), // Number of travelers
  travelInterests: text("travel_interests").array(), // Array of interests (nature, diving, etc.)
  accommodationPreference: text("accommodation_preference"), // Luxury, mid-range, budget
  dietaryRestrictions: text("dietary_restrictions").array(), // Food restrictions/preferences
  activityLevel: text("activity_level"), // Adventure level: high, medium, low 
  transportPreference: text("transport_preference"), // Car rental, guided tour, public transport
  specialRequirements: text("special_requirements"), // Accessibility needs, etc.
  previousVisit: boolean("previous_visit").default(false), // Has visited before?
  createdAt: timestamp("created_at").defaultNow(),
});

// Experience schema
export const experiences = pgTable("experiences", {
  id: serial("id").primaryKey(),
  title: text("title").notNull(),
  description: text("description").notNull(),
  price: doublePrecision("price").notNull(),
  duration: text("duration").notNull(),
  image: text("image").notNull(),
  featured: boolean("featured").default(false),
  rating: doublePrecision("rating"),
  location: text("location"),
  tags: text("tags").array(),
  createdAt: timestamp("created_at").defaultNow(),
});

// Accommodation schema
export const accommodations = pgTable("accommodations", {
  id: serial("id").primaryKey(),
  title: text("title").notNull(),
  description: text("description").notNull(),
  price: doublePrecision("price").notNull(),
  image: text("image").notNull(),
  featured: boolean("featured").default(false),
  rating: doublePrecision("rating"),
  location: text("location"),
  amenities: text("amenities").array(),
  bedrooms: integer("bedrooms"),
  capacity: integer("capacity"),
  createdAt: timestamp("created_at").defaultNow(),
});

// Package schema
export const packages = pgTable("packages", {
  id: serial("id").primaryKey(),
  title: text("title").notNull(),
  description: text("description").notNull(),
  price: doublePrecision("price").notNull(),
  image: text("image").notNull(),
  featured: boolean("featured").default(false),
  duration: text("duration").notNull(),
  duration_days: integer("duration_days").notNull(),
  location: text("location"),
  rating: doublePrecision("rating"),
  min_people: integer("min_people").default(1),
  max_people: integer("max_people").default(4),
  includes: text("includes").array(),
  inclusions: text("inclusions").array(),
  tags: text("tags").array(),
  createdAt: timestamp("created_at").defaultNow(),
});

// Vehicle Rental schema
export const vehicleRentals = pgTable("vehicle_rentals", {
  id: serial("id").primaryKey(),
  vehicleType: text("vehicle_type").notNull(),
  title: text("title").notNull(),
  description: text("description").notNull(),
  pricePerDay: doublePrecision("price_per_day").notNull(),
  image: text("image").notNull(),
  capacity: integer("capacity"),
  features: text("features").array(),
  createdAt: timestamp("created_at").defaultNow(),
});

// Restaurant schema
export const restaurants = pgTable("restaurants", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  description: text("description").notNull(),
  cuisine: text("cuisine").notNull(),
  priceRange: text("price_range").notNull(),
  image: text("image").notNull(),
  location: text("location"),
  openingHours: text("opening_hours"),
  featured: boolean("featured").default(false),
  rating: doublePrecision("rating"),
  createdAt: timestamp("created_at").defaultNow(),
});

// Booking schema
export const bookings = pgTable("bookings", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").notNull().references(() => users.id),
  bookingType: text("booking_type").notNull(),
  itemId: integer("item_id").notNull(),
  startDate: timestamp("start_date").notNull(),
  endDate: timestamp("end_date").notNull(),
  guests: integer("guests").notNull(),
  totalPrice: doublePrecision("total_price").notNull(),
  status: text("status").default("pending").notNull(),
  createdAt: timestamp("created_at").defaultNow(),
});

// Testimonial schema
export const testimonials = pgTable("testimonials", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").notNull().references(() => users.id),
  content: text("content").notNull(),
  rating: doublePrecision("rating").notNull(),
  experienceId: integer("experience_id").references(() => experiences.id),
  accommodationId: integer("accommodation_id").references(() => accommodations.id),
  packageId: integer("package_id").references(() => packages.id),
  approved: boolean("approved").default(false),
  createdAt: timestamp("created_at").defaultNow(),
});

// Insert schemas using drizzle-zod
export const insertUserSchema = createInsertSchema(users).omit({
  id: true,
  createdAt: true
});

export const insertExperienceSchema = createInsertSchema(experiences).omit({
  id: true,
  createdAt: true
});

export const insertAccommodationSchema = createInsertSchema(accommodations).omit({
  id: true,
  createdAt: true
});

export const insertPackageSchema = createInsertSchema(packages).omit({
  id: true,
  createdAt: true
});

export const insertVehicleRentalSchema = createInsertSchema(vehicleRentals).omit({
  id: true,
  createdAt: true
});

export const insertRestaurantSchema = createInsertSchema(restaurants).omit({
  id: true,
  createdAt: true
});

export const insertBookingSchema = createInsertSchema(bookings).omit({
  id: true,
  createdAt: true
});

export const insertTestimonialSchema = createInsertSchema(testimonials).omit({
  id: true,
  createdAt: true
});

// Define relationships
export const usersRelations = relations(users, ({ many }) => ({
  bookings: many(bookings),
  testimonials: many(testimonials),
}));

export const experiencesRelations = relations(experiences, ({ many }) => ({
  testimonials: many(testimonials),
}));

export const accommodationsRelations = relations(accommodations, ({ many }) => ({
  testimonials: many(testimonials),
}));

export const packagesRelations = relations(packages, ({ many }) => ({
  testimonials: many(testimonials),
}));

export const bookingsRelations = relations(bookings, ({ one }) => ({
  user: one(users, {
    fields: [bookings.userId],
    references: [users.id],
  }),
}));

export const testimonialsRelations = relations(testimonials, ({ one }) => ({
  user: one(users, {
    fields: [testimonials.userId],
    references: [users.id],
  }),
  experience: one(experiences, {
    fields: [testimonials.experienceId],
    references: [experiences.id],
  }),
  accommodation: one(accommodations, {
    fields: [testimonials.accommodationId],
    references: [accommodations.id],
  }),
  package: one(packages, {
    fields: [testimonials.packageId],
    references: [packages.id],
  }),
}));

// Types
export type InsertUser = z.infer<typeof insertUserSchema>;
export type User = typeof users.$inferSelect;

export type InsertExperience = z.infer<typeof insertExperienceSchema>;
export type Experience = typeof experiences.$inferSelect;

export type InsertAccommodation = z.infer<typeof insertAccommodationSchema>;
export type Accommodation = typeof accommodations.$inferSelect;

export type InsertPackage = z.infer<typeof insertPackageSchema>;
export type Package = typeof packages.$inferSelect;

export type InsertVehicleRental = z.infer<typeof insertVehicleRentalSchema>;
export type VehicleRental = typeof vehicleRentals.$inferSelect;

export type InsertRestaurant = z.infer<typeof insertRestaurantSchema>;
export type Restaurant = typeof restaurants.$inferSelect;

export type InsertBooking = z.infer<typeof insertBookingSchema>;
export type Booking = typeof bookings.$inferSelect;

export type InsertTestimonial = z.infer<typeof insertTestimonialSchema>;
export type Testimonial = typeof testimonials.$inferSelect;
