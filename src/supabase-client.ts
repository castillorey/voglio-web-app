
import { createClient } from '@supabase/supabase-js'

const supabaseUrl = "https://bblscslptefmqyjhizvl.supabase.co";
const supabaseKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImJibHNjc2xwdGVmbXF5amhpenZsIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MzY2MTI5NzQsImV4cCI6MjA1MjE4ODk3NH0.9Q463B1wGmM8fv7EZwr7Jx3U_5rJrqAAo6_2ZbmCFgE";

const supabase = createClient(supabaseUrl, supabaseKey);
export default supabase;