// This file is automatically generated. Do not edit it directly.
import { createClient } from '@supabase/supabase-js';
import type { Database } from './types';

const SUPABASE_URL = "https://jnaosnqzjgjtkrxizyrt.supabase.co";
const SUPABASE_PUBLISHABLE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImpuYW9zbnF6amdqdGtyeGl6eXJ0Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDkwNTYwNzQsImV4cCI6MjA2NDYzMjA3NH0.MwfsUrzPfeASn_gnr4fAaQaK9wExNkovIVY6IYOYuxo";

// Import the supabase client like this:
// import { supabase } from "@/integrations/supabase/client";

export const supabase = createClient<Database>(SUPABASE_URL, SUPABASE_PUBLISHABLE_KEY);