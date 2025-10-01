
import { createClient } from '@supabase/supabase-js'

const supabaseUrl = "https://utmwcxmirkbgshowswyz.supabase.co";
const supabaseKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InV0bXdjeG1pcmtiZ3Nob3dzd3l6Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTg3MzAwMDIsImV4cCI6MjA3NDMwNjAwMn0.gzQoCtcLBrgHki3rxVnAYnoLqi111fqUYS5kmVet-a0";

const supabase = createClient(supabaseUrl, supabaseKey);
export default supabase;