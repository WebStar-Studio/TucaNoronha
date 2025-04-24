import session from "express-session";
import { Express } from "express";
import { randomBytes } from "crypto";
import memorystore from "memorystore";

// Create a memory store for sessions
const MemoryStore = memorystore(session);

export function setupAuth(app: Express) {
  // Generate a random secret for the session
  const sessionSecret = process.env.SESSION_SECRET || randomBytes(32).toString('hex');
  
  // Configure session middleware
  app.use(session({
    secret: sessionSecret,
    resave: false,
    saveUninitialized: false,
    store: new MemoryStore({
      checkPeriod: 86400000 // prune expired entries every 24h
    }),
    cookie: {
      secure: process.env.NODE_ENV === 'production',
      maxAge: 24 * 60 * 60 * 1000 // 24 hours
    }
  }));
}