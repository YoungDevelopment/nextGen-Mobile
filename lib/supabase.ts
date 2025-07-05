// lib/supabase.ts
import { createClient } from "@supabase/supabase-js";

const supabaseUrl = "https://bjkyfqzbarmskbguiknl.supabase.co";
const supabaseKey =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImJqa3lmcXpiYXJtc2tiZ3Vpa25sIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTE2MDM1NTQsImV4cCI6MjA2NzE3OTU1NH0.318b9Nyk-_16G63PsQmva9RwyIF_-E2L5oQYPXBBOTc";

export const supabase = createClient(supabaseUrl, supabaseKey);
