import { createRoot } from "react-dom/client";
import App from "./App";
import "./index.css";
import { createClient } from "@supabase/supabase-js";

// Import i18n config
import "./i18n";

// Initialize Supabase client
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || "https://xyzcompany.supabase.co";
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || "your-anon-key";

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

createRoot(document.getElementById("root")!).render(<App />);
